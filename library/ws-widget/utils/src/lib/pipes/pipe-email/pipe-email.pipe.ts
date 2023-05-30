import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'pipeEmail',
})
export class PipeEmailPipe implements PipeTransform {

  transform(value: string): any {
    return value.split('.').join('[dot]').replace('@', '[at]')

  }

}
