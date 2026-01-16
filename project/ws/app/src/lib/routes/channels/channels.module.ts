import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ChannelsRoutingModule } from './channels-routing.module'
import { ChannelsHomeComponent } from './routes/channels-home/channels-home.component'
import { CardChannelModule, CardChannelModuleV2, CardContentModule, BtnPageBackModule } from '@sunbird-cb/collection'
import { CardContentV2Module } from '@sunbird-cb/collection/src/lib/card-content-v2/card-content-v2.module'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatToolbarModule } from '@angular/material/toolbar'
@NgModule({
  declarations: [ChannelsHomeComponent],
  imports: [
    CommonModule,
    ChannelsRoutingModule,
    CardChannelModule,
    MatToolbarModule,
    BtnPageBackModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    CardChannelModuleV2,
    CardContentModule,
    CardContentV2Module,
  ],
})
export class ChannelsModule { }
