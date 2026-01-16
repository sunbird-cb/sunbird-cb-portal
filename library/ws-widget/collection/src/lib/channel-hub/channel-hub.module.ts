import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { ChannelHubComponent } from './channel-hub.component'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatIconModule } from '@angular/material/icon'

@NgModule({
    declarations: [ChannelHubComponent],
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatIconModule,
    ]
})
export class ChannelHubModule { }
