import { Injectable } from '@angular/core';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/firestore';
import { Subject, BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { sortBy } from 'sort-by-typescript';

import { UserService, GroupService } from '../services';
import { IMessage } from '../models';
import { newLineString, newLineRegex } from '../pipes/message-to-html.pipe';
import { asyncForEach, removeDuplicateObjectsFromArray } from '../utils';

const MESSAGE_RETRIEVE_LIMIT = 30;
const MESSAGE_STORE_LIMIT = 100;

@Injectable()
export class MessageService {
  public groupMessages$: { [key: string]: BehaviorSubject<IMessage[]> } = {};
  public newMessageSubjects: { [key: string]: Subject<IMessage> };
  public groupUnreadCounts$ = new BehaviorSubject<{ [key: string]: number }>({});
  public totalUnreadCount$ = new BehaviorSubject<number>(0);

  private currentUsersGroups: string[] = [];
  private groupMessages: { [key: string]: IMessage[] } = {};
  private currentUserId: string;
  private groupLastReads: { [key: string]: number } = {};

  constructor(
    private db: AngularFirestore,
    private userService: UserService,
    private groupService: GroupService,
  ) {
    this.subscribeToCurrentUser();
    this.subscribeToGroups();
    this.subscribeToNewMessages();
  }

  public async sendMessage(groupId: string, text: string): Promise<void> {
    text = this.sanitiseMessageText(text);

    if (text) {
      const timestamp = Date.now();

      this.db.collection('messages').add({
        timestamp,
        text,
        groupId,
        sender: this.currentUserId,
      } as IMessage);
    }
  }

  public async updateMessage(groupId: string, messageId: string, text: string): Promise<void> {
    text = this.sanitiseMessageText(text);

    await this.db.collection('messages').doc(messageId).update({ text } as IMessage);

    const messages = this.groupMessages[groupId];

    messages.find(msg => msg.id === messageId).text = text;

    this.updateGroupMessages(groupId, messages);
  }

  public async deleteMessage(groupId: string, messageId: string): Promise<void> {
    await this.db.collection('messages').doc(messageId).delete();

    this.updateGroupMessages(groupId, this.groupMessages[groupId].filter(message => message.id !== messageId));
  }

  public async loadPreviousMessagesForGroup(groupId: string, before: number = Date.now(), limit = MESSAGE_RETRIEVE_LIMIT): Promise<void> {
    const messages = await this.getPreviousMessagesForGroup(groupId, before, limit);

    this.addMessagesToGroup(groupId, messages);
  }

  public setLastReadMessageDateForGroup(groupId: string, timestamp: number): void {
    if (this.groupLastReads[groupId] === undefined) {
      this.groupLastReads[groupId] = 0;
    }

    if (timestamp > this.groupLastReads[groupId]) {
      this.groupLastReads[groupId] = timestamp;
    }

    this.updateUnreadCounts();
  }

  public freeMemoryForGroup(groupId): void {
    const messages = this.groupMessages[groupId]
      .sort(sortBy('timestamp'))
      .slice(this.groupMessages[groupId].length - MESSAGE_STORE_LIMIT, this.groupMessages[groupId].length);

    this.updateGroupMessages(groupId, messages);
  }

  private sanitiseMessageText(message: string): string {
    return message.trim().replace(/[\n\r]/g, newLineString);
  }

  private async getPreviousMessagesForGroup(groupId: string, before: number = Date.now(), limit = MESSAGE_RETRIEVE_LIMIT): Promise<IMessage[]> {
    const group = await this.groupService.getGroupById(groupId);

    if (group.individual) {
      const userGroup = await this.groupService.getUserGroup(this.currentUserId);

      const groupSnapshot = this.db.collection('messages', ref => ref
        .where('groupId', '==', groupId)
        .where('sender', '==', this.currentUserId)
        .orderBy('timestamp', 'desc')
        .startAfter(before)
        .limit(limit)
      ).get().toPromise();

      const userGroupSnapshot = this.db.collection('messages', ref => ref
        .where('groupId', '==', userGroup.id)
        .where('sender', '==', group.users[0])
        .orderBy('timestamp', 'desc')
        .startAfter(before)
        .limit(limit)
      ).get().toPromise();

      return (await Promise.all([
        this.mapSnapshotToMessages(await groupSnapshot),
        this.mapSnapshotToMessages(await userGroupSnapshot)
      ])).reduce((a, b) => a.concat(b));
    } else {
      const snapshot = await this.db.collection('messages', ref => ref
        .where('groupId', '==', groupId)
        .orderBy('timestamp', 'desc')
        .startAfter(before)
        .limit(limit)
      ).get().toPromise();

      return await this.mapSnapshotToMessages(snapshot);
    }
  }

  private async mapSnapshotToMessages(snapshot: QuerySnapshot<any>): Promise<IMessage[]> {
    return await Promise.all(snapshot.docs.map(async doc => {
      const message = doc.data();

      return {
        id: doc.id,
        ...message,
        text: message.text.replace(newLineRegex, newLineString),
      };
    })) as IMessage[];
  }

  private subscribeToCurrentUser(): void {
    this.userService.currentUserId$.subscribe(id => {
      this.currentUserId = id;

      this.resetUnreadMessages();
      this.updateUserGroupMessages();
    });
  }

  private resetUnreadMessages(): void {
    this.groupLastReads = {};
  }

  private async updateUserGroupMessages(): Promise<void> {
    const userGroupIds = (await this.groupService.userGroups$.pipe(take(1)).toPromise()).map(group => group.id);

    userGroupIds.forEach(async groupId => {
      this.groupMessages[groupId] = [];
      this.addMessagesToGroup(groupId, await this.getPreviousMessagesForGroup(groupId));
    });
  }

  private subscribeToGroups(): void {
    this.groupService.allGroups$.subscribe(groups => {
      this.currentUsersGroups = groups.map(group => group.id);

      groups.forEach(async group => {
        if (!this.groupMessages[group.id]) {
          this.groupMessages[group.id] = [];
          this.groupMessages$[group.id] = new BehaviorSubject([]);

          this.addMessagesToGroup(group.id, await this.getPreviousMessagesForGroup(group.id));
        }
      });
    });
  }

  private subscribeToNewMessages(): void {
    this.db.collection('messages', ref => ref.where('timestamp', '>', Date.now())).stateChanges(['added']).pipe(
      map(actions =>
        actions.map(action => {
          const data = action.payload.doc.data() as IMessage;
          const id = action.payload.doc.id;

          return {
            id,
            ...data,
            text: data.text.replace(newLineRegex, '\\n'),
          };
        })
        .filter(message => this.currentUsersGroups.includes(message.groupId))
      )
    )
    .subscribe(messages => this.handleNewMessages(messages))
  }

  private async handleNewMessages(messages: IMessage[]): Promise<void> {
    const groupMessages: { [key: string]: IMessage[] } = {};

    await asyncForEach(messages, async message => {
      this.addMessageToIndex(groupMessages, message.groupId, message);

      if ((await this.groupService.getGroupById(message.groupId)).individual) {
        const senderGroup = await this.groupService.getUserGroup(message.sender);

        this.addMessageToIndex(groupMessages, senderGroup.id, message)
      }
    });

    Object.keys(groupMessages).forEach(groupId => {
      this.addMessagesToGroup(groupId, groupMessages[groupId]);
    });
  }

  private addMessagesToGroup(groupId: string, messages: IMessage[]) {
    const newMessages = removeDuplicateObjectsFromArray<IMessage>([...this.groupMessages[groupId], ...messages]).sort(sortBy('timestamp'));

    if (newMessages.map(message => message.id).join('') !== this.groupMessages[groupId].map(message => message.id).join('')) {
      this.updateGroupMessages(groupId, newMessages);
    }
  }

  private updateGroupMessages(groupId: string, messages: IMessage[]) {
    this.groupMessages[groupId] = removeDuplicateObjectsFromArray<IMessage>(messages);

    this.groupMessages$[groupId].next(this.groupMessages[groupId]);

    setTimeout(() => this.updateUnreadCounts());
  }

  private addMessageToIndex(index: { [key: string]: IMessage[] }, groupId: string, message: IMessage): void {
    if (!index[groupId]) {
      index[groupId] = [];
    }

    index[groupId].push(message);
  }

  private updateUnreadCounts(): void {
    const result = {};
    let totalUnread = 0;

    Object.keys(this.groupMessages).forEach(key => {
      let lastReadTime = this.groupLastReads[key];

      const groupMessages = this.groupMessages[key];

      if (groupMessages.length && !lastReadTime) {
        lastReadTime = this.groupLastReads[key] = groupMessages[groupMessages.length - 1].timestamp;
      }

      const count = groupMessages.filter(message => message.timestamp > lastReadTime).length;

      totalUnread += count;

      result[key] = count;
    });

    this.groupUnreadCounts$.next(result);

    this.totalUnreadCount$.next(totalUnread);
  }
}
