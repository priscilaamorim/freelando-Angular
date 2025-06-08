import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailValidatorService {
   // Lista simulada de e-mails já cadastrados
  private emailsCadastrados = [
    'usuario1@exemplo.com',
    'usuario2@exemplo.com',
    'teste@exemplo.com',
    'admin@exemplo.com',
    'contato@exemplo.com',
  ];

   // Simula chamada para API verificando se o e-mail já existe
  verificaEmailExistente(email: string): Observable<boolean> {
    return of(this.emailsCadastrados.includes(email.toLocaleLowerCase())).pipe(
      delay(1500)
    ); // Simula um atraso de 1.5 segundos
  }
}
