import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

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
  
}