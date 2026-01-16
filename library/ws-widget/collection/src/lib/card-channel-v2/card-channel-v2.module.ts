import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CardChannelV2Component } from './card-channel-v2.component'
import { RouterModule } from '@angular/router'
import { PipeDurationTransformModule, DefaultThumbnailModule } from '@sunbird-cb/utils-v2'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatIconModule } from '@angular/material/icon'

@NgModule({
    declarations: [CardChannelV2Component],
    imports: [
        CommonModule,
        RouterModule,
        PipeDurationTransformModule,
        DefaultThumbnailModule,
        // Material Imports
        MatCardModule,
        MatIconModule,
    ],
    exports: [CardChannelV2Component]
})
export class CardChannelModuleV2 { }
