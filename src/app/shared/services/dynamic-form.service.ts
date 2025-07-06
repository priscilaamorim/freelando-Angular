import { Injectable } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup } from '@angular/forms';
import { FormConfig } from '../models/form-config.interface';

@Injectable({
  providedIn: 'root',
})
export class DynamicFormService {
  // 🔹 Armazena funções de configuração de formulários registrados
  private FormConfigs: { [key: string]: Function } = {};

  constructor(private fb: FormBuilder) {}

  // 🔸 Registro e leitura de configs

  // Registra uma função que retorna a configuração do formulário
  registrarFormConfig(formName: string, config: Function): void {
    this.FormConfigs[formName] = config;
  }

  // Retorna a configuração registrada usando o nome e parâmetros
  getFormConfig(formKey: string, ...args: any[]): FormConfig {
    if (!this.FormConfigs[formKey]) {
      throw new Error(`Configuração de formulário não encontrada: ${formKey}`);
    }

    return this.FormConfigs[formKey](...args); // Executa a função registrada
  }

  // 🔸 Criação de FormGroup dinâmico

  createFormGroup(
    config: FormConfig,
    formOptions?: AbstractControlOptions
  ): FormGroup {
    const formControls: { [key: string]: any } = {};

    config.fields.forEach((field) => {
      console.log(
        'asyncValidators for',
        field.formControlName,
        field.asyncValidators
      );
      formControls[field.formControlName] = [
        '', // Valor inicial
        field.validators || [], // Validadores síncronos
        field.asyncValidators || [], // Validadores assíncronos
      ];
    });

    return this.fb.group(formControls, formOptions);
  }
}
