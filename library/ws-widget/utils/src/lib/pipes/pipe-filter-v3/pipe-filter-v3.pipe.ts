import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'pipeFilterV3',
})
export class PipeFilterV3Pipe implements PipeTransform {

  transform(items: any, filter: any, isAnd: boolean): any {
    if (filter && Array.isArray(items)) {
      const filterKeys = Object.keys(filter)
      if (isAnd) {
        return items.filter(item =>
            filterKeys.reduce((memo: boolean, keyName) =>
                // tslint:disable-next-line: align
                (memo && new RegExp(filter[keyName], 'gi').test(item[keyName])) || filter[keyName] === '', true))
      }
        return items.filter(item => {
          return filterKeys.some(keyName => {
            return new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] === ''
          })
        })

    }
      return items

  }

}
