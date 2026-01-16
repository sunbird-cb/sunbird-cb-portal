import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LayoutLinearComponent } from './layout-linear.component'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
@NgModule({
    declarations: [LayoutLinearComponent],
    imports: [CommonModule, WidgetResolverModule]
})
export class LayoutLinearModule {}
