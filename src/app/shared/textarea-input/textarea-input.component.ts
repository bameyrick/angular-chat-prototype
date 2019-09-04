import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-textarea-input',
  templateUrl: './textarea-input.component.html',
  styleUrls: ['./textarea-input.component.scss']
})
export class TextareaInputComponent implements OnChanges {
  @ViewChild('textarea',  { read: ElementRef, static: false}) myTextarea: ElementRef;

  @Input() text: string = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes.text.currentValue !== changes.text.previousValue) {
      setTimeout(() => this.resize());
    }
  }

  getText(): string {
    return this.text;
  }

  setText(text: string): void {
    this.text = text;
  }

  public handleKeyup($event: KeyboardEvent): void {
    if ($event.keyCode === 13) {
      if ($event.ctrlKey) {
        this.myTextarea.nativeElement.value = this.myTextarea.nativeElement.value + '\n';
      } 
    }
  }

  public resize(): void {
    this.myTextarea.nativeElement.style.height = '1px';
    const newHeight = this.myTextarea.nativeElement.scrollHeight + 2;

    this.myTextarea.nativeElement.style.height = `${newHeight}px`;
    this.myTextarea.nativeElement.scrollTop = newHeight;
  }

  public reset(): void {
    this.myTextarea.nativeElement.value = '';

    this.resize();
  }

}
