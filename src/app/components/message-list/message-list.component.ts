import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { GroupService } from '../../services/group.service';
import { MessageService } from '../../services/message.service';
import { UserService } from '../../services/user.service';

import { IGroup, IMessage } from '../../models';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit, AfterViewInit {
  @ViewChild('scroller', {static: false}) private scrollContainer: ElementRef;
  @ViewChildren('messages') private renderedMessages: QueryList<any>;

  public id: string;
  public group: IGroup;

  public messages$: Observable<IMessage[]>;
  public users$ = this.userService.users$;
  public currentUser: string;

  private groups$ = this.groupService.allGroups$;
  private groups: IGroup[];
  private oldestMessage: IMessage;
  private newestMessage: IMessage;
  private scrollToMessage: IMessage;
  private loadingMessages: boolean;
  private previousScrollY: number = 0;
  private firstMessagesLoaded = false;
  private messagesSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private messageService: MessageService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(route => {
      const previousId = this.id;
      this.id = route.get('id');

      this.onRouteChange(previousId);
    });

    this.groups$.subscribe(groups => {
      this.groups = groups;

      this.setGroup();
    });

    this.userService.currentUserId$.subscribe(id => this.currentUser = id);
  }

  ngAfterViewInit() {
    this.renderedMessages.changes.subscribe(() => this.onListReRender());
  }

  public onScroll(): void {
    const scrollPosition = this.scrollContainer.nativeElement.scrollTop;

    if (!this.loadingMessages) {
      const scrollDirection = scrollPosition > this.previousScrollY ? 1 : -1;

      if (scrollDirection === -1 && scrollPosition <= 0) {
        this.loadingMessages = true;

        this.scrollToMessage = this.oldestMessage;

        this.messageService.loadPreviousMessagesForGroup(this.group.id, this.oldestMessage.timestamp)
          .then(() => {
            this.loadingMessages = false;
          })
          .catch(error => {
            console.error(error);
          });
      } else if (scrollDirection === 1 && this.atBottom()) {
        this.messageService.freeMemoryForGroup(this.group.id);
      }
    }

    this.previousScrollY = scrollPosition;
  }

  public messageSent(): void {
    setTimeout(() => this.scrollToBottom());
  }

  private onRouteChange(previousId: string): void {
    this.scrollToMessage = null;
    this.firstMessagesLoaded = false;

    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }

    if (previousId) {
      this.messageService.freeMemoryForGroup(previousId);
    }

    this.setGroup();
  }

  private atBottom(): boolean {
    const scrollContainer = this.scrollContainer.nativeElement;

    return scrollContainer.scrollHeight - scrollContainer.scrollTop - 50 <= scrollContainer.clientHeight;
  }

  private async setGroup(): Promise<void> {
    if (this.id && this.groups) {
      this.group = this.groups.find(group => group.id === this.id);

      this.messages$ = this.messageService.groupMessages$[this.id];

      if (this.messages$) {
        this.messagesSubscription = this.messages$.subscribe(messages => {
          if (messages.length) {
            this.oldestMessage = messages[0];
            this.newestMessage = messages[messages.length - 1];

            if (!this.scrollToMessage && (!this.firstMessagesLoaded || this.atBottom())) {
              this.scrollToMessage = this.newestMessage;
            }

            this.firstMessagesLoaded = true;
          }
        });
      }
    }
  }

  private onListReRender(): void {
    if (this.scrollToMessage) {
      const messageElement = document.getElementById(this.scrollToMessage.id);

      this.scrollToMessage = null;

      if (messageElement) {
        const scrollContainer = this.scrollContainer.nativeElement;

        const top = messageElement.getBoundingClientRect().top;
        const scrollContainerTop = scrollContainer.getBoundingClientRect().top;

        scrollContainer.scrollTop = top - scrollContainerTop - 20;
      }
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight);
  }
}
