import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../shared/services/users.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {

  users: any[] = [];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.usersService.getAllUsers().subscribe(data => {
      this.users = data;
      console.log(this.users);
    })
  }

}
