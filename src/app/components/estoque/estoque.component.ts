import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../shared/services/layout.service';
import { Observable, combineLatest } from 'rxjs'; // <-- Adicionado combineLatest
import { EstoqueService } from '../../shared/services/estoque.service';
import { ProdutosService } from '../../shared/services/produtos.service'; // <-- Importado o serviço de produtos

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

  itemSelecionado: any = null;

  constructor(
    private layoutService: LayoutService,
    private estoqueService: EstoqueService,
    private produtosService: ProdutosService
  ) {}

  ngOnInit(): void {
    this.tituloAtual$ = this.layoutService.tituloAtual$;

    combineLatest([
      this.estoqueService.getAllEstoque(),
      this.produtosService.getAllProdutos()
    ]).subscribe({
      next: ([estoqueData, produtosData]) => {
        this.estoque = estoqueData.map(item => {
          const produtoRelacionado = produtosData.find(p => p.id === item.produto);
          return {
            ...item,
            dataCad: item.dataCad?.toDate ? item.dataCad.toDate() : item.dataCad,
            dataUltEdit: item.dataUltEdit?.toDate ? item.dataUltEdit.toDate() : item.dataUltEdit,
            dataVal: item.dataVal?.toDate ? item.dataVal.toDate() : item.dataVal,
            nomeProduto: produtoRelacionado ? produtoRelacionado.nome : 'Produto não encontrado',
            tipoProduto: produtoRelacionado ? produtoRelacionado.tipo : 'Sem tipo'
          };
        });

        this.filteredEstoque = [...this.estoque];
        this.applyFiltersAndSort(); 
      },
      error: (erro) => {
        console.error("ERRO FIREBASE - CRUZAMENTO ESTOQUE/PRODUTO:", erro);
      }
    });
  }

  abrirDetalhes(item: any): void {
    this.itemSelecionado = item;
  }

  fecharDetalhes(): void {
    this.itemSelecionado = null;
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
        const dateStr = item.dataCad ? new Date(item.dataCad).toLocaleDateString('pt-BR') : '';
        const produtoLower = item.nomeProduto ? item.nomeProduto.toLowerCase() : '';
        const loteLower = item.lote ? item.lote.toLowerCase() : '';
        const tipoLower = item.tipoProduto ? item.tipoProduto.toLowerCase() : '';

        if (this.filterType === 'Nome do produto') {
          return produtoLower.includes(term);
        } else if (this.filterType === 'Lote') {
          return loteLower.includes(term);
        } else if (this.filterType === 'Tipo') {
          return tipoLower.includes(term);
        } else if (this.filterType === 'Data de cadastro') {
          return dateStr.includes(term);
        } else {
          return produtoLower.includes(term) || 
                 loteLower.includes(term) ||
                 tipoLower.includes(term) ||
                 dateStr.includes(term);
        }
      });
    }
    
    result.sort((a, b) => {
      let valorA, valorB;
      if (this.sortBy === 'Nome') {
        valorA = a.nomeProduto ? a.nomeProduto.toLowerCase() : '';
        valorB = b.nomeProduto ? b.nomeProduto.toLowerCase() : '';
      } else if (this.sortBy === 'Lote') {
        valorA = a.lote ? a.lote.toLowerCase() : '';
        valorB = b.lote ? b.lote.toLowerCase() : '';
      } else if (this.sortBy === 'Data') {
        valorA = a.dataCad ? new Date(a.dataCad).getTime() : 0;
        valorB = b.dataCad ? new Date(b.dataCad).getTime() : 0;
      } else if (this.sortBy === 'Quantidade') {
        valorA = a.qtd || 0;
        valorB = b.qtd || 0;
      } else if (this.sortBy === 'Data da última edição') {
        valorA = a.dataUltEdit ? new Date(a.dataUltEdit).getTime() : 0;
        valorB = b.dataUltEdit ? new Date(b.dataUltEdit).getTime() : 0;
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