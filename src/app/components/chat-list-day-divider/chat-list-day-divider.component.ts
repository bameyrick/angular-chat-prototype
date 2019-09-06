import { Component, Input } from '@angular/core';
import { IMessage } from 'src/app/models';

@Component({
  selector: 'app-chat-list-day-divider',
  templateUrl: './chat-list-day-divider.component.html',
  styleUrls: ['./chat-list-day-divider.component.scss']
})
export class ChatListDayDividerComponent {
  @Input() index: number;
  @Input() messages: IMessage[];

  public shouldRender(): boolean {
    if (this.index === 0) {
      return false;
    }

    const thisMessageDate = new Date(this.messages[this.index].timestamp).getDate();
    const previousMessageDate = new Date(this.messages[this.index - 1].timestamp).getDate();

    return previousMessageDate < thisMessageDate;
  }
}
