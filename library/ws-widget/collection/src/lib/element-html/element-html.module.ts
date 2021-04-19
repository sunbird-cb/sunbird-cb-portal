import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ElementHtmlComponent } from '../element-html/element-html.component'
import { PipeSafeSanitizerModule } from '@sunbird-cb/utils'

@NgModule({
  declarations: [ElementHtmlComponent],
  imports: [CommonModule, PipeSafeSanitizerModule],
  entryComponents: [ElementHtmlComponent],
})
export class ElementHtmlModule {}
