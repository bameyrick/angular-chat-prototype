import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'doesNotInclude'
})
export class DoesNotIncludePipe implements PipeTransform {
  transform(values: any[], key: string, value: any): any[] {
    return values.filter(val => !val[key].includes(value));
  }
}
