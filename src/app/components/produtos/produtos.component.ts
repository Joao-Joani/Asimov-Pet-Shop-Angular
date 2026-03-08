import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../shared/services/layout.service';
import { Observable } from 'rxjs';
import { ProdutosService } from '../../shared/services/produtos.service';

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

  constructor(
    private layoutService: LayoutService, 
    private produtosService: ProdutosService
  ) {}

  ngOnInit(): void {
    this.tituloAtual$ = this.layoutService.tituloAtual$;

    this.produtosService.getAllProdutos().subscribe(data => {
      this.produtos = data.map(p => {
        return {
          ...p,
          dataCad: p.dataCad?.toDate ? p.dataCad.toDate() : p.dataCad,
          dataEdit: p.dataEdit?.toDate ? p.dataEdit.toDate() : p.dataEdit
        };
      });
      
      this.filteredProducts = [...this.produtos];
      this.applyFiltersAndSort();
    });
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
        const dateStr = p.dataCad ? new Date(p.dataCad).toLocaleDateString('pt-BR') : '';
        const nomeLower = p.nome ? p.nome.toLowerCase() : '';
        const tipoLower = p.tipo ? p.tipo.toLowerCase() : '';
        
        if (this.filterType === 'Nome do produto') {
          return nomeLower.includes(term);
        } else if (this.filterType === 'Tipo') {
          return tipoLower.includes(term);
        } else if (this.filterType === 'Data de cadastro') {
          return dateStr.includes(term);
        } else {
          return nomeLower.includes(term) || tipoLower.includes(term) || dateStr.includes(term);
        }
      });
    }

    // Aplica Dropdown de "Ordenar por"
    result.sort((a, b) => {
      let valorA, valorB;

      if (this.sortBy === 'Nome') {
        valorA = a.nome ? a.nome.toLowerCase() : '';
        valorB = b.nome ? b.nome.toLowerCase() : '';
      } else if (this.sortBy === 'Data') {
        valorA = a.dataCad ? new Date(a.dataCad).getTime() : 0;
        valorB = b.dataCad ? new Date(b.dataCad).getTime() : 0;
      } else if (this.sortBy === 'Preço') {
        valorA = a.preco || 0;
        valorB = b.preco || 0;
      } else if (this.sortBy === 'Data da última edição') {
        valorA = a.dataEdit ? new Date(a.dataEdit).getTime() : 0;
        valorB = b.dataEdit ? new Date(b.dataEdit).getTime() : 0;
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