import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'replaceNbspText',
})
export class ReplaceNbspTextPipe implements PipeTransform {

  transform(value: any): any {
    if (value.includes('&nbsp;')) {
      return value.replace(/&nbsp;/g, ' ')
    }
      return value
  }

}
