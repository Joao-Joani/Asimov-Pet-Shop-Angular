import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../shared/services/layout.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.component.html',
  styleUrl: './estoque.component.scss'
})
export class EstoqueComponent implements OnInit {

  estoque: any[] = [];
  filteredEstoque: any[] = [];
  tituloAtual$!: Observable<string>;
  
  searchTerm: string = '';
  filterType: string = 'Todos';
  sortBy: string = 'Nome';
  sortDesc: boolean = false; 

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private layoutService: LayoutService) {}

  ngOnInit(): void {
    this.tituloAtual$ = this.layoutService.tituloAtual$;

    // Mock para testes
    this.estoque = [
      { nome: 'Ração Premium Dog', lote: 'LT-1045', dataCadastro: '2026-03-01T10:00:00', dataUltimaEdicao: '2026-03-10T15:00:00', tipo: 'Físico', quantidade: 50 },
      { nome: 'E-book: Como adestrar', lote: 'LT-0000', dataCadastro: '2026-03-02T14:30:00', dataUltimaEdicao: '2026-03-02T14:30:00', tipo: 'Digital', quantidade: 99 },
      { nome: 'Banho e Tosa Completo', lote: 'SRV-01', dataCadastro: '2026-03-04T08:15:00', dataUltimaEdicao: '2026-03-05T09:00:00', tipo: 'Serviço', quantidade: 99 },
      { nome: 'Coleira Azul', lote: 'LT-2098', dataCadastro: '2026-03-05T11:20:00', dataUltimaEdicao: '2026-03-12T11:20:00', tipo: 'Físico', quantidade: 15 },
      { nome: 'Consulta Veterinária', lote: 'SRV-02', dataCadastro: '2026-03-06T09:00:00', dataUltimaEdicao: '2026-03-06T09:00:00', tipo: 'Serviço', quantidade: 99 },
      { nome: 'Brinquedo Mordedor', lote: 'LT-3301', dataCadastro: '2026-03-07T16:45:00', dataUltimaEdicao: '2026-03-09T16:45:00', tipo: 'Físico', quantidade: 32 },
      { nome: 'Ração Gatos', lote: 'LT-1050', dataCadastro: '2026-03-08T13:10:00', dataUltimaEdicao: '2026-03-15T10:00:00', tipo: 'Físico', quantidade: 8 }
    ];
    
    this.applyFiltersAndSort();
  }

  toggleSortDirection(): void {
    this.sortDesc = !this.sortDesc;
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort(): void {
    let result = [...this.estoque];

    const term = this.searchTerm.toLowerCase().trim();
    
    if (term) {
      result = result.filter(item => {
        const dateStr = new Date(item.dataCadastro).toLocaleDateString('pt-BR');
        if (this.filterType === 'Nome do produto') {
          return item.nome?.toLowerCase().includes(term);
        } else if (this.filterType === 'Lote') {
          return item.lote?.toLowerCase().includes(term);
        } else if (this.filterType === 'Tipo') {
          return item.tipo?.toLowerCase().includes(term);
        } else if (this.filterType === 'Data de cadastro') {
          return dateStr.includes(term);
        } else {
          return item.nome?.toLowerCase().includes(term) || 
                 item.lote?.toLowerCase().includes(term) ||
                 item.tipo?.toLowerCase().includes(term) ||
                 dateStr.includes(term);
        }
      });
    }
    
    result.sort((a, b) => {
      let valorA, valorB;

      if (this.sortBy === 'Nome') {
        valorA = a.nome.toLowerCase();
        valorB = b.nome.toLowerCase();
      } else if (this.sortBy === 'Lote') {
        valorA = a.lote.toLowerCase();
        valorB = b.lote.toLowerCase();
      } else if (this.sortBy === 'Data') {
        valorA = new Date(a.dataCadastro).getTime();
        valorB = new Date(b.dataCadastro).getTime();
      } else if (this.sortBy === 'Quantidade') {
        valorA = a.quantidade;
        valorB = b.quantidade;
      } else if (this.sortBy === 'Data da última edição') {
        valorA = new Date(a.dataUltimaEdicao).getTime();
        valorB = new Date(b.dataUltimaEdicao).getTime();
      }

      if (valorA < valorB) return this.sortDesc ? 1 : -1;
      if (valorA > valorB) return this.sortDesc ? -1 : 1;
      return 0;
    });

    this.filteredEstoque = result;
    this.currentPage = 1;
    this.atualizarPaginacao();
  }

  atualizarPaginacao(): void {
    this.totalPages = Math.ceil(this.filteredEstoque.length / this.itemsPerPage) || 1; 
  }

  get paginatedEstoque(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredEstoque.slice(startIndex, endIndex);
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