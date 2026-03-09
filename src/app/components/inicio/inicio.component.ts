import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../shared/services/layout.service';
import { Observable } from 'rxjs';
import { ProdutosService } from '../../shared/services/produtos.service';
import { EstoqueService } from '../../shared/services/estoque.service';
import { BaixasService } from '../../shared/services/baixas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {
  
  tituloAtual$!: Observable<string>;

  constructor(private layoutService: LayoutService, private produtos: ProdutosService, private estoque: EstoqueService, private baixas: BaixasService, private router: Router) {}

  totalProd: number = 0;

  totalEstoque: number = 0;

  ultimasBaixas: any[] = [];

  ngOnInit() {
    this.tituloAtual$ = this.layoutService.tituloAtual$;
    this.produtos.getProdutosTotais().subscribe(produtos => {
      this.totalProd = produtos.length;
    });

    this.estoque.getAllEstoque().subscribe(estoque => {
      this.totalEstoque = estoque.reduce((total, item) => {
        return total + (item.qtd || 0);
      }, 0);
    });

    this.baixas.getUltimasBaixas().subscribe(baixas => {
      this.ultimasBaixas = baixas
      console.log(this.ultimasBaixas);
    });
  }

  goRegistros() {
    this.router.navigate(['/registros']);
  }
}