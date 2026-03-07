import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  // Variáveis adicionadas para controlar a visibilidade do input de senha
  showPassword = false;

  mostrarModalRecuperarSenha = false;
  
  errorMessage: string = '';

  constructor(private authService: AuthService) { }

  userLogin = {
    email:  '',
    senha: ''
  }

  async login(formLogin: NgForm) {
    this.errorMessage = '';

    if(formLogin.invalid) {
      this.errorMessage = 'Preencha todos os campos!';
      return;
    }

    try {
      await this.authService.login(this.userLogin.email, this.userLogin.senha);
      
      console.log(this.userLogin);

    } catch(error: any) {
      if(error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        this.errorMessage = 'E-mail ou senha inválidos!';
      } else {
        this.errorMessage = 'Ocorreu um erro ao tentar fazer login.';
      }
    }
  }

  authGoogle(){

    this.authService.loginGoogle();
    
  }

}