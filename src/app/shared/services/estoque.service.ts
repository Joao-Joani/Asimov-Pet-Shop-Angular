import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  private collectionName = 'estoque';
  constructor(private firestore: AngularFirestore) { }
  getAllEstoque(): Observable<any[]> {
    return this.firestore
      .collection(this.collectionName)
      .valueChanges({ idField: 'id' }); 
  }

  getEstoqueById(id: string): Observable<any> {
    return this.firestore
      .collection(this.collectionName)
      .doc(id)
      .valueChanges({ idField: 'id' });
  }
}