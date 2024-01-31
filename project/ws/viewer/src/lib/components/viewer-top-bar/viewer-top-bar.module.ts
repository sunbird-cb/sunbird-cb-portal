import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import {
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatTooltipModule,
} from '@angular/material'
import { ViewerTopBarComponent } from './viewer-top-bar.component'
import { BtnFullscreenModule, BtnPageBackNavModule } from '@sunbird-cb/collection'
import { RouterModule } from '@angular/router'
import { ValueService } from '@sunbird-cb/utils'
import { CourseCompletionDialogModule } from '../course-completion-dialog/course-completion-dialog.module'
import { TranslateModule } from '@ngx-translate/core'
@NgModule({
  declarations: [ViewerTopBarComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    BtnFullscreenModule,
    BtnPageBackNavModule,
    MatTooltipModule,
    RouterModule,
    CourseCompletionDialogModule,
    TranslateModule,
  ],
  exports: [ViewerTopBarComponent],
  providers: [ValueService],
})
export class ViewerTopBarModule {
  isXSmall = false

  constructor() {

  }

}
