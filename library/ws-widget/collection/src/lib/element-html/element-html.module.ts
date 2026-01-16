import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ElementHtmlComponent } from '../element-html/element-html.component'
import { PipeSafeSanitizerModule } from '@sunbird-cb/utils-v2'

@NgModule({
    declarations: [ElementHtmlComponent],
    imports: [CommonModule, PipeSafeSanitizerModule]
})
export class ElementHtmlModule {}
