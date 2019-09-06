import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute} from '@angular/router';

import { MessageService } from '../../services';
import { TextareaInputComponent } from '../../shared/textarea-input/textarea-input.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss']
})
export class MessageFormComponent implements OnInit, OnDestroy {
  @ViewChild(TextareaInputComponent,  {static: false}) myTextarea: any;

  @Output() messageSent = new EventEmitter<string>();

  public message: string;

  private id: string;
  private routesSubscription: Subscription;

  constructor(private messageService: MessageService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.routesSubscription = this.route.paramMap.subscribe(route => {
      this.id = route.get('id');
    });
  }

  ngOnDestroy() {
    this.routesSubscription.unsubscribe();
  }

  public async send(): Promise<void> {
    const messageId = await this.messageService.sendMessage(this.id, this.message);

    this.messageSent.emit(messageId);

    this.myTextarea.reset();
  }
}
