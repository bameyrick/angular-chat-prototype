import { Component, Input } from '@angular/core';
import { IGroup } from 'src/app/models';

@Component({
  selector: 'app-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrls: ['./chat-list-item.component.scss']
})
export class ChatListItemComponent {
  @Input() chat: IGroup;
  @Input() current: boolean;
  @Input() unreadCount: number;
}
