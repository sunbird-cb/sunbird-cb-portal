import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PlayerVideoComponent } from './player-video.component'
import { PipePublicURLModule } from '@sunbird-cb/utils/src/public-api'

@NgModule({
  declarations: [PlayerVideoComponent],
  imports: [
    CommonModule,
    PipePublicURLModule,
  ],
  exports: [PlayerVideoComponent],
  entryComponents: [PlayerVideoComponent],
})
export class PlayerVideoModule { }
