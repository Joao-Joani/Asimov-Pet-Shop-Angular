import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { BaixasService } from '../../shared/services/baixas.service';
import { UsersService } from '../../shared/services/users.service';

@Component({
  selector: 'app-estoque-detalhes',
  templateUrl: './estoque-detalhes.component.html',
  styleUrl: './estoque-detalhes.component.scss'
})
export class EstoqueDetalhesComponent implements OnInit {
  
  @Input() item: any;
  
  // Avisa o componente pai que o botão "Voltar" foi clicado
  @Output() voltar = new EventEmitter<void>();

  detalhes: any[] = [];
  filteredDetalhes: any[] = [];
  
  sortBy: string = 'Data da baixa';
  sortDesc: boolean = true;

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(
    private baixasService: BaixasService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    // Busca as baixas e os usuários ao mesmo tempo
    combineLatest([
      this.baixasService.getAllBaixas(),
      this.usersService.getAllUsers()
    ]).subscribe({
      next: ([baixasData, usersData]) => {
        
        // Filtramos para pegar APENAS as baixas deste item específico do estoque
        const baixasDesteItem = baixasData.filter(b => b.itemEstId === this.item?.id);

        // Mapeamos os dados para tratar a data e cruzar o nome do usuário
        this.detalhes = baixasDesteItem.map(b => {
          const usuarioItem = usersData.find(u => u.email === b.user);

          return {
            ...b,
            dataBaixa: b.data?.toDate ? b.data.toDate() : b.data,
            nomeResponsavel: usuarioItem ? usuarioItem.nome : (b.user || 'Desconhecido')
          };
        });
        
        this.applyFiltersAndSort();
      },
      error: (erro) => {
        console.error("ERRO FIREBASE - HISTÓRICO DE BAIXAS:", erro);
      }
    });
  }

  clicouEmVoltar(): void {
    this.voltar.emit();
  }

  toggleSortDirection(): void {
    this.sortDesc = !this.sortDesc;
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort(): void {
    let result = [...this.detalhes];
    
    result.sort((a, b) => {
      let valorA, valorB;

      if (this.sortBy === 'Data da baixa') {
        valorA = a.dataBaixa ? new Date(a.dataBaixa).getTime() : 0;
        valorB = b.dataBaixa ? new Date(b.dataBaixa).getTime() : 0;
      } else if (this.sortBy === 'Responsável') {
        valorA = a.nomeResponsavel ? a.nomeResponsavel.toLowerCase() : '';
        valorB = b.nomeResponsavel ? b.nomeResponsavel.toLowerCase() : '';
      } else if (this.sortBy === 'Quantidade') {
        valorA = a.qtd || 0;
        valorB = b.qtd || 0;
      }

      if (valorA < valorB) return this.sortDesc ? 1 : -1;
      if (valorA > valorB) return this.sortDesc ? -1 : 1;
      return 0;
    });

    this.filteredDetalhes = result;
    this.currentPage = 1;
    this.atualizarPaginacao();
  }

  atualizarPaginacao(): void {
    this.totalPages = Math.ceil(this.filteredDetalhes.length / this.itemsPerPage) || 1; 
  }

  get paginatedDetalhes(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredDetalhes.slice(startIndex, endIndex);
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