import { Component, Input, ViewEncapsulation, ViewChild, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
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

  @ViewChild(TextareaInputComponent, { static: false }) textarea: TextareaInputComponent;

  public isEditing = false;
  public editableMessage: string;

  private observingVisibility = false;

  constructor(private elementRef: ElementRef, private messageService: MessageService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (didChange(changes.message)) {
      this.editableMessage = this.message.text.replace(newLineRegex, '\n');
      setTimeout(() => this.observeVisibility());
    }
  }

  public edit(): void {
    this.isEditing = true;
  }

  public delete(): void {
    this.messageService.deleteMessage(this.groupId, this.message.id);
  }

  public cancel(): void {
    this.isEditing = false;
  }

  public save(): void {
    this.messageService.updateMessage(this.groupId, this.message.id, this.editableMessage);

    this.isEditing = false;

    this.textarea.reset();
  }

  private observeVisibility(): void {
    if (!this.observingVisibility) {
      this.observingVisibility = true;

      const observer = new IntersectionObserver(entries => this.onScrollIntoView(entries), {
        root: this.elementRef.nativeElement.parentElement,
      });

      observer.observe(this.elementRef.nativeElement);
    }
  }

  private onScrollIntoView(entries: IntersectionObserverEntry[]): void {
    if (entries[0].isIntersecting) {
      this.messageService.setLastReadMessageDateForGroup(this.groupId, this.message.timestamp);
    }
  }
}
