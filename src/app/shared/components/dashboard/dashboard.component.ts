import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  tituloAtual: string = 'Inicio';

  menuItems = [
    { nome: 'Inicio', rota: '/inicio', icone: '../../../assets/icons/casa.png' },
    { nome: 'Perfil', rota: '/perfil', icone: '../../../assets/icons/perfil.png' },
    { nome: 'Usuários', rota: '/usuarios', icone: '../../../assets/icons/usuarios.png' },
    { nome: 'Produtos', rota: '/produtos', icone: '../../../assets/icons/caixa.png' },
    { nome: 'Estoque', rota: '/estoque', icone: '../../../assets/icons/armazem.png' },
    { nome: 'Registros', rota: '/registros', icone: '../../../assets/icons/bloco_notas.png' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.atualizarTitulo(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.atualizarTitulo(event.urlAfterRedirects);
    });
  }

  atualizarTitulo(url: string) {
    // Busca qual item do menu corresponde à URL atual
    const itemAtivo = this.menuItems.find(item => url.includes(item.rota));
    
    if (itemAtivo) {
      this.tituloAtual = itemAtivo.nome;
    }
  }
}