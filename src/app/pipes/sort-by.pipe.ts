import { Pipe, PipeTransform } from '@angular/core';
import { sortBy } from 'sort-by-typescript';

@Pipe({
  name: 'sortBy'
})
export class SortByPipe implements PipeTransform {

  transform(value: any[], args?: any): any[] {
    return value.sort(sortBy(args));
  }

}
