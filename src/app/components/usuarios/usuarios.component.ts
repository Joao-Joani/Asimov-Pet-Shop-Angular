import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../shared/services/layout.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})

export class UsuariosComponent implements OnInit {
  
  tituloAtual$!: Observable<string>;

  constructor(private layoutService: LayoutService) {}

  ngOnInit() {
    this.tituloAtual$ = this.layoutService.tituloAtual$;
  }
}