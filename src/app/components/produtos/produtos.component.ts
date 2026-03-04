import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../shared/services/layout.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.scss'
})
export class ProdutosComponent implements OnInit {

  produtos: any[] = [];
  filteredProducts: any[] = [];
  tituloAtual$!: Observable<string>;
  
  searchTerm: string = '';
  filterType: string = 'Todos';
  sortBy: string = 'Nome';
  sortDesc: boolean = false;

  // Variáveis de Paginação
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private layoutService: LayoutService) {}

  ngOnInit(): void {
    this.tituloAtual$ = this.layoutService.tituloAtual$;

    // Mock para testes
    this.produtos = [
      { nome: 'Ração Premium Dog', dataCadastro: '2026-03-01T10:00:00', dataUltimaEdicao: '2026-03-10T15:00:00', tipo: 'Físico', preco: 150.00 },
      { nome: 'E-book: Como adestrar', dataCadastro: '2026-03-02T14:30:00', dataUltimaEdicao: '2026-03-02T14:30:00', tipo: 'Digital', preco: 89.90 },
      { nome: 'Banho e Tosa Completo', dataCadastro: '2026-03-04T08:15:00', dataUltimaEdicao: '2026-03-05T09:00:00', tipo: 'Serviço', preco: 60.00 },
      { nome: 'Coleira Azul', dataCadastro: '2026-03-05T11:20:00', dataUltimaEdicao: '2026-03-12T11:20:00', tipo: 'Físico', preco: 45.50 },
      { nome: 'Consulta Veterinária', dataCadastro: '2026-03-06T09:00:00', dataUltimaEdicao: '2026-03-06T09:00:00', tipo: 'Serviço', preco: 120.00 },
      { nome: 'Brinquedo Mordedor', dataCadastro: '2026-03-07T16:45:00', dataUltimaEdicao: '2026-03-09T16:45:00', tipo: 'Físico', preco: 25.00 },
      { nome: 'Ração Gatos', dataCadastro: '2026-03-08T13:10:00', dataUltimaEdicao: '2026-03-15T10:00:00', tipo: 'Físico', preco: 110.00 }
    ];
    
    this.applyFiltersAndSort();
  }

  toggleSortDirection(): void {
    this.sortDesc = !this.sortDesc;
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort(): void {
    let result = [...this.produtos];

    // Aplica busca por texto combinada com o Dropdown "Filtrar por"
    const term = this.searchTerm.toLowerCase().trim();
    
    if (term) {
      result = result.filter(p => {
        // Formata a data para dd/mm/yyyy para que a busca em texto funcione
        const dateStr = new Date(p.dataCadastro).toLocaleDateString('pt-BR');
        
        if (this.filterType === 'Nome do produto') {
          return p.nome?.toLowerCase().includes(term);
        } else if (this.filterType === 'Tipo') {
          return p.tipo?.toLowerCase().includes(term);
        } else if (this.filterType === 'Data de cadastro') {
          return dateStr.includes(term);
        } else {
          // 'Todos' procura no nome, tipo e na data formatada
          return p.nome?.toLowerCase().includes(term) || 
                 p.tipo?.toLowerCase().includes(term) ||
                 dateStr.includes(term);
        }
      });
    }

    // Aplica Dropdown de "Ordenar por"
    result.sort((a, b) => {
      let valorA, valorB;

      if (this.sortBy === 'Nome') {
        valorA = a.nome.toLowerCase();
        valorB = b.nome.toLowerCase();
      } else if (this.sortBy === 'Data') {
        valorA = new Date(a.dataCadastro).getTime();
        valorB = new Date(b.dataCadastro).getTime();
      } else if (this.sortBy === 'Preço') {
        valorA = a.preco;
        valorB = b.preco;
      } else if (this.sortBy === 'Data da última edição') {
        valorA = new Date(a.dataUltimaEdicao).getTime();
        valorB = new Date(b.dataUltimaEdicao).getTime();
      }

      if (valorA < valorB) return this.sortDesc ? 1 : -1;
      if (valorA > valorB) return this.sortDesc ? -1 : 1;
      return 0;
    });

    this.filteredProducts = result;
    this.currentPage = 1;
    this.atualizarPaginacao();
  }

  atualizarPaginacao(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage) || 1; 
  }

  get paginatedProducts(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
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