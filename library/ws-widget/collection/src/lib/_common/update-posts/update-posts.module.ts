import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { SkeletonLoaderModule } from './../skeleton-loader/skeleton-loader.module'

import { UpdatePostsComponent } from './update-posts.component'

@NgModule({
  declarations: [UpdatePostsComponent],

  imports: [
    CommonModule,
    SkeletonLoaderModule,
    MatIconModule,
    RouterModule,
  ],
  exports: [
    UpdatePostsComponent,
  ],
  entryComponents: [UpdatePostsComponent],
})

export class UpdatePostsModule { }
