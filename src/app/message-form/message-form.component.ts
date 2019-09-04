import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss']
})
export class MessageFormComponent implements OnInit {
  @ViewChild('message', { static: false }) message: ElementRef;

  @Output() messageSent = new EventEmitter();

  private id: string;

  constructor(private messageService: MessageService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(route => {
      this.id = route.get('id');
    })
  }

  public handleKeyup($event: KeyboardEvent): void {
    if ($event.keyCode === 13) {
      if ($event.ctrlKey) {
        this.message.nativeElement.value = this.message.nativeElement.value + '\n';
      } else {
        this.send();
      }
    }
  }

  public send() {
    const message = this.message.nativeElement.value;

    this.messageService.sendMessage(this.id, message);

    this.message.nativeElement.value = '';

    this.resize();

    this.messageSent.emit();
  }

  public resize() {
    this.message.nativeElement.style.height = '1px';
    const newHeight = this.message.nativeElement.scrollHeight + 2;

    this.message.nativeElement.style.height = `${newHeight}px`;
    this.message.nativeElement.scrollTop = newHeight;
  }
}