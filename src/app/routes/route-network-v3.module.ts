import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NetworkV3Module } from '@ws/app'

@NgModule({
  imports: [CommonModule, NetworkV3Module],
  exports: [NetworkV3Module],
})
export class RouteNetworkV3Module {

}
