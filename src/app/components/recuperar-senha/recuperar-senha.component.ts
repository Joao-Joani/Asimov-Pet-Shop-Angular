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
  
  // Variáveis adicionadas para controlar as mensagens no HTML
  errorMessage: string = '';
  successMessage: string = '';

  emailValidation(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Função chamada ao clicar no fundo escuro
  fechar() {
    this.isClosing = true;

    setTimeout(() => {
      this.fecharModal.emit();
    }, 300);
  }

  async recuperarSenha() {
    this.errorMessage = '';
    this.successMessage = '';

    const emailval = this.emailValidation(this.email);

    if(!this.email){
      this.errorMessage = 'E-mail vazio!';
      return;
    }
    if(!emailval){
      this.errorMessage = 'O e-mail informado é inválido.';
      return;
    }

    try {
      await this.authService.recuperarSenha(this.email);
      this.successMessage = 'Link enviado. Por favor, verifique seu e-mail!';
      console.log(this.email);

      setTimeout(() => {
        this.fechar();
      }, 2000);

    } catch (error: any) {
      this.errorMessage = 'Erro ao enviar e-mail. Verifique o endereço digitado.';
    }
  }
}