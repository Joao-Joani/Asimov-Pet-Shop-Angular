import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../shared/services/layout.service';
import { Observable, combineLatest } from 'rxjs';
import { BaixasService } from '../../shared/services/baixas.service';
import { EstoqueService } from '../../shared/services/estoque.service';
import { ProdutosService } from '../../shared/services/produtos.service';
import { UsersService } from '../../shared/services/users.service';

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

  constructor(
    private layoutService: LayoutService,
    private baixasService: BaixasService,
    private estoqueService: EstoqueService,
    private produtosService: ProdutosService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.tituloAtual$ = this.layoutService.tituloAtual$;

    combineLatest([
      this.baixasService.getAllBaixas(),
      this.estoqueService.getAllEstoque(),
      this.produtosService.getAllProdutos(),
      this.usersService.getAllUsers()
    ]).subscribe({
      next: ([baixasData, estoqueData, produtosData, usersData]) => {
        
        this.registros = baixasData.map(baixa => {
          
          const estoqueItem = estoqueData.find(e => e.id === baixa.itemEstId);
          
          const produtoItem = estoqueItem ? produtosData.find(p => p.id === estoqueItem.produto) : null;
          
          const usuarioItem = usersData.find(u => u.email === baixa.user);

          return {
            ...baixa,
            dataBaixa: baixa.data?.toDate ? baixa.data.toDate() : baixa.data,
            nomeProduto: produtoItem ? produtoItem.nome : 'Produto não encontrado',
            nomeResponsavel: usuarioItem ? usuarioItem.nome : (baixa.user || 'Desconhecido')
          };
        });

        this.filteredRegistros = [...this.registros];
        this.applyFiltersAndSort();
      },
      error: (erro) => {
        console.error("ERRO FIREBASE - CRUZAMENTO DE BAIXAS:", erro);
      }
    });
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
        const dateStr = item.dataBaixa ? new Date(item.dataBaixa).toLocaleDateString('pt-BR') : '';
        const nomeLower = item.nomeProduto ? item.nomeProduto.toLowerCase() : '';
        const motivoLower = item.motivo ? item.motivo.toLowerCase() : '';
        const respLower = item.nomeResponsavel ? item.nomeResponsavel.toLowerCase() : '';
        
        if (this.filterType === 'Nome') {
          return nomeLower.includes(term);
        } else if (this.filterType === 'Motivo') {
          return motivoLower.includes(term);
        } else if (this.filterType === 'Responsável') {
          return respLower.includes(term);
        } else if (this.filterType === 'Data da baixa') {
          return dateStr.includes(term);
        } else {
          return nomeLower.includes(term) || 
                 motivoLower.includes(term) ||
                 respLower.includes(term) ||
                 dateStr.includes(term);
        }
      });
    }

    result.sort((a, b) => {
      let valorA, valorB;

      if (this.sortBy === 'Nome') {
        valorA = a.nomeProduto ? a.nomeProduto.toLowerCase() : '';
        valorB = b.nomeProduto ? b.nomeProduto.toLowerCase() : '';
      } else if (this.sortBy === 'Quantidade') {
        valorA = a.qtd || 0;
        valorB = b.qtd || 0;
      } else if (this.sortBy === 'Data da baixa') {
        valorA = a.dataBaixa ? new Date(a.dataBaixa).getTime() : 0;
        valorB = b.dataBaixa ? new Date(b.dataBaixa).getTime() : 0;
      } else if (this.sortBy === 'Responsável') {
        valorA = a.nomeResponsavel ? a.nomeResponsavel.toLowerCase() : '';
        valorB = b.nomeResponsavel ? b.nomeResponsavel.toLowerCase() : '';
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