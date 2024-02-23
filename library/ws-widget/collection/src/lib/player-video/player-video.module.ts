import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PlayerVideoComponent } from './player-video.component'
import { PipePublicURLModule } from '@sunbird-cb/utils/src/public-api'
import { MatIconModule } from '@angular/material'
@NgModule({
  declarations: [PlayerVideoComponent],
  imports: [
    CommonModule,
    PipePublicURLModule,
    MatIconModule,
  ],
  exports: [PlayerVideoComponent],
  entryComponents: [PlayerVideoComponent],
})
export class PlayerVideoModule { }
