import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { MessageService } from '../services/message.service';
import { TextareaInputComponent } from '../shared/textarea-input/textarea-input.component';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss']
})
export class MessageFormComponent implements OnInit {
  // @ViewChild('message', { static: false }) message: ElementRef;
  @ViewChild(TextareaInputComponent,  {static: false}) myTextarea: any;

  @Output() messageSent = new EventEmitter();

  testText:string = '';
  message: string;

  private id: string;

  constructor(private messageService: MessageService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(route => {
      this.id = route.get('id');
    })
  }
    
  public send() {
    const message = this.myTextarea.getText();

    this.messageService.sendMessage(this.id, message);

    this.messageSent.emit();

    this.myTextarea.reset();
  }

}