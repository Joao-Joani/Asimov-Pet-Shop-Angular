import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../shared/services/layout.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrl: './registros.component.scss'
})
export class RegistrosComponent implements OnInit {

  registros: any[] = [];
  filteredRegistros: any[] = [];
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
    this.registros = [
      { nome: 'Ração Premium Dog', quantidade: 5, dataBaixa: '2026-03-01T10:00:00', motivo: 'Vencimento', responsavel: 'João' },
      { nome: 'Brinquedo Mordedor', quantidade: 2, dataBaixa: '2026-03-02T14:30:00', motivo: 'Produto danificado', responsavel: 'Maria' },
      { nome: 'Coleira Azul', quantidade: 1, dataBaixa: '2026-03-04T08:15:00', motivo: 'Extravio', responsavel: 'Pedro' },
      { nome: 'Ração Gatos', quantidade: 10, dataBaixa: '2026-03-05T11:20:00', motivo: 'Uso interno', responsavel: 'Ana' },
      { nome: 'Shampoo Pelos Claros', quantidade: 3, dataBaixa: '2026-03-06T09:00:00', motivo: 'Vencimento', responsavel: 'João' }
    ];
    
    this.applyFiltersAndSort();
  }

  toggleSortDirection(): void {
    this.sortDesc = !this.sortDesc;
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort(): void {
    let result = [...this.registros];

    const term = this.searchTerm.toLowerCase().trim();
    
    if (term) {
      result = result.filter(item => {
        const dateStr = new Date(item.dataBaixa).toLocaleDateString('pt-BR');
        
        if (this.filterType === 'Nome') {
          return item.nome?.toLowerCase().includes(term);
        } else if (this.filterType === 'Motivo') {
          return item.motivo?.toLowerCase().includes(term);
        } else if (this.filterType === 'Responsável') {
          return item.responsavel?.toLowerCase().includes(term);
        } else if (this.filterType === 'Data da baixa') {
          return dateStr.includes(term);
        } else {
          return item.nome?.toLowerCase().includes(term) || 
                 item.motivo?.toLowerCase().includes(term) ||
                 item.responsavel?.toLowerCase().includes(term) ||
                 dateStr.includes(term);
        }
      });
    }

    result.sort((a, b) => {
      let valorA, valorB;

      if (this.sortBy === 'Nome') {
        valorA = a.nome.toLowerCase();
        valorB = b.nome.toLowerCase();
      } else if (this.sortBy === 'Quantidade') {
        valorA = a.quantidade;
        valorB = b.quantidade;
      } else if (this.sortBy === 'Data da baixa') {
        valorA = new Date(a.dataBaixa).getTime();
        valorB = new Date(b.dataBaixa).getTime();
      } else if (this.sortBy === 'Responsável') {
        valorA = a.responsavel.toLowerCase();
        valorB = b.responsavel.toLowerCase();
      }

      if (valorA < valorB) return this.sortDesc ? 1 : -1;
      if (valorA > valorB) return this.sortDesc ? -1 : 1;
      return 0;
    });

    this.filteredRegistros = result;
    this.currentPage = 1;
    this.atualizarPaginacao();
  }

  atualizarPaginacao(): void {
    this.totalPages = Math.ceil(this.filteredRegistros.length / this.itemsPerPage) || 1; 
  }

  get paginatedRegistros(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredRegistros.slice(startIndex, endIndex);
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