import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
  private collectionName = 'produto';
  constructor(private firestore: AngularFirestore) { }
  getAllProdutos(): Observable<any[]> {
    return this.firestore
      .collection(this.collectionName)
      .valueChanges({ idField: 'id' }); 
  }

  getProdutoById(id: string): Observable<any> {
    return this.firestore
      .collection(this.collectionName)
      .doc(id)
      .valueChanges({ idField: 'id' });
  }

  getProdutosTotais(): Observable<any> {
    return this.firestore
      .collection(this.collectionName, ref => ref.where('ativo', '==', true))
      .valueChanges({ idField: 'id' });
  }
}