import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MDOChannelsModule } from '@ws/app'

@NgModule({
  imports: [CommonModule, MDOChannelsModule],
  exports: [MDOChannelsModule],
})
export class RouteMdoChannelsModule { }
