import { Component, Input, ViewEncapsulation, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MessageService } from '../services/message.service';
import { IMessage, IUser } from '../models';
import { TextareaInputComponent } from '../shared/textarea-input/textarea-input.component';
import { newLineRegex } from '../pipes/message-to-html.pipe';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MessageComponent implements OnChanges {
  @Input() message: IMessage;
  @Input() user: IUser;
  @Input() contentEditable: boolean;
  @Input() groupId: string;
  @ViewChild(TextareaInputComponent,  { static: false}) myTextarea: any;

  public isEditing = false;
  public editableMessage: string;

  private id: string;

  constructor(private messageService: MessageService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.message.currentValue !== changes.message.previousValue) {
      this.editableMessage = this.message.text.replace(newLineRegex, '\n');
    }
  }

  onEdit() {
    this.isEditing = true;
  }

  onDelete(message: IMessage) {
    this.messageService.deleteMessage(this.groupId, message.id);
  }

  onCancel() {
    this.isEditing = false;
  }

  public onUpdate() {
    const message = this.myTextarea.getText();

    this.messageService.updateMessage(this.groupId, this.message.id, message);

    
    this.isEditing = false;

    this.myTextarea.reset();
  }
}
