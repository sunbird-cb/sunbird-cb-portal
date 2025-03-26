import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number): string {
    if (!value) {
      return ''
    }
    // const words = value.split(' ')
    // const newWord = words.slice(0, limit).join(' ')
    const charLen = value.trim()
    const newWord = value.substring(0, limit)
    return charLen.length > limit ? (`${newWord}...`) : value
  }
}
