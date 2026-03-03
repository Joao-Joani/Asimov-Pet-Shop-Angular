import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  
  // Apenas declaramos a variável com um array vazio inicialmente
  menuItems: any[] = [];

  constructor(private layoutService: LayoutService) {}

  // O ngOnInit roda logo após o construtor injetar o serviço com sucesso
  ngOnInit() {
    this.menuItems = this.layoutService.menuItems;
  }
  
}