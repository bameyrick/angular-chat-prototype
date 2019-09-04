import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

export const newLineString = '\\n';
export const newLineRegex = new RegExp('\\\\n', 'g');

@Pipe({
  name: 'messageToHtml'
})
export class MessageToHtmlPipe implements PipeTransform {
  constructor(protected sanitizer: DomSanitizer) {}

  transform(value: string): any {
    return this.sanitizer.bypassSecurityTrustHtml(`<p>${value.replace(newLineRegex, '</p><p>')}</p>`);
  }
}
