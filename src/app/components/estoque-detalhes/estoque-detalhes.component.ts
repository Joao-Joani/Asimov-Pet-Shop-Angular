import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-estoque-detalhes',
  templateUrl: './estoque-detalhes.component.html',
  styleUrl: './estoque-detalhes.component.scss'
})
export class EstoqueDetalhesComponent implements OnInit {
  
  // Recebe o item inteiro do componente pai
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

  ngOnInit(): void {
    // Mock de dados
    this.detalhes = [
      { dataBaixa: '2026-03-05T10:00:00', lote: this.item?.lote || '0000', motivo: 'Venda de Balcão', responsavel: 'João', quantidade: 1 },
      { dataBaixa: '2026-02-20T14:30:00', lote: this.item?.lote || '0000', motivo: 'Produto Danificado', responsavel: 'Maria', quantidade: 2 },
      { dataBaixa: '2026-01-15T09:15:00', lote: this.item?.lote || '0000', motivo: 'Venda Online', responsavel: 'Pedro', quantidade: 3 },
      { dataBaixa: '2026-02-12T09:12:00', lote: this.item?.lote || '0000', motivo: 'Venda Online', responsavel: 'Ana', quantidade: 3 },
      { dataBaixa: '2026-01-06T09:16:00', lote: this.item?.lote || '0000', motivo: 'Venda de Balcão', responsavel: 'João', quantidade: 3 }
    ];
    
    this.applyFiltersAndSort();
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
        valorA = new Date(a.dataBaixa).getTime();
        valorB = new Date(b.dataBaixa).getTime();
      } else if (this.sortBy === 'Responsável') {
        valorA = a.responsavel.toLowerCase();
        valorB = b.responsavel.toLowerCase();
      } else if (this.sortBy === 'Quantidade') {
        valorA = a.quantidade;
        valorB = b.quantidade;
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