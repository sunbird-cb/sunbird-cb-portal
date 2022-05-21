import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MandatoryCourseComponent } from './routes/mandatory-course/mandatory-course.component'
import { MandatoryCourseRoutingModule } from './manadatory-course-routing.module'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { WidgetResolverModule } from '@sunbird-cb/resolver/src/public-api'
import { RouterModule } from '@angular/router'
import { BtnPageBackModule, CardContentModule } from '@sunbird-cb/collection/src/public-api'
import { MatCardModule } from '@angular/material'
import { MandatoryCourseStatsComponent } from './components/mandatory-course-stats/mandatory-course-stats.component'

@NgModule({
  declarations: [MandatoryCourseComponent, MandatoryCourseStatsComponent],
  imports: [
    CommonModule,
    MandatoryCourseRoutingModule,
    WidgetResolverModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    BtnPageBackModule,
    CardContentModule,
    MatCardModule,
  ],
})
export class MandatoryCourseModule { }
