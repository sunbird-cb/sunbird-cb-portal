import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GyaanKarmayogiModule } from '@ws/app/src/lib/routes/gyaan-karmayogi/gyaan-karmayogi.module'

@NgModule({
  imports: [
    CommonModule, GyaanKarmayogiModule],
  exports: [GyaanKarmayogiModule],
})
export class RouteGyaanKarmayogiModule { }
