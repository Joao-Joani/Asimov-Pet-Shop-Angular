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

  getCodFunc(user: any) {
    // se a linha está sendo editada, mostra vazio no input
    if (this.editId === user.email) {
      return user.codFunc || ''; // deixa vazio enquanto edita
    }
    // se não está editando, mostra # quando estiver vazio
    return user.codFunc ? user.codFunc : '#';
  }

  setCodFunc(user: any, value: string) {
    user.codFunc = value.replace('#', '')
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

  // Função disparada a cada letra digitada
  filterUsers(): void {
    const term = this.searchTerm.toLowerCase().trim();
    
    if (!term) {
      this.filteredUsers = this.users;
    } else {
      // Filtra checando se o termo digitado existe no nome, email, perfil ou CodFunc
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

  // Recalcula o total de páginas baseado na lista filtrada
  atualizarPaginacao(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage) || 1; 
  }

  // Agora busca na lista filtrada (filteredUsers) em vez da lista global
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
    
    this.filteredUsers = structuredClone(this.bkpUsers);

    this.editId = null;
  }

  salvar(user: any){
    console.log(user);

    const codDuplicado = this.users.some(
    u => u.codFunc === user.codFunc && u.email !== user.email
    );

    if(!user.nome){
      alert('Campo nome está vazio');
      return
    }

    if (codDuplicado) {
      alert('Esse código já está em uso por outro usuário!');
      return; // não salva
    }

    this.usersService.editUser(user);

    this.editId = null;

  }
}