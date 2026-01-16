import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PlayerAmpComponent } from './player-amp.component'
import { PipePublicURLModule } from '@sunbird-cb/utils-v2'

@NgModule({
    declarations: [PlayerAmpComponent],
    imports: [
        CommonModule,
        PipePublicURLModule,
    ]
})
export class PlayerAmpModule { }
