import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { JanKarmayogiRoutingModule } from './jan-karmayogi-routing.module'
import { JanKarmayogiHomeComponent } from './components/jan-karmayogi-home/jan-karmayogi-home.component'
import { WidgetResolverModule } from '@sunbird-cb/resolver/src/public-api'
import { CardContentV2Module } from '@sunbird-cb/collection/src/lib/card-content-v2/card-content-v2.module'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [JanKarmayogiHomeComponent],
  imports: [
    CommonModule,
    JanKarmayogiRoutingModule,
    WidgetResolverModule,
    CardContentV2Module,
    TranslateModule,
  ],
})
export class JanKarmayogiModule { }
