import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { MandatoryCourseComponent } from './routes/mandatory-course/mandatory-course.component'
import { MandatoryCourseResolverService } from './resolvers/mandatory-course-resolver.service'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'mandatory-course',
  },
  {
    path: 'mandatory-course',
    component: MandatoryCourseComponent,
    data: {
      pageId: 'mandatory-course',
      module: 'learn',
    },
    resolve: {
        enrollmentList: MandatoryCourseResolverService,
    },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MandatoryCourseRoutingModule { }
