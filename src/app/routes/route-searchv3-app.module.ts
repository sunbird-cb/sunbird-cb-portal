import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SearchV3Module } from '../../../project/ws/app/src/lib/routes/search-v3/search-v3.module'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SearchV3Module,
  ],
  exports: [
    SearchV3Module,
  ],
})
export class RouteSearchV3AppModule { }
