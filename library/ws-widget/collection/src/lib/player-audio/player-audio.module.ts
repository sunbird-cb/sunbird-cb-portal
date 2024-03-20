import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PlayerAudioComponent } from './player-audio.component'
import { MatIconModule } from '@angular/material'

@NgModule({
  declarations: [PlayerAudioComponent],
  imports: [CommonModule, MatIconModule],
  entryComponents: [PlayerAudioComponent],
  exports: [PlayerAudioComponent],
})
export class PlayerAudioModule {}
