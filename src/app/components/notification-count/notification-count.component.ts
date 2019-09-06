import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { debounce } from 'debounce';

import { didChange } from 'src/app/utils';

@Component({
  selector: 'app-notification-count',
  templateUrl: './notification-count.component.html',
  styleUrls: ['./notification-count.component.scss'],
})
export class NotificationCountComponent implements OnChanges {
  @Input() private number: number;
  @Input() private max = 99;

  public displayNumber: string;
  public visible: boolean;
  public hidden: boolean;
  public animate: boolean;

  private debouncedSetDisplayNumber = debounce(this.setDisplayNumber.bind(this), 200);

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (didChange(changes.number) || didChange(changes.max)) {
      this.debouncedSetDisplayNumber();
    }
  }

  private setDisplayNumber(): void {
    if (this.number > this.max) {
      this.displayNumber = `${this.max}+`;
    } else {
      this.displayNumber = this.number.toString();
    }

    const previousVisible = this.visible;
    this.visible = this.number > 0;
    this.hidden = previousVisible === true && !this.visible;
    this.animate = false;

    if (this.visible) {
      setTimeout(() => this.animate = true);
    }
  }
}
