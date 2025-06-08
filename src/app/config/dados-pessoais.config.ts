import { Validators } from '@angular/forms';
import { FormConfig } from '../shared/models/form-config.interface';
import { cpfValidator } from '../shared/validators/cpf.validator';
import { emailExistenteValidator } from '../shared/validators/emeilExistente.validator';

export function getDadosPessoaisConfig(emailService: any): FormConfig {
  return {
    title: 'CRIE SEU CADASTRO',
    description: 'CRIE SEU PERFIL GRATUITAMENTE PARA TRABALHAR COMO FREELANCER',
    fields: [
      {
        label: 'Nome Completo',
        formControlName: 'nomeCompleto',
        type: 'text',
        required: true,
        errorMessage: {
          required: 'O nome completo é obrigatório.',
        },
        validators: [Validators.required],
        width: 'full',
      },

       {
        label: 'CPF',
        formControlName: 'cpf',
        type: 'text',
        required: true,
        errorMessage: {
          required: 'CPF é obrigatório.',
          cpfInvalido: 'CPF inválido.',
        },
        validators: [Validators.required, cpfValidator],
        width: 'full',
      },
       {
        label: 'Estado',
        formControlName: 'estado',
        type: 'select',
        required: true,
        placeholder: 'Selecione',
        errorMessage: {
          required: 'Estado é obrigatório.',
        },
        validators: [Validators.required],
        width: 'half',
      },
       {
        label: 'Cidade',
        formControlName: 'cidade',
        type: 'select',
        required: true,
        errorMessage: {
          required: 'Cidade é obrigatório.',
        },
        validators: [Validators.required],
        width: 'half',
      },
       {
        label: 'E-mail',
        formControlName: 'email',
        type: 'email',
        required: true,
        errorMessage: {
          required: 'E-mail é obrigatório.',
            email: 'E-mail inválido.',
            emailExistente: 'E-mail já cadastrado.',
        },
        validators: [Validators.required, Validators.email],
        asyncValidators: [emailExistenteValidator(emailService)],
        width: 'full',
      },
       {
        label: 'Senha',
        formControlName: 'senha',
        type: 'password',
        required: true,
        errorMessage: {
          required: 'Senha é obrigatória.',
          minlength: 'A senha deve ter pelo menos 6 caracteres.',
        },
        validators: [Validators.required, Validators.minLength(6)],
        width: 'half',
      },
         {
          label: 'Repita a Senha',
          formControlName: 'confirmaSenha',
          type: 'password',
          required: true,
          errorMessage: {
             required: 'Confirmação de senha é obrigatória.',
          },
          validators: [Validators.required],
          width: 'half',
        },
    ],
  };
}
