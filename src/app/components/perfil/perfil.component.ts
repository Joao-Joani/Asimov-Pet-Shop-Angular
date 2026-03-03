import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../shared/services/users.service';
import { Observable } from 'rxjs';
import { LayoutService } from '../../shared/services/layout.service';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})

export class PerfilComponent implements OnInit {

  constructor(private userService: UsersService, private layoutService: LayoutService) {}

  tituloAtual$!: Observable<string>;

  ngOnInit(): void {
    this.tituloAtual$ = this.layoutService.tituloAtual$;
    this.userService.getMyUser().subscribe(user => {
      console.log(user);
    });
  }
}
