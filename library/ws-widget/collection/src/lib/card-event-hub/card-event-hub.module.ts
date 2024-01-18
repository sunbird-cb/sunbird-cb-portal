import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule, MatCardModule, MatDividerModule, MatIconModule } from '@angular/material'
import { RouterModule } from '@angular/router'
import { DefaultThumbnailModule } from '@sunbird-cb/utils'
import { SkeletonLoaderModule } from '../_common/skeleton-loader/skeleton-loader.module'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { CardEventHubComponent } from './card-event-hub.component'

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
  entryComponents: [CardEventHubComponent],
  exports: [CardEventHubComponent],
})
export class CardEventHubModule { }
