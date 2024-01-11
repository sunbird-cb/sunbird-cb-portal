import { Pipe, PipeTransform } from '@angular/core'
import { environment } from 'src/environments/environment'

@Pipe({
  name: 'pipeCertImageURL',
})
export class PipeCertificateImageURL implements PipeTransform {

  transform(value: string): any {
    if (value.indexOf('/public/content') > -1) {
      if (value.indexOf('/content/content') === -1 || value.indexOf('/content/collection') === -1) {
        const mainUrl = value && value.split('/content').pop() || ''
        const finalURL = `${environment.contentHost}/${environment.certificateassets}/content${mainUrl}`
        return value ? finalURL : ''
      }
    }

    if (value.indexOf('/public/content') === -1) {
      if (value.indexOf('/content/content') > -1 || value.indexOf('/igot/content') > -1 || value.indexOf('/content-store/content') > -1) {
        const mainUrl = value && value.split('/content').pop() || ''
        const finalURL = `${environment.contentHost}/${environment.contentBucket}/content${mainUrl}`
        return value ? finalURL : ''
      }
      if (value.indexOf('/igotprod/collection') > -1) {
        const mainUrl = value && value.split('/igotprod').pop() || ''
        const finalURL = `${environment.contentHost}/${environment.contentBucket}${mainUrl}`
        return value ? finalURL : ''
      }
      if (value.indexOf('/igotprod/content') > -1) {
        const mainUrl = value && value.split('/igotprod').pop() || ''
        const finalURL = `${environment.contentHost}/${environment.contentBucket}${mainUrl}`
        return value ? finalURL : ''
      }
      if (value.indexOf('/igotbm/collection') > -1) {
        const mainUrl = value && value.split('/igotbm').pop() || ''
        const finalURL = `${environment.contentHost}/${environment.contentBucket}${mainUrl}`
        return value ? finalURL : ''
      }
      if (value.indexOf('/igotbm/content') > -1) {
        const mainUrl = value && value.split('/igotbm').pop() || ''
        const finalURL = `${environment.contentHost}/${environment.contentBucket}${mainUrl}`
        return value ? finalURL : ''
      }
      if (value.indexOf('/igot/collection') > -1) {
        const mainUrl = value && value.split('/igot').pop() || ''
        const finalURL = `${environment.contentHost}/${environment.contentBucket}${mainUrl}`
        return value ? finalURL : ''
      }
      if (value.indexOf('/igot/content') > -1) {
        const mainUrl = value && value.split('/igot').pop() || ''
        const finalURL = `${environment.contentHost}/${environment.contentBucket}${mainUrl}`
        return value ? finalURL : ''
      }
      if (value.indexOf('/igot/profileImage') > -1) {
        const mainUrl = value && value.split('/igot').pop() || ''
        const finalURL = `${environment.contentHost}/${environment.contentBucket}${mainUrl}`
        return value ? finalURL : ''
      }
      if (value.indexOf('/igotqa/profileImage') > -1) {
        const mainUrl = value && value.split('/igotqa').pop() || ''
        const finalURL = `${environment.contentHost}/${environment.contentBucket}${mainUrl}`
        return value ? finalURL : ''
      }
      if (value.indexOf('/igotbm/profileImage') > -1) {
        const mainUrl = value && value.split('/igotbm').pop() || ''
        const finalURL = `${environment.contentHost}/${environment.contentBucket}${mainUrl}`
        return value ? finalURL : ''
      }
      if (value.indexOf('/igotprod/profileImage') > -1) {
        const mainUrl = value && value.split('/igotprod').pop() || ''
        const finalURL = `${environment.contentHost}/${environment.contentBucket}${mainUrl}`
        return value ? finalURL : ''
      }
      if (value.indexOf('/content/collection') > -1) {
        const mainUrl = value && value.split('/content').pop() || ''
        const finalURL = `${environment.contentHost}/${environment.contentBucket}${mainUrl}`
        return value ? finalURL : ''
      }
      if (value.indexOf('/content/content') === -1 || value.indexOf('/content/collection') === -1) {
        const mainUrl = value && value.split('/content').pop() || ''
        const finalURL = `${environment.contentHost}/${environment.contentBucket}${mainUrl}`
        return value ? finalURL : ''
      }

    }
  }
}
