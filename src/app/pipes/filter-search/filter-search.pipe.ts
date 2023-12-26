import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'filterSearch',
})
export class FilterSearchPipe implements PipeTransform {

    transform(items: any[], searchText: string): any {
        console.log(items, searchText);
        if (!items) { return [] }
        if (!searchText) { return items }
        const searchTextLowerCase = searchText.toLowerCase()
        return items.filter(it => {
            return it.name.toLowerCase().includes(searchTextLowerCase)
        })
    }

}
