import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'filterSearch',
})
export class FilterSearchPipe implements PipeTransform {

    transform(items: any[], searchText: string): any {
        if (!items) { return [] }
        if (!searchText) { return items }
        const searchTextLowerCase = searchText ? searchText.toLowerCase() : ''
        return items?.filter(it => {
            if (it && it?.name) {
                return it.name.toLowerCase().includes(searchTextLowerCase)
            } else if (it && it?.title) {
                return it.title.toLowerCase().includes(searchTextLowerCase)
            }
        })
    }

}
