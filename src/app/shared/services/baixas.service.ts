import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaixasService {
  private collectionName = 'baixas';
  constructor(private firestore: AngularFirestore) { }
  getAllBaixas(): Observable<any[]> {
    return this.firestore
      .collection(this.collectionName)
      .valueChanges({ idField: 'id' }); 
  }

  getBaixasById(id: string): Observable<any> {
    return this.firestore
      .collection(this.collectionName)
      .doc(id)
      .valueChanges({ idField: 'id' });
  }
}