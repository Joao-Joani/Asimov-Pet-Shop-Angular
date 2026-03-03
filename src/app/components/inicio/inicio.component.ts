import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../shared/services/layout.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {
  
  tituloAtual$!: Observable<string>;

  constructor(private layoutService: LayoutService) {}

  ngOnInit() {
    this.tituloAtual$ = this.layoutService.tituloAtual$;
  }
}