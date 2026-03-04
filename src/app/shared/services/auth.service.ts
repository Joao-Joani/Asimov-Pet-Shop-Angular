import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { UserInterface } from '../interfaces/user-interface';


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
      if(error.code == 'auth/email-already-in-use'){
        alert('Email já cadastrado');
      }
      console.log(error.code);
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
      if(error.code === 'auth/invalid-credential'){
        alert('Email ou Senha incorretos');
      }
      console.log(error.code);
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
      alert('Link enviado. Por favor, verifique seu email!');
    } catch(error) {
      alert('Erro ao enviar email');
    }
  }
}
