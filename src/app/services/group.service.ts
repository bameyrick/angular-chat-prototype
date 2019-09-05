import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, take, skipWhile } from 'rxjs/operators';

import { IGroup } from '../models';
import { UserService } from './user.service';

@Injectable()
export class GroupService {
  public groups$ = new BehaviorSubject<IGroup[]>([]);
  public userGroups$: Observable<IGroup[]>;
  public allGroups$: Observable<IGroup[]>;

  private unmappedUserGroups$ = new BehaviorSubject<IGroup[]>([]);
  private users$ = this.userService.users$;
  private currentUser: string;

  constructor(
    private db: AngularFirestore,
    private userService: UserService,
  ) {
    this.subscribeToCurrentUser();
    this.subscribeToUserGroups();

    this.allGroups$ = combineLatest(this.groups$, this.userGroups$, (groups, userGroups) => [...groups, ...userGroups]);
  }

  public async getGroupById(groupId: string): Promise<IGroup> {
    return (await this.allGroups$.pipe(
      map(groups => groups.filter(group => group.id === groupId)),
      take(1)
    ).toPromise())[0];
  }

  public async getUserGroup(userId: string): Promise<IGroup> {
    return (await this.userGroups$.pipe(
      skipWhile(groups => groups.length === 0),
      map(groups => groups.filter(group => group.users.includes(userId))),
      take(1)
    ).toPromise())[0];
  }

  private subscribeToCurrentUser(): void {
    this.userService.currentUserId$.subscribe(id => {

      if (id) {
        this.currentUser = id;

        this.subscribeGroups();
      }
    });
  }

  private subscribeGroups(): void {
    // Groups
    this.db
      .collection('groups', ref => ref
        .where('individual', '==', false)
        .where('users', 'array-contains', this.currentUser)
      )
      .snapshotChanges()
      .subscribe(async snapshot => {
        this.groups$.next(await this.mapSnapshotToGroup(snapshot));
      });

    // Individual groups
    this.db
      .collection('groups', ref => ref.where('individual', '==', true))
      .snapshotChanges()
      .subscribe(async snapshot => {
        this.unmappedUserGroups$.next(await this.mapSnapshotToGroup(snapshot));
      });
  }

  private subscribeToUserGroups(): void {
    this.userGroups$ = combineLatest(this.unmappedUserGroups$, this.users$, (groups, users) => {
      return groups
        .map(group => ({
          ...group,
          name: users[group.users[0]].displayName,
        }))
    });
  }

  private async mapSnapshotToGroup(snapshot): Promise<IGroup[]> {
    const data: IGroup[] = await snapshot.map(async doc => {
      const group = await doc.payload.doc.data() as IGroup;

      return {
        id: doc.payload.doc.id,
        ...group
      }
    });

    return Promise.all(data);
  }
}
