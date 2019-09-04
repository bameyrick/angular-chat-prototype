import { Component } from '@angular/core';
import { map } from 'rxjs/operators';

import { UserService } from '../../services';

@Component({
  selector: 'app-user-selector',
  templateUrl: './user-selector.component.html',
  styleUrls: ['./user-selector.component.scss']
})
export class UserSelectorComponent{
  public users$ = this.userService.users$.pipe(map(users => Object.values(users)));
  public currentUserId$ = this.userService.currentUserId$;

  constructor(private userService: UserService) { }

  public onChange($event): void {
    this.userService.setCurrentUser($event);
  }
}
