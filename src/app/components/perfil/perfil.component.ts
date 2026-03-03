import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../shared/services/users.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.userService.getMyUser().subscribe(user => {
      console.log(user);
    });
  }

}
