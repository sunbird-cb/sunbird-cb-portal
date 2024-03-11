import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'pipeOrdinal',
})
export class PipeOrdinalPipe implements PipeTransform {

  transform(value: number): string {
    if (value === 0) { return '0th' }
    const suffixes = ['th', 'st', 'nd', 'rd']
    const v = value % 100
    return value + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
  }
}
