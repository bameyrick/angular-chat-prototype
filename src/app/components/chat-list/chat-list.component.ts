import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';

import { GroupService, UserService, MessageService } from '../../services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit, OnDestroy {
  public id: string;
  public groupChats$ = this.groupService.groups$;
  public userChats$ = this.groupService.userGroups$;
  public currentUserId$ = this.userService.currentUserId$;
  public unreadCounts$ = this.messageService.groupUnreadCounts$;
  public totalUnreadCount$ = this.messageService.totalUnreadCount$;

  private subscriptions: Subscription[];
  private currentUserId: string;

  constructor(
    private groupService: GroupService,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.subscriptions = [
      this.subscribeToRouterEvents(),
      this.subscribeToCurrentUser(),
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private subscribeToRouterEvents(): Subscription {
    return this.router.events.subscribe(async event => {
      if (event instanceof ActivationEnd) {
        this.id = event.snapshot.params.id;

        this.checkIfRouteIsForCurrentUser();
      }
    });
  }

  private subscribeToCurrentUser(): Subscription {
    return this.currentUserId$.subscribe(id => {
      this.currentUserId = id;

      this.checkIfRouteIsForCurrentUser();
    });
  }

  private async checkIfRouteIsForCurrentUser(): Promise<void> {
    const group = await this.groupService.getUserGroup(this.currentUserId);

    if (group && group.id === this.id) {
      this.router.navigateByUrl('/');
    }
  }
}
