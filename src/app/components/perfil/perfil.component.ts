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
  user: any;

  userData = {
    firstName: '',
    lastName: '',
    email: '',
    cargo: ''
  };

  isEditingFirstName: boolean = false;
  isEditingLastName: boolean = false;
  isSaving: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  showToast: boolean = false;
  toastTimeout: any;

  constructor(
    private userService: UsersService, 
    private layoutService: LayoutService
  ) {}

  ngOnInit(): void {
    this.tituloAtual$ = this.layoutService.tituloAtual$;
    this.userService.getMyUser().subscribe(user => {
      if(user) {
        this.user = user;
        [this.userData.firstName, this.userData.lastName] = this.user.nome.split(" ");
        this.userData.email = this.user.email;
        this.userData.cargo = this.user.perfil;
      }
    });
  }

  toggleEditFirstName(): void {
    this.isEditingFirstName = !this.isEditingFirstName;
  }

  toggleEditLastName(): void {
    this.isEditingLastName = !this.isEditingLastName;
  }

  exibirToast(mensagem: string, tipo: 'success' | 'error' = 'success') {
    this.toastMessage = mensagem;
    this.toastType = tipo;
    this.showToast = true;

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    this.toastTimeout = setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  async salvarAlteracoes(): Promise<void> {
    if (this.isSaving) return; 

    const nome = this.userData.firstName + ' ' + this.userData.lastName;

    if(!this.userData.firstName || !this.userData.lastName){
      this.exibirToast('Nome ou Sobrenome não podem ficar vazios!', 'error');
      return;
    }

    this.isSaving = true;

    try {
      await this.userService.alterarPerfil(nome);

      this.isEditingFirstName = false;
      this.isEditingLastName = false;
      
      this.exibirToast('Alterações salvas com sucesso!', 'success');
    } catch (error) {
      console.error(error);
      this.exibirToast('Erro ao salvar as alterações!', 'error');
    } finally {
      this.isSaving = false;
    }
  }
}