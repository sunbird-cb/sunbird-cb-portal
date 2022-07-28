import { Pipe, PipeTransform } from '@angular/core'
import { environment } from 'src/environments/environment'

@Pipe({
  name: 'pipeCertImageURL',
})
export class PipeCertificateImageURL implements PipeTransform {

  transform(value: string): any {

    if (value.indexOf('/public/content') > -1) {
      const mainUrl = value && value.split('/content').pop() || ''
      // const finalURL = `${environment.contentHost}/${environment.contentBucket}/content${mainUrl}`
      const finalURL = `${environment.contentHost}/${environment.certificateassets}/content${mainUrl}`
      return value ? finalURL : ''
    }
    if (value.indexOf('/public/content') === -1) {
      const mainUrl = value && value.split('/content').pop() || ''
      const finalURL = `${environment.contentHost}/${environment.contentBucket}/${mainUrl}`
      return value ? finalURL : ''
    }
  }

}
