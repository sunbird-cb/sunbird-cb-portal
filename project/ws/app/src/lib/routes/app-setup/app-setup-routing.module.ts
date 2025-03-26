import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AppSetupHomeComponent } from './app-setup-home.component'
import { HomeComponent } from '../app-setup/components/home/home.component'
import { LangSelectComponent } from './components/lang-select/lang-select.component'
import { AboutVideoComponent } from '../info/about-video/about-video.component'
import { TncAppResolverService } from '../../../../../../../src/app/services/tnc-app-resolver.service'
import { TncComponent } from './components/tnc/tnc.component'
import { PageResolve } from '@sunbird-cb/utils-v2'
import { InterestComponent } from './module/interest/interest/interest.component'
// import { ProfileResolverService } from './resolvers/profile-resolver.service'

const routes: Routes = []

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AppSetupHomeComponent,
        children: routes,
      },
      {
        path: 'home',
        component: HomeComponent,
        children: [{
          path: '',
          redirectTo: 'lang',
          pathMatch: 'full',
          resolve: {
            // configData: ConfigResolveService,
            // profileData: ProfileResolverService,
          },
        }, {
          path: 'lang',
          component: LangSelectComponent,
          resolve: {
            // configData: ConfigurationsService,
            // profileData: ProfileResolverService,
          },
        }, {
          path: 'tnc',
          component: TncComponent,
          resolve: {
            tnc: TncAppResolverService,
            // configData: ConfigurationsService,
            // profileData: ProfileResolverService,
          },
        }, {
          path: 'about-video',
          component: AboutVideoComponent,
          resolve: {
            // configData: ConfigurationsService,
            // profileData: ProfileResolverService,
          },
        }, {
          path: 'interest',
          component: InterestComponent,
          data: {
            pageType: 'feature',
            pageKey: 'interest',
          },
          resolve: {
            pageData: PageResolve,
            // configData: ConfigurationsService,
            // profileData: ProfileResolverService,
          },
        }],

      },
    ]),
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppSetupRoutingModule { }
