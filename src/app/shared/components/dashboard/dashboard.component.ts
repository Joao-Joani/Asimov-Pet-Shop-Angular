import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  
  // Apenas declaramos a variável com um array vazio inicialmente
  menuItems: any[] = [];

  constructor(private layoutService: LayoutService, private userService: UsersService) {}

  // O ngOnInit roda logo após o construtor injetar o serviço com sucesso
  ngOnInit() {
    this.userService.getUsuarioLogado().subscribe(user => {
      
      if(user?.email){
        this.userService.getFuncionario(user.email).subscribe((dados: any) => {
          const perfil = dados.perfil;

          this.menuItems = this.layoutService.filtraMenu(perfil);
        })
      }

    })
  }
  
}