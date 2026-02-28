import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { UserRole } from '../../shared/enums/user-roles';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent implements OnInit {

  constructor(private authService: AuthService) { }

  // Descomente a função abaixo para realizar cadastro assim que acessar a rota /cadastro

  // ngOnInit(): void {
  //   this.cadastro();
  // }

  // cadastro() {

  //   const user = {
  //     nome: 'Ravel',
  //     email: 'ravel1234@gmail.com',
  //     perfil: UserRole.leitor,
  //     senha: '123456',
  //     codFunc: ''
  //   };

  //   this.authService.cadastro(user);
  // }

}
