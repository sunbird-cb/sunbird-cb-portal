import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { ChannelComponent } from './channel.component'
import { PageModule } from '@sunbird-cb/collection'

@NgModule({
  declarations: [ChannelComponent],
  imports: [
    RouterModule,
    CommonModule,
    PageModule,
  ],
})
export class ChannelModule { }
