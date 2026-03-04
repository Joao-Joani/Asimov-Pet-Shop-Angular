import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.scss'
})
export class RecuperarSenhaComponent {

constructor(private authService: AuthService) { }

// Cria um evento para avisar o componente pai que deve fechar
@Output() fecharModal = new EventEmitter<void>();

// Variável para controlar a animação
isClosing = false;

email = '';

emailValidation(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Função chamada ao clicar no fundo escuro
fechar() {
  this.isClosing = true; // Aciona a animação de sumir

  // Espera a animação terminar (300ms) antes de avisar o componente pai
    setTimeout(() => {
      this.fecharModal.emit();
    }, 300);
  }

  recuperarSenha() {
    const emailval = this.emailValidation(this.email);

    if(!this.email){
      alert('Email vazio!');
      return
    }
    if(!emailval){
      alert('Email informado é inválido');
      return
    }

    this.authService.recuperarSenha(this.email);

    setTimeout(() => {
      this.fechar();
    }, 2000);

    console.log(this.email);
  }
}