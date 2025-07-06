import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ChipComponent } from '../../shared/components/chip/chip.component';
import { CadastroService } from '../../shared/services/cadastro.service';

import { Habilidade } from '../../shared/models/habilidade.interface';
import { Idioma } from '../../shared/models/idioma.interface';



@Component({
  selector: 'app-perfil-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, ChipComponent],
  templateUrl: './perfil-form.component.html',
  styleUrls: ['./perfil-form.component.scss'],
})
export class PerfilFormComponent implements OnInit {
 
  // 🔸 Propriedades
 
  perfilForm!: FormGroup;
  fotoPreview: string | ArrayBuffer | null = null;
  caracteresRestantes: number = 70;

  habilidades: Habilidade[] = [
    { nome: 'Fullstack', selecionada: false },
    { nome: 'Front-end', selecionada: false },
    { nome: 'React', selecionada: false },
    { nome: 'Angular', selecionada: false },
  ];

  idiomas: string[] = ['Português', 'Inglês', 'Espanhol'];

  niveisIdioma: string[] = [
    'Básico',
    'Intermediário',
    'Avançado',
    'Fluente',
    'Nativo',
  ];

 
  // 🔸 Construtor
 
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cadastroService: CadastroService
  ) {}

 
  // 🔸 Lifecycle

  ngOnInit(): void {
    this.inicializarFormulario();

    this.perfilForm.get('resumo')?.valueChanges.subscribe(resumo => {
      this.caracteresRestantes = 70 - resumo.length;
    });
  
    }

 
  // 🔸 Métodos Públicos: Navegação
 
  onAnterior(): void {
    this.salvarDadosAtuais();
    this.router.navigate(['/cadastro/dados-pessoais']);
  }

  onProximo(): void {
    if (this.perfilForm.valid) {
      this.salvarDadosAtuais();
      this.router.navigate(['/cadastro/confirmacao']);
    }
  }

 
  // 🔸 Métodos Públicos: Manipulação de Habilidades
  
  toggleHabilidade(habilidade: Habilidade): void {
    habilidade.selecionada = !habilidade.selecionada;

    const habilidadesSelecionadas = this.habilidades
      .filter(h => h.selecionada)   // pega as selecionadas
      .map(h => h.nome);            // extrai o nome

    // Atualiza o campo no formulário
    this.perfilForm.patchValue({ habilidadesSelecionadas });
  }


  // 🔸 Métodos Públicos: Manipulação de Foto

  onFotoSelecionada(event: any): void {
    const file = event.target.files[0]; // Primeiro arquivo selecionado

    if (file) {
      const reader = new FileReader(); // Lê arquivo como base64

      reader.onload = () => {
        this.fotoPreview = reader.result;
        this.perfilForm.patchValue({ foto: reader.result });
      };

      reader.readAsDataURL(file);
    }
  }


  // 🔸 Métodos Públicos: Idiomas
  
  get idiomasArray(): FormArray {
    return this.perfilForm.get('idiomas') as FormArray;
  }

  adicionarIdioma(nome: string = '', nivel: string =  ''): void {
    const idiomaForm = this.fb.group({
      nome: [nome, Validators.required],
      nivel: [nivel, Validators.required],
    });

    this.idiomasArray.push(idiomaForm);
  }

 
 // Remove um idioma, exceto se for o primeiro e for 'Português'
  removerIdioma(index: number): void {
    if (
      index === 0 &&
      this.idiomasArray.at(0).get('nome')?.value === 'Português'
    ) {
      return; // Não permite remover o idioma Português
    }

    this.idiomasArray.removeAt(index);
  }

  
  // 🔸 Métodos Privados

  private inicializarFormulario(): void {
    this.perfilForm = this.fb.group({
      foto: [''],
      resumo: ['', [Validators.required, Validators.maxLength(70)]],
      habilidadesSelecionadas: [[],Validators.required],
      idiomas: this.fb.array([]),
      portifolio: ['', [Validators.pattern('https?://.+')]],
      linkedin: ['',  [Validators.pattern('https?://(www\\.)?linkedin\\.com/.+')] ],
    });

    // Idioma padrão
    this.adicionarIdioma('Português', 'Nativo');
  }

  private salvarDadosAtuais(): void {
    const formValue = this.perfilForm.value;

    this.cadastroService.updateCadastroData({
      foto: this.fotoPreview,
      resumo: formValue.resumo,
      habilidadesSelecionadas: formValue.habilidadesSelecionadas,
      idiomas: this.extrairIdiomas(),
      portifolio: formValue.portifolio,
      linkedin: formValue.linkedin,
    });
  }

  private extrairIdiomas(): Idioma[] {
    return this.idiomasArray.controls.map(control => ({
      nome: control.get('nome')?.value,
      nivel: control.get('nivel')?.value,
    }));
  }
}
