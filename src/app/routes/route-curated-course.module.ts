import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CuratedCoursesModule } from '@ws/app'

@NgModule({
  imports: [CommonModule, CuratedCoursesModule],
  exports: [CuratedCoursesModule],
})
export class RouteCuratedCourseModule {

}
