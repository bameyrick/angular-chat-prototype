import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

export const newLineString = '\\n';

@Pipe({
  name: 'messageToHtml'
})
export class MessageToHtmlPipe implements PipeTransform {

  constructor(protected sanitizer: DomSanitizer) {}

  transform(value: string): any {
    return this.sanitizer.bypassSecurityTrustHtml(`<p>${value.split(newLineString).join('</p><p>')}</p>`);
  }

}