import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-confirmacao',
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './confirmacao.component.html',
  styleUrl: './confirmacao.component.scss'
})
export class ConfirmacaoComponent {

}
