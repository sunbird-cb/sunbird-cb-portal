import { Pipe, PipeTransform } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'

@Pipe({
  name: 'QuestionSafeUrl',
})
export class QuestionSafeUrlPipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer) {}
  transform(url: any) {
    return this.domSanitizer.bypassSecurityTrustHtml(url)
  }

}
