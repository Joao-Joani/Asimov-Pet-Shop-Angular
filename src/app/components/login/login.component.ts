import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) { }

  // Descomente a parte abaixo para realizar um login ao entrar na rota /login

  // ngOnInit(): void {
  //   this.login();
  // }

  // login(){
  //   this.authService.login('admin@test.com.br', 'asimov2026');
  // } 

}
