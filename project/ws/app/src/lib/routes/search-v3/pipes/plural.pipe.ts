import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plural'
})
export class PluralPipe implements PipeTransform {
  transform(value: number, singular: string, plural: string = `${singular}s`): string {
    return value <= 1 ? singular : plural;
  }
}
