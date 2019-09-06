import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import { AppRoutingModule } from './app-routing.module';

import { UserService } from './services/user.service';
import { GroupService } from './services/group.service';
import { MessageService } from './services/message.service';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { MessageComponent } from './components/message/message.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { MessageFormComponent } from './components/message-form/message-form.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { UserSelectorComponent } from './components/user-selector/user-selector.component';
import { ChatListItemComponent } from './components/chat-list-item/chat-list-item.component';
import { NotificationCountComponent } from './components/notification-count/notification-count.component';

import { FilterByPipe } from './pipes/filter-by.pipe';
import { MessageToHtmlPipe } from './pipes/message-to-html.pipe';
import { SortByPipe } from './pipes/sort-by.pipe';
import { DoesNotIncludePipe } from './pipes/does-not-include.pipe';

const firebaseConfig = {
  apiKey: "AIzaSyCEwBcOwZ8FIDvIfEjmS0r5jgLnjwSqxLU",
  authDomain: "chat-prototype-8ae8f.firebaseapp.com",
  databaseURL: "https://chat-prototype-8ae8f.firebaseio.com",
  projectId: "chat-prototype-8ae8f",
  storageBucket: "chat-prototype-8ae8f.appspot.com",
  messagingSenderId: "784524788274",
  appId: "1:784524788274:web:0e5e20808d75bee4"
};

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    SharedModule,
    FontAwesomeModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule
  ],
  exports: [
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    MessageComponent,
    MessageListComponent,
    MessageFormComponent,
    ChatListComponent,
    FilterByPipe,
    MessageToHtmlPipe,
    SortByPipe,
    DoesNotIncludePipe,
    UserSelectorComponent,
    ChatListItemComponent,
    NotificationCountComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    MessageService,
    UserService,
    GroupService,
  ],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faEdit, faTrashAlt);
  }
}
