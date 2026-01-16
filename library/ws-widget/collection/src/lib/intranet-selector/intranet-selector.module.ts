import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IntranetSelectorComponent } from './intranet-selector.component'
import { WidgetResolverModule } from '@sunbird-cb/resolver'

@NgModule({
    declarations: [IntranetSelectorComponent],
    imports: [
        CommonModule,
        WidgetResolverModule,
    ]
})
export class IntranetSelectorModule { }
