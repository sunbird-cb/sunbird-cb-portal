import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PlayerVideoComponent } from './player-video.component'
import { PipePublicURLModule } from '@sunbird-cb/utils-v2'
import { MatIconModule } from '@angular/material/icon'
import { TranslateModule } from '@ngx-translate/core'
@NgModule({
    declarations: [PlayerVideoComponent],
    imports: [
        CommonModule,
        PipePublicURLModule,
        MatIconModule,
        TranslateModule,
    ],
    exports: [PlayerVideoComponent]
})
export class PlayerVideoModule { }
