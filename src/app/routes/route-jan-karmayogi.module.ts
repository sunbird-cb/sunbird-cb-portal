import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { JanKarmayogiModule } from '@ws/app/src/lib/routes/jan-karmayogi/jan-karmayogi.module'

@NgModule({
  imports: [
    CommonModule, JanKarmayogiModule],
  exports: [JanKarmayogiModule],
})
export class RouteJanKarmayogiModule { }
