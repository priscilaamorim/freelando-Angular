import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { of, Observable, map } from 'rxjs';
import { EmailValidatorService } from '../services/email-validator.service';


// Validador assíncrono que verifica se o e-mail já está cadastrado
export function emailExistenteValidator(emailService: EmailValidatorService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
     // Se o campo estiver vazio, não valida
    if (!control.value) {
      return of(null);
    }

  // Verifica se o e-mail existe e retorna erro se já estiver cadastrado
  return of(emailService.verificaEmailExistente(control.value)).pipe(
    map(existe => existe ? { emailExistente: true } : null));
};
}
