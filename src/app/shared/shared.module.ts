import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { TextInputComponent } from './text-input/text-input.component';
import { TextareaInputComponent } from './textarea-input/textarea-input.component';

@NgModule({
  declarations: [TextInputComponent, TextareaInputComponent],
  imports: [
    CommonModule, FormsModule
  ],
  exports: [TextInputComponent, TextareaInputComponent]
})
export class SharedModule { }
