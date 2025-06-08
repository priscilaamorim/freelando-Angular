import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';

// Modelos das respostas da API do IBGE
export interface Estado {
  id: number;
  sigla: string;
  nome: string;
}

export interface Cidade {
  id: number;
  nome: string;
}

@Injectable({
  providedIn: 'root',
})
export class IbgeService {
  private readonly API_URL = 'http://servicodados.ibge.gov.br/api/v1/localidades';

  constructor(private http: HttpClient) {}

  // 🔹 Retorna lista de estados ordenados por nome
  getEstados(): Observable<Estado[]> {
    return this.http
      .get<Estado[]>(`${this.API_URL}/estados?orderBy=nome`)
      .pipe(retry(2)); // Tenta até 2 vezes em caso de erro
  }

  // 🔹 Retorna lista de cidades com base na sigla do estado
  getCidadesPorEstado(uf: string): Observable<Cidade[]> {
    return this.http
      .get<Cidade[]>(`${this.API_URL}/estados/${uf}/municipios?orderBy=nome`)
      .pipe(retry(2));
  }
}
