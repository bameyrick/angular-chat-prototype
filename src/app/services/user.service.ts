import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

import { IUser } from '../models';

@Injectable()
export class UserService {
  public users$  = new BehaviorSubject<{ [uid: string]: IUser }>({});
  public currentUser$ = new BehaviorSubject<string>('');

  private randomUserPicked = false;
  
  constructor(private db: AngularFirestore) { 
    this.subscribeToUsers();
  }

  public setCurrentUser(id: string): void {
    this.currentUser$.next(id);
  }

  private subscribeToUsers(): void {
    this.db.collection('users').snapshotChanges().subscribe(async snapshot => {
      const result = {};

      snapshot.forEach(doc => {
        const data = doc.payload.doc.data() as IUser;

        result[doc.payload.doc.id] = {
          ...data,
          initials: data.displayName
            .trim()
            .replace(/\s\s+/g, '')
            .split(' ')
            .map(word => word.slice(0, 1))
            .filter((letter, index) => index < 3)
            .join(''),
        };
      });

      this.users$.next(result);

      if (!this.randomUserPicked) {
        this.randomUserPicked = true;
        this.pickRandomUser(result);
      }
    });
  }

  private pickRandomUser(users: { [uid: string]: IUser }): void {
    const ids = Object.keys(users);
    const id = ids[Math.floor(Math.random() * ids.length)];

    this.setCurrentUser(id);
  }
}