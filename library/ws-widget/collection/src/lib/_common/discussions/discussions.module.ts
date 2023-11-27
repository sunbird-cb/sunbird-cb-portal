import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MatIconModule } from '@angular/material'
import { SkeletonLoaderModule } from '../skeleton-loader/skeleton-loader.module'
import { PipeRelativeTimeModule } from '@sunbird-cb/utils'

import { DiscussionsComponent } from './discussions.component'

@NgModule({
  declarations: [DiscussionsComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    SkeletonLoaderModule,
    PipeRelativeTimeModule,
  ],
  exports: [
    DiscussionsComponent,
  ],
  entryComponents: [DiscussionsComponent],
})

export class DiscussionsModule { }
