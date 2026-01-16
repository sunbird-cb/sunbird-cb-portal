import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PlayerAudioComponent } from './player-audio.component'
import { MatIconModule } from '@angular/material/icon'
import { TranslateModule } from '@ngx-translate/core'
@NgModule({
    declarations: [PlayerAudioComponent],
    imports: [CommonModule, MatIconModule, TranslateModule],
    exports: [PlayerAudioComponent]
})
export class PlayerAudioModule {}
