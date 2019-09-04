import { Pipe, PipeTransform } from '@angular/core';
import { newLineString } from './message-to-html.pipe';

const regex = new RegExp(newLineString, 'g');

@Pipe({
  name: 'messageToInput'
})
export class MessageToInputPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.replace(regex, '\\n');
  }

}
