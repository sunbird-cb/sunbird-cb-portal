import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MatIconModule } from '@angular/material'
import { AvatarPhotoModule } from '../avatar-photo/avatar-photo.module'

import { SkeletonLoaderModule } from '../skeleton-loader/skeleton-loader.module'

import { RecentRequestsComponent } from './recent-requests.component'

@NgModule({
  declarations: [RecentRequestsComponent],
  imports: [
    CommonModule,
    RouterModule,
    SkeletonLoaderModule,
    MatIconModule,
    AvatarPhotoModule,
  ],
  exports: [
    RecentRequestsComponent,
  ],
  entryComponents: [
    RecentRequestsComponent,
  ],
})
export class RecentRequestsModule { }
