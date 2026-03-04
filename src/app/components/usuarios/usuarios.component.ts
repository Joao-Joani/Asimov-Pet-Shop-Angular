import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../shared/services/layout.service';
import { Observable } from 'rxjs/internal/Observable';
import { UsersService } from '../../shared/services/users.service';

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
}