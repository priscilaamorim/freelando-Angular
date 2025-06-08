import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Habilidade } from '../models/habilidade.interface';
import { Idioma } from '../models/idioma.interface';

// 🔹 Interface com todos os dados do cadastro
interface CadastroData {
  foto?: string | ArrayBuffer | null;
  resumo?: string;
  habilidadesSelecionadas?: Array<Habilidade>;
  idiomas?: Array<Idioma>;
  portifolio?: string;
  linkedin?: string;
  areaAtuacao?: string;
  nivelExperiencia?: string;
  nomeCompleto?: string;
  estado?: string;
  cidade?: string;
  email?: string;
  senha?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CadastroService {
  // 🔹 Armazena os dados do cadastro de forma reativa
  private cadastroDataSubject = new BehaviorSubject<CadastroData>({});

  // 🔹 Observable somente leitura
  cadastroData$ = this.cadastroDataSubject.asObservable();

  constructor() {
    // 🔹 Recupera dados do localStorage ao iniciar
    const savedData = localStorage.getItem('cadastroData');
    if (savedData) {
      this.cadastroDataSubject.next(JSON.parse(savedData));
    }
  }

  // 🔹 Atualiza os dados do cadastro e salva no localStorage
  updateCadastroData(data: Partial<CadastroData>): void {
    const currentData = this.cadastroDataSubject.value;
    const updatedData = { ...currentData, ...data };
    this.cadastroDataSubject.next(updatedData);
    localStorage.setItem('cadastroData', JSON.stringify(updatedData));
  }

  // 🔹 Retorna os dados atuais do cadastro
  getCadastroData(): CadastroData {
    return this.cadastroDataSubject.value;
  }
}
