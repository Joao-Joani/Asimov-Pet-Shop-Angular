import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { UserRole } from '../../shared/enums/user-roles';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {

  showPassword = false;
  showConfirmPassword = false;
  
  errorMessage: string = '';

  constructor(private authService: AuthService) { }

  userForm = {
      name: '',
      lastName: '',
      email: '',
      pass: '',
      confirmPass: ''
  };

  emailValidation(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  async cadastro(formCadastro: NgForm) {
    this.errorMessage = '';

    if (formCadastro.invalid) {
      this.errorMessage = 'Atenção! Preencha todos os campos!';
      return;
    }

    if(!this.emailValidation(this.userForm.email)){
      this.errorMessage = 'E-mail inválido.';
      return;
    }

    if(!(this.userForm.pass.length>=6)){
      this.errorMessage = 'A senha deve conter no mínimo 6 caracteres.';
      return;
    }

    if(this.userForm.pass != this.userForm.confirmPass){
      this.errorMessage = 'Senha e Confirmação de senha diferentes.';
      return;
    }

    const user = {
      nome: this.userForm.name + ' ' + this.userForm.lastName,
      email: this.userForm.email,
      perfil: UserRole.leitor,
      senha: this.userForm.pass,
      codFunc: ''
    }

    try {
      await this.authService.cadastro(user);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        this.errorMessage = 'Este e-mail já está cadastrado!';
      } else {
        this.errorMessage = 'Ocorreu um erro ao realizar o cadastro.';
      }
    }
  }

  authGoogle(){

    this.authService.loginGoogle();
    
  }

}