import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AppSetupHomeComponent } from './app-setup-home.component'
import { HomeComponent } from '../app-setup/components/home/home.component'
import { LangSelectComponent } from './components/lang-select/lang-select.component'
import { AboutVideoComponent } from '../info/about-video/about-video.component'
import { TncAppResolverService } from '../../../../../../../src/app/services/tnc-app-resolver.service'
import { TncComponent } from './components/tnc/tnc.component'
import { PageResolve } from '@sunbird-cb/utils'
import { InterestComponent } from './module/interest/interest/interest.component'
import { ConfigResolverService } from './resolvers/config-resolver.service'
import { ProfileResolverService } from './resolvers/profile-resolver.service'

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
            configData: ConfigResolverService,
            profileData: ProfileResolverService,
          },
        }, {
          path: 'lang',
          component: LangSelectComponent,
          resolve: {
            configData: ConfigResolverService,
            profileData: ProfileResolverService,
          },
        }, {
          path: 'tnc',
          component: TncComponent,
          resolve: {
            tnc: TncAppResolverService,
            configData: ConfigResolverService,
            profileData: ProfileResolverService,
          },
        }, {
          path: 'about-video',
          component: AboutVideoComponent,
          resolve: {
            configData: ConfigResolverService,
            profileData: ProfileResolverService,
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
            configData: ConfigResolverService,
            profileData: ProfileResolverService,
          },
        }],

      },
    ]),
  ],
  exports: [RouterModule],
})
export class AppSetupRoutingModule { }
