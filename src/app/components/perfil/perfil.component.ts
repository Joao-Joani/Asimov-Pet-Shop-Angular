import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersService } from '../../shared/services/users.service';
import { LayoutService } from '../../shared/services/layout.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  tituloAtual$!: Observable<string>;

  // Dados genéricos simulando o que virá do banco de dados
  userData = {
    firstName: 'Teste',
    lastName: 'Da Silva',
    email: 'teste@habitatpet.com.br',
    cargo: 'Funcionário'
  };

  // Variáveis booleanas para controlar o estado dos campos (bloqueado/liberado)
  isEditingFirstName: boolean = false;
  isEditingLastName: boolean = false;

  constructor(
    private userService: UsersService, 
    private layoutService: LayoutService
  ) {}

  ngOnInit(): void {
    this.tituloAtual$ = this.layoutService.tituloAtual$;
    this.userService.getMyUser().subscribe(user => {
      console.log('Dados do usuário vindo do service:', user);
    });
  }

  // Funções que o HTML chama quando você clica no ícone de lápis
  toggleEditFirstName(): void {
    this.isEditingFirstName = !this.isEditingFirstName;
  }

  toggleEditLastName(): void {
    this.isEditingLastName = !this.isEditingLastName;
  }

  // Função chamada ao clicar em "Salvar alterações"
  salvarAlteracoes(): void {
    // Aqui entrará a requisição para salvar no Firebase
    console.log('Dados salvos:', this.userData);
    
    // Bloqueia os campos de nome novamente após salvar
    this.isEditingFirstName = false;
    this.isEditingLastName = false;
    
    // Um aviso visual para testes
    alert('Alterações salvas com sucesso!');
  }
}