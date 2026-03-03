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

  constructor(private authService: AuthService) { }

  userLogin = {
    email:  '',
    senha: ''
  }

  login(formLogin: NgForm) {

    if(formLogin.invalid) {
      alert('Preencha todos os campos')
    }

    this.authService.login(this.userLogin.email, this.userLogin.senha);

    console.log(this.userLogin);
  }

}