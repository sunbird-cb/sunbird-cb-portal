import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MandatoryCourseModule } from '@ws/app'

@NgModule({
  imports: [CommonModule, MandatoryCourseModule],
  exports: [MandatoryCourseModule],
})
export class RouteMandatoryCourseModule {

}
