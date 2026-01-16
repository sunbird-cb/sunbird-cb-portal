import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { PipeNameTransformModule } from '@sunbird-cb/utils-v2'
import { FormsModule } from '@angular/forms'
import { TooltipDirective } from '../../_directives/tooltip.directive'
import { AvatarPhotoModule } from '../avatar-photo/avatar-photo.module'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { ConnectionHoverCardComponent } from './connection-hover-card.component'

@NgModule({
    declarations: [ConnectionHoverCardComponent, TooltipDirective],
    imports: [
        CommonModule,
        PipeNameTransformModule,
        FormsModule,
        AvatarPhotoModule,
        MatIconModule,
        MatCardModule,
    ],
    exports: [ConnectionHoverCardComponent, TooltipDirective],
    providers: []
})
export class ConnectionHoverModule {

}
