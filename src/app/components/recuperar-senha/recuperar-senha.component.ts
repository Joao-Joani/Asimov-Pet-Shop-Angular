import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.scss'
})
export class RecuperarSenhaComponent {

// Cria um evento para avisar o componente pai que deve fechar
@Output() fecharModal = new EventEmitter<void>();

// Variável para controlar a animação
isClosing = false;

// Função chamada ao clicar no fundo escuro
fechar() {
  this.isClosing = true; // Aciona a animação de sumir

  // Espera a animação terminar (300ms) antes de avisar o componente pai
    setTimeout(() => {
      this.fecharModal.emit();
    }, 300);
  }
}