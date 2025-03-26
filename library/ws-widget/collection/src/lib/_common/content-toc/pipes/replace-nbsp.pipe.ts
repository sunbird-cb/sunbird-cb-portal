import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'replaceNbsp',
})
export class ReplaceNbspPipe implements PipeTransform {

  transform(value: any): any {
    if (value.includes('&nbsp;')) {
      return value.replace(/&nbsp;/g, ' ')
    }
      return value
  }
}
