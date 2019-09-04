import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';

import { GroupService, UserService } from '../services';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  public id: string;
  public groupChats$ = this.groupService.groups$;
  public userChats$ = this.groupService.userGroups$;
  public currentUserId$ = this.userService.currentUserId$;

  constructor(
    private groupService: GroupService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof ActivationEnd) {
        this.id = event.snapshot.params.id;
      }
    });
  }
}
