import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DisplayContentsComponent } from './display-contents.component'
import { DisplayContentTypeModule } from '../display-content-type/display-content-type.module'
import { PipeDurationTransformModule, PipeLimitToModule, DefaultThumbnailModule, PipePublicURLModule } from '@sunbird-cb/utils-v2'
import { MatIconModule, MatButtonModule, MatProgressBarModule, MatCardModule } from '@angular/material'
import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [DisplayContentsComponent],
  imports: [
    CommonModule,
    DefaultThumbnailModule,
    DisplayContentTypeModule,
    PipeDurationTransformModule,
    PipeLimitToModule,
    MatCardModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    PipePublicURLModule,
  ],
  exports: [
    DisplayContentsComponent,
  ],
})
export class DisplayContentsModule { }
