import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PlayerYoutubeComponent } from './player-youtube.component'
import { YouTubePlayerModule } from '@angular/youtube-player'

@NgModule({
  declarations: [PlayerYoutubeComponent],
  imports: [
    CommonModule, YouTubePlayerModule,
  ],
  entryComponents: [PlayerYoutubeComponent],
})
export class PlayerYoutubeModule { }
