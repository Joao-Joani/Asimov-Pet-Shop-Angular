import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { UserInterface } from '../interfaces/user-interface';
import firebase from 'firebase/compat/app';
import { UserRole } from '../enums/user-roles';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore, private router: Router) { }

  async cadastro(user: UserInterface) {
    try {
      const cred = await this.auth.createUserWithEmailAndPassword(user.email, user.senha);

      const { senha, ...userData } = user;
      
      console.log('Cadastrado');

      await this.salvarDados(user!.email, userData);

      //await cred.user!.sendEmailVerification();

      await this.auth.signOut();

      this.router.navigate(['/login']);

    } catch(error: any) {
      console.log(error.code);
      throw error;
    } 
  }

  async salvarDados(id: string, user: Partial<UserInterface>) {
    try {
      return this.firestore.collection('funcionarios').doc(id).set(user);

    } catch(error) {
      console.log(error);
    }
  }

  async login(email: string, password: string){
    try {
      const cred = await this.auth.signInWithEmailAndPassword(email, password);
      console.log("Logado");
      this.router.navigate(['/inicio']);
    } catch(error: any) {
      console.log(error.code);
      throw error; 
    }
  }

  async logout() {
    try {
      await this.auth.signOut();
      this.router.navigate(['/']);
    } catch(error) {
      console.log(error);
    }
  }

  async recuperarSenha(email: string) {
    try {
      await this.auth.sendPasswordResetEmail(email);
    } catch(error) {
      console.log(error);
      throw error;
    }
  }

  async loginGoogle() {

    try {

      const provider = new firebase.auth.GoogleAuthProvider();

      const cred = await this.auth.signInWithPopup(provider);

      const user = cred.user;

      if(!user?.email) return;

      const doc = await this.firestore.collection('funcionarios').doc(user.email).ref.get();

      if(!doc.exists) {
        await this.salvarDados(user.email, {
          nome: user.displayName ?? '',
          email: user.email,
          perfil: UserRole.leitor
        });
      }

      this.router.navigate(['/inicio']);

    } catch (error) {
      console.log(error);
    }

  }

}