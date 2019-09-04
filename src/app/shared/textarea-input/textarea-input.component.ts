import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { didChange } from 'src/app/utils';

@Component({
  selector: 'app-textarea-input',
  templateUrl: './textarea-input.component.html',
  styleUrls: ['./textarea-input.component.scss']
})
export class TextareaInputComponent implements OnChanges {
  @ViewChild('textarea',  { read: ElementRef, static: false}) textarea: ElementRef;

  @Input() text: string = '';
  @Output() textChange = new EventEmitter<string>();

  @Output() enter = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {
    if (didChange(changes.text)) {
      setTimeout(() => this.resize());
    }
  }

  public handleKeyup($event: KeyboardEvent): void {
    if ($event.keyCode === 13) {
      if ($event.ctrlKey) {
        this.textarea.nativeElement.value = this.textarea.nativeElement.value + '\n';
      } else {
        this.enter.emit();
      }
    }
  }

  public onInput(): void {
    this.textChange.emit(this.textarea.nativeElement.value);
    this.resize();
  }

  public resize(): void {
    this.textarea.nativeElement.style.height = '1px';
    const newHeight = this.textarea.nativeElement.scrollHeight + 2;

    this.textarea.nativeElement.style.height = `${newHeight}px`;
    this.textarea.nativeElement.scrollTop = newHeight;
  }

  public reset(): void {
    this.textarea.nativeElement.value = '';

    this.resize();
  }

}
