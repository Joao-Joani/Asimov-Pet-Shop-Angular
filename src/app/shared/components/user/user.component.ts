import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {

  constructor(private auth: AuthService, private userService: UsersService) { }

  name: string = ''

  user: any

  ngOnInit(): void {
    this.userService.getMyUser().subscribe(user => {
      this.user = user;
      this.name = this.user.nome.split(' ')[0];
      console.log(this.name);
    });
  }

  logout() {
    this.auth.logout()
  }
}
