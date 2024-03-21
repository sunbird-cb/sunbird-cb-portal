import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PlayerAudioComponent } from './player-audio.component'
import { MatIconModule } from '@angular/material'
import { TranslateModule } from '@ngx-translate/core'
@NgModule({
  declarations: [PlayerAudioComponent],
  imports: [CommonModule, MatIconModule, TranslateModule],
  entryComponents: [PlayerAudioComponent],
  exports: [PlayerAudioComponent],
})
export class PlayerAudioModule {}
