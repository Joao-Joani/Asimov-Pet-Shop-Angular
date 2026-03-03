import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../shared/services/layout.service';
import { Observable } from 'rxjs/internal/Observable';
import { UsersService } from '../../shared/services/users.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})

export class UsuariosComponent implements OnInit {

  users: any[] = [];

  tituloAtual$!: Observable<string>;

  constructor(private usersService: UsersService, private layoutService: LayoutService) {}

  ngOnInit(): void {
    this.tituloAtual$ = this.layoutService.tituloAtual$;

    this.usersService.getAllUsers().subscribe(data => {
      this.users = data;
      console.log(this.users);
    })
  }
}
