import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'
import {
  MatCardModule,
  MatButtonModule,
  MatDividerModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatSnackBarModule,
  MatIconModule,
  MatTooltipModule,
} from '@angular/material'

import { HtmlComponent } from './html.component'
import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [HtmlComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatIconModule,
    RouterModule,
    MatTooltipModule,
    TranslateModule,
  ],
  exports: [
    HtmlComponent,
  ],
})
export class HtmlModule { }
