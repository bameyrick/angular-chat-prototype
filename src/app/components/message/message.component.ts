import { Component, Input, ViewEncapsulation, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { IMessage, IUser } from '../../models';
import { TextareaInputComponent } from '../../shared/textarea-input/textarea-input.component';
import { newLineRegex } from '../../pipes/message-to-html.pipe';
import { didChange } from '../../utils';

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

  constructor(private messageService: MessageService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (didChange(changes.message)) {
      this.editableMessage = this.message.text.replace(newLineRegex, '\n');
    }
  }

  public edit(): void {
    this.isEditing = true;
  }

  public delete(message: IMessage): void {
    this.messageService.deleteMessage(this.groupId, this.message.id);
  }

  public cancel(): void {
    this.isEditing = false;
  }

  public save(): void {
    this.messageService.updateMessage(this.groupId, this.message.id, this.editableMessage);

    this.isEditing = false;

    this.myTextarea.reset();
  }
}
