import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'pipeFilterV2',
})
export class PipeFilterV2Pipe implements PipeTransform {

  transform(items: [], key: string, searchText: string): any {
    if (!items) { return [] }
    if (!searchText) { return items }
    const searchTextLowerCase = searchText.toLowerCase()

    return items.filter(it => {
      return `${it[key]} `.toLowerCase().includes(searchTextLowerCase)
    })

  }

}
