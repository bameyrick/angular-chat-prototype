import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AppRoutingModule } from './app-routing.module';

import { UserService } from './services/user.service';
import { GroupService } from './services/group.service';
import { MessageService } from './services/message.service';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { AppComponent } from './app.component';
import { MessageComponent } from './message/message.component';
import { MessageListComponent } from './message-list/message-list.component';
import { MessageFormComponent } from './message-form/message-form.component';
import { ChatListComponent } from './chat-list/chat-list.component';

import { FilterByPipe } from './pipes/filter-by.pipe';
import { MessageToHtmlPipe } from './pipes/message-to-html.pipe';
import { SortByPipe } from './pipes/sort-by.pipe';

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
  imports:      [ BrowserModule, FormsModule, FontAwesomeModule, AppRoutingModule, AngularFireModule.initializeApp(firebaseConfig), AngularFirestoreModule ],
  exports: [AppRoutingModule],
  declarations: [ AppComponent, MessageComponent, MessageListComponent, MessageFormComponent, ChatListComponent, FilterByPipe, MessageToHtmlPipe, SortByPipe ],
  bootstrap:    [ AppComponent ],
  providers: [MessageService, UserService, GroupService]
})
export class AppModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(faEdit, faTrashAlt);
  }
 }
