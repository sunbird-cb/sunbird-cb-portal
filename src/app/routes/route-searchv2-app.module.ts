import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Searchv2Module } from '@ws/app'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    Searchv2Module,
  ],
  exports: [
    Searchv2Module,
  ],
})
export class RouteSearchV2AppModule { }
