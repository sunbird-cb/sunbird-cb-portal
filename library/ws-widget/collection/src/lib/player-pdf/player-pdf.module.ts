import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PlayerPdfComponent } from './player-pdf.component'
import {
  MatIconModule,
  MatFormFieldModule,
  MatMenuModule,
  MatButtonModule,
  MatSliderModule,
  MatToolbarModule,
  MatInputModule,
} from '@angular/material'
import { ReactiveFormsModule } from '@angular/forms'
import { BtnFullscreenModule } from '../btn-fullscreen/btn-fullscreen.module'
import { TranslateModule } from '@ngx-translate/core'
@NgModule({
  declarations: [PlayerPdfComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatMenuModule,
    MatButtonModule,
    MatSliderModule,
    MatToolbarModule,
    ReactiveFormsModule,
    BtnFullscreenModule,
    MatInputModule,
    TranslateModule.forChild(),
  ],
  exports: [PlayerPdfComponent],
  entryComponents: [PlayerPdfComponent],
})
export class PlayerPdfModule { }
