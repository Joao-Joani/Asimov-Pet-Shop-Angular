import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../shared/services/layout.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.component.html',
  styleUrl: './estoque.component.scss'
})

export class EstoqueComponent implements OnInit {
  
  tituloAtual$!: Observable<string>;

  constructor(private layoutService: LayoutService) {}

  ngOnInit() {
    this.tituloAtual$ = this.layoutService.tituloAtual$;
  }
}