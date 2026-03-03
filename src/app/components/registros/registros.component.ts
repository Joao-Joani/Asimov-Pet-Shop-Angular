import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { LayoutService } from '../../shared/services/layout.service';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrl: './registros.component.scss'
})
export class RegistrosComponent implements OnInit {
  
  tituloAtual$!: Observable<string>;

  constructor(private layoutService: LayoutService) {}

  ngOnInit() {
    this.tituloAtual$ = this.layoutService.tituloAtual$;
  }
}