import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, switchMap } from 'rxjs';
import { UserRole } from '../enums/user-roles';
import { switchAll } from 'rxjs';
import { of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) {}

  getAllUsers(): Observable<any[]> {
    return this.firestore
    .collection('funcionarios', ref => 
    ref.where('perfil', '!=', UserRole.admin))
    .valueChanges({ idField: 'email' });
  }

  getMyUser() {
    return this.auth.authState.pipe(
      switchMap(user => {
        if (user?.email) {
          return this.firestore.collection('funcionarios').doc(user.email).valueChanges()
        }
        return of(null);
      })
    );
  }

  async alterarPerfil(nome: string) {

    const user = await this.auth.currentUser;

    if(!user?.email){
      throw new Error('Usuário não autenticado!');
    }

    await user.updateProfile({
      displayName: nome
    });

    return this.firestore.collection('funcionarios').doc(user.email).update({ nome: nome });

    console.log(user?.email);
  }
}