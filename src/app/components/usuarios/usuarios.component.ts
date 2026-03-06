import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../shared/services/layout.service';
import { Observable } from 'rxjs/internal/Observable';
import { UsersService } from '../../shared/services/users.service';
import { UserRole } from '../../shared/enums/user-roles';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {

  users: any[] = [];
  filteredUsers: any[] = [];
  tituloAtual$!: Observable<string>;
  
  searchTerm: string = '';

  // Variáveis de Paginação
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  perfis = Object.values(UserRole).filter(p => p !== UserRole.admin);

  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  showToast: boolean = false;
  toastTimeout: any;
  isSaving: boolean = false;

  getCodFunc(user: any) {
    if (this.editId === user.email) {
      return user.codFunc || '';
    }
    return user.codFunc ? user.codFunc : '#';
  }

  setCodFunc(user: any, value: string) {
    user.codFunc = value.replace('#', '');
  }

  constructor(private usersService: UsersService, private layoutService: LayoutService) {}

  ngOnInit(): void {
    this.tituloAtual$ = this.layoutService.tituloAtual$;

    this.usersService.getAllUsers().subscribe(data => {
      this.users = data;
      this.filteredUsers = data;
      this.atualizarPaginacao();
    });
  }

  filterUsers(): void {
    const term = this.searchTerm.toLowerCase().trim();
    
    if (!term) {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(user => 
        user.nome?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.perfil?.toLowerCase().includes(term) ||
        user.CodFunc?.toString().toLowerCase().includes(term)
      );
    }
    
    this.currentPage = 1;
    this.atualizarPaginacao();
  }

  atualizarPaginacao(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage) || 1; 
  }

  get paginatedUsers(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  edit = false;
  bkpUsers: any[] = [];
  editId: string | null = null;
  
  editUser(user: any) {
    this.editId = user.email;
    this.bkpUsers = structuredClone(this.filteredUsers);
  }

  cancelEdit() {
    if (this.isSaving) return;
    this.filteredUsers = structuredClone(this.bkpUsers);
    this.editId = null;
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

  async salvar(user: any){
    if (this.isSaving) return;

    const codDuplicado = this.users.some(
      u => u.codFunc === user.codFunc && u.email !== user.email
    );

    if(!user.nome){
      this.exibirToast('O campo nome não pode ficar vazio!', 'error');
      return;
    }

    if (codDuplicado) {
      this.exibirToast('Esse código de crachá já está em uso!', 'error');
      return;
    }

    this.isSaving = true;

    try {
      await this.usersService.editUser(user);
      this.editId = null;
      this.exibirToast('Usuário atualizado com sucesso!', 'success');
    } catch (error) {
      console.error(error);
      this.exibirToast('Erro ao atualizar usuário!', 'error');
    } finally {
      this.isSaving = false;
    }
  }
}