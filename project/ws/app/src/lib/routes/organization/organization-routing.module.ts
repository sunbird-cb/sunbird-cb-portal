import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { PageResolve } from '@sunbird-cb/utils-v2'
import { OrganizationCourseDetailComponent } from './routes/organization-course-detail/organization-course-detail.component'
import { OrganizationHomeComponent } from './routes/organization-home/organization-home.component'

const routes: Routes = [
  {
    path: 'dopt',
    pathMatch: 'full',
    component: OrganizationHomeComponent,
    data: {
      pageType: 'feature',
      pageKey: 'search',
      pageId: '',
    },
    resolve: {
      searchPageData: PageResolve,
    },
  },
  {
    path: 'dopt/course/:id',
    pathMatch: 'full',
    component: OrganizationCourseDetailComponent,
    data: {
      pageType: 'feature',
      pageKey: 'search',
      pageId: '',
    },
    resolve: {
      searchPageData: PageResolve,
    },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationRoutingModule { }
