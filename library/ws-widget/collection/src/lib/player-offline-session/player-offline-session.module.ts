import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
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
import { PlayerOfflineSessionComponent } from './player-offline-session.component'

@NgModule({
  declarations: [PlayerOfflineSessionComponent],
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
  ],
  exports: [PlayerOfflineSessionComponent],
  entryComponents: [PlayerOfflineSessionComponent],
})
export class PlayerOfflineSessionModule { }
