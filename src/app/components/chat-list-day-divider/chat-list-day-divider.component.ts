import { Component, Input } from '@angular/core';
import * as moment from 'moment';

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

  public isToday(): boolean {
    const format = 'DDMMYYY';
    return moment(this.messages[this.index].timestamp).format(format) === moment(Date.now()).format(format);
  }
}
