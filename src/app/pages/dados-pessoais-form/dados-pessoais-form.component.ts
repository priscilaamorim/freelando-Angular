import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router } from '@angular/router';
import { CadastroService } from '../../shared/services/cadastro.service';
import {
  BehaviorSubject,
  Observable,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import {
  Cidade,
  Estado,
  IbgeService,
} from '../../shared/services/ibge.service';
import { EmailValidatorService } from '../../shared/services/email-validator.service';
import { FormConfig } from '../../shared/models/form-config.interface';
import { DynamicFormService } from '../../shared/services/dynamic-form.service';
import { getDadosPessoaisConfig } from '../../config/dados-pessoais.config';
import { FormFieldBase } from '../../shared/models/form-field-base.interface';
export const senhasIguaisValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const senha = control.get('senha');
  const confirmaSenha = control.get('confirmaSenha');
  return senha && confirmaSenha && senha.value === confirmaSenha.value
    ? null
    : { senhasDiferentes: true };
};

@Component({
  selector: 'app-dados-pessoais-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
templateUrl: './dados-pessoais-form.component.html',
  styleUrls: ['./dados-pessoais-form.component.scss'],
})
export class DadosPessoaisFormComponent implements OnInit {
  dadosPessoaisForm!: FormGroup;
  formConfig!: FormConfig;

  estado$!: Observable<Estado[]>;
  cidades$!: Observable<Cidade[]>;

  carregandoCidades$ = new BehaviorSubject<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cadastroService: CadastroService,
    private ibgeService: IbgeService,
    private emailService: EmailValidatorService,
    private  dynamicFormService: DynamicFormService
  ) {
    this.dynamicFormService.registrarFormConfig('dadosPessoaisForm', 
      getDadosPessoaisConfig
    );
  }
  ngOnInit(): void {
this.formConfig = this.dynamicFormService.getFormConfig('dadosPessoaisForm');

    const formOptions: AbstractControlOptions = {
      validators: senhasIguaisValidator,
    };

    this.dadosPessoaisForm = this.dynamicFormService.createFormGroup(
      this.formConfig, {validators: senhasIguaisValidator,

      }
    )

const savedData = this.cadastroService.getCadastroData();
    if (savedData.nomeCompleto){
      this.dadosPessoaisForm.patchValue({
        nomeCompleto: savedData.nomeCompleto,
        estado: savedData.estado,
        cidade: savedData.cidade,
        email: savedData.email,
         senha: savedData.senha,
        confirmaSenha: savedData.senha, // Preenche confirmaSenha com o mesmo valor de senha
      });
    } 

    this.carregarEstados();
    this.configurarListernerEstado();
  }

  private salvarDadosAtuais() {
    const formValue = this.dadosPessoaisForm.value;

    this.cadastroService.updateCadastroData({
      nomeCompleto: formValue.nomeCompleto,
      estado: formValue.estado,
      cidade: formValue.cidade,
      email: formValue.email,
      senha: formValue.senha,
    });
  }

  onAnterior(): void {
    this.salvarDadosAtuais();
    this.router.navigate(['/cadastro/area-atuacao']);
  }

  onProximo(): void {
    if (this.dadosPessoaisForm.valid) {
      this.salvarDadosAtuais();
      this.router.navigate(['/cadastro/confirmacao']);
    } else {
      this.dadosPessoaisForm.markAllAsTouched();
    }
  }

  isFieldType(field: FormFieldBase, type: string): boolean {
    return field.type === type;
  }

   hasField(name: string): boolean {  
    return this.formConfig.fields.some(field => field.formControlName === name);  
  }  
  
  getFieldByName(name: string): FormFieldBase {  
    return this.formConfig.fields.find(field => field.formControlName === name) || {} as FormFieldBase;  
  }  
  
  // CARREGAR ESTADOS

  private carregarEstados(): void {
    this.estado$ = this.ibgeService.getEstados(); //Esse estado$ será usado no HTML com | async para preencher o <select> de estados.
  }

  // REAGIR À MUDANÇA DE ESTADO
  private configurarListernerEstado(): void {
    //Toda vez que o usuário escolhe um estado, isso acontece:
    const estadoControl = this.dadosPessoaisForm.get('estado');
    if (estadoControl) {
      this.cidades$ = estadoControl.valueChanges.pipe(
        startWith(''), //<-Dispara um valor inicial vazio
        tap(() => {
          //<-Executa efeitos colaterais (ex: resetar cidade, loading)
          this.resetarCidade(); // limpa o campo cidade
          this.carregandoCidades$.next(true); //ativa o loading
        }),
        //chama a API para buscar cidades
        switchMap((uf) => {
          //<-Cancela requisições antigas e só usa a última
          if (uf) {
            return this.ibgeService
              .getCidadesPorEstado(uf)
              .pipe(tap(() => this.carregandoCidades$.next(false)));
          }
          this.carregandoCidades$.next(false);
          return of([]); //	Retorna array vazio se não houver estado selecionado
        })
      );
    }
  }

  private resetarCidade(): void {
    this.dadosPessoaisForm.get('cidade')?.setValue(''); //limpamos o valor da cidade anterior
  }
}
