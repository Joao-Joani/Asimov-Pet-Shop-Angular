import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  // O BehaviorSubject guarda o título atual e avisa os componentes quando ele muda
  private tituloAtualSubject = new BehaviorSubject<string>('Inicio');
  public tituloAtual$ = this.tituloAtualSubject.asObservable();

  public menuItems = [
    { nome: 'Inicio', rota: '/inicio', icone: '../../../assets/icons/casa.png' },
    { nome: 'Perfil', rota: '/perfil', icone: '../../../assets/icons/perfil.png' },
    { nome: 'Usuários', rota: '/usuarios', icone: '../../../assets/icons/usuarios.png' },
    { nome: 'Produtos', rota: '/produtos', icone: '../../../assets/icons/caixa.png' },
    { nome: 'Estoque', rota: '/estoque', icone: '../../../assets/icons/armazem.png' },
    { nome: 'Registros', rota: '/registros', icone: '../../../assets/icons/bloco_notas.png' }
  ];

  constructor(private router: Router) {
    // Verifica o título logo ao carregar a aplicação
    this.atualizarTitulo(this.router.url);

    // Fica à escuta de qualquer mudança de rota para atualizar o título
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.atualizarTitulo(event.urlAfterRedirects);
    });
  }

  private atualizarTitulo(url: string) {
    const itemAtivo = this.menuItems.find(item => url.includes(item.rota));
    if (itemAtivo) {
      // Emite o novo título para quem estiver a escutar
      this.tituloAtualSubject.next(itemAtivo.nome);
    }
  }
}