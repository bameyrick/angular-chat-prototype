import { Component, Input, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute} from '@angular/router';

import { Message } from '../message';
import { MessageService } from '../services/message.service';
import { IMessage } from '../models';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MessageComponent {
  @Input() message;
  @Input() user;
  @Input() contentEditable;
  @ViewChild('userInput', { static: false }) userInput: ElementRef;

  public isEditing = false;
  private id: string;

  constructor(private messageService: MessageService, private route: ActivatedRoute) { }

  onEdit(message: IMessage) {
    this.isEditing = true;
  }

  onDelete(message: IMessage) {
    this.messageService.deleteMessage(message.id);
  }

  onCancel() {
    this.isEditing = false;
  }

  public handleKeyup($event: KeyboardEvent): void {
    if ($event.keyCode === 13) {
      if ($event.ctrlKey) {
        this.userInput.nativeElement.value = this.userInput.nativeElement.value + '\n';
      } else {
        this.onUpdate();
      }
    }
  }

  public onUpdate() {
    const message = this.userInput.nativeElement.value;

    this.messageService.updateMessage(this.message.id, message);
    
    this.isEditing = false;

    this.resize();
  }

  public resize() {
    this.userInput.nativeElement.style.height = '1px';
    const newHeight = this.userInput.nativeElement.scrollHeight + 2;

    this.userInput.nativeElement.style.height = `${newHeight}px`;
    this.userInput.nativeElement.scrollTop = newHeight;
  }
}