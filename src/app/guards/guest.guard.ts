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
        router.navigate(['/inicio']);
        return true;
      } else {
        return false;
      }
    })
  )
};
