import { Component, Input, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute} from '@angular/router';

import { Message } from '../message';
import { MessageService } from '../services/message.service';
import { IMessage } from '../models';
import { TextareaInputComponent } from '../shared/textarea-input/textarea-input.component';

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
  @Input() groupId: string;
  // @ViewChild('userInput', { static: false }) userInput: ElementRef;
  @ViewChild(TextareaInputComponent,  { static: false}) myTextarea: any;

  public isEditing = false;
  private id: string;

  constructor(private messageService: MessageService, private route: ActivatedRoute) { }

  onEdit(message: IMessage) {
    this.isEditing = true;
  }

  onDelete(message: IMessage) {
    this.messageService.deleteMessage(this.groupId, message.id);
  }

  onCancel() {
    this.isEditing = false;
  }

  // public handleKeyup($event: KeyboardEvent): void {
  //   if ($event.keyCode === 13) {
  //     if ($event.ctrlKey) {
  //       this.userInput.nativeElement.value = this.userInput.nativeElement.value + '\n';
  //     } else {
  //       this.onUpdate();
  //     }
  //   }
  // }

  public onUpdate() {
    const message = this.myTextarea.getText();

    this.messageService.updateMessage(this.groupId, this.message.id, message);

    
    this.isEditing = false;

    this.myTextarea.reset();
  }

  // public resize() {
  //   this.userInput.nativeElement.style.height = '1px';
  //   const newHeight = this.userInput.nativeElement.scrollHeight + 2;

  //   this.userInput.nativeElement.style.height = `${newHeight}px`;
  //   this.userInput.nativeElement.scrollTop = newHeight;
  // }
}