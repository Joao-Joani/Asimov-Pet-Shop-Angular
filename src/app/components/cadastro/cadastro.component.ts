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

  // Variáveis adicionadas para controlar a visibilidade do input de senha
  showPassword = false;
  showConfirmPassword = false;

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

  cadastro(formCadastro: NgForm) {

    if (formCadastro.invalid) {
      alert('Atenção! Preencha todos os campos!');
      return;
    }

    if(!this.emailValidation(this.userForm.email)){
      alert('Email inválido')
      return
    }

    if(!(this.userForm.pass.length>=6)){
      alert('A senha deve conter no mínimo 6 caracteres');
      return
    }

    if(this.userForm.pass != this.userForm.confirmPass){
      alert('Senha e Confirmação de senha diferentes');
      return
    }

    const user = {
      nome: this.userForm.name + ' ' + this.userForm.lastName,
      email: this.userForm.email,
      perfil: UserRole.leitor,
      senha: this.userForm.pass,
      codFunc: ''
    }

    this.authService.cadastro(user);

  }

}