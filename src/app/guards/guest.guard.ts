import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs';

export const guestGuard: CanActivateFn = (route, state) => {
  const afAuth = inject(AngularFireAuth);
  const router = inject(Router);

  return afAuth.user.pipe(
    map(user => {
      if (user) {
        // Usuário logado: vai para o início e é bloqueado de acessar telas de login/cadastro
        router.navigate(['/inicio']);
        return false; 
      } else {
        // Ninguém logado: acesso permitido à rota de login/cadastro/home
        return true; 
      }
    })
  )
};