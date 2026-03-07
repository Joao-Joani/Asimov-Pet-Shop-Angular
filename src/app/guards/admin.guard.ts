import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { switchMap, map, of } from 'rxjs';
import { UsersService } from '../shared/services/users.service';
import { UserRole } from '../shared/enums/user-roles';

export const adminGuard: CanActivateFn = () => {

  const usersService = inject(UsersService);
  const router = inject(Router);

  return usersService.getUsuarioLogado().pipe(

    switchMap(user => {

      if (!user?.email) {
        router.navigate(['/']);
        return of(false);
      }

      return usersService.getFuncionario(user.email).pipe(

        map((dados: any) => {

          if (dados?.perfil === UserRole.admin) {
            return true;
          }

          router.navigate(['/inicio']);
          return false;

        })

      );

    })

  );

};