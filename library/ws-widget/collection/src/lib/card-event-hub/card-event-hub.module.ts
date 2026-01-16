import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { DefaultThumbnailModule } from '@sunbird-cb/utils-v2'
import { SkeletonLoaderModule } from '../_common/skeleton-loader/skeleton-loader.module'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { CardEventHubComponent } from './card-event-hub.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'

@NgModule({
    declarations: [CardEventHubComponent],
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        DefaultThumbnailModule,
        SkeletonLoaderModule,
        MatProgressSpinnerModule,
    ],
    exports: [CardEventHubComponent]
})
export class CardEventHubModule { }
