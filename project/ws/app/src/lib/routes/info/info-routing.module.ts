import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PageResolve } from '@sunbird-cb/utils'
import { AboutHomeComponent } from './about/components/about-home.component'
import { ContactHomeComponent } from './contact/components/contact-home.component'
import { QuickTourComponent } from './quick-tour/quick-tour.component'
import { AboutVideoComponent } from './about-video/about-video.component'
import { FeedbackComponent } from './micro-survey/components/feedback.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'about',
  },

  {
    path: 'about',
    component: AboutHomeComponent,
    data: {
      pageType: 'feature',
      pageKey: 'about',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'contact',
    component: ContactHomeComponent,

  },
  // {
  //   path: 'faq',
  //   component: FaqHomeComponent,
  //   data: {
  //     pageType: 'feature',
  //     pageKey: 'faq',
  //   },
  //   resolve: {
  //     pageData: PageResolve,
  //   },
  // },
  {
    path: 'tour',
    component: QuickTourComponent,
  },
  {
    path: 'about-us-video',
    component: AboutVideoComponent,
  },
  {
    path: 'feedback',
    component: FeedbackComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoRoutingModule { }
