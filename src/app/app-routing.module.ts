import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ErrorResolverComponent, PageComponent, PageModule } from '@sunbird-cb/collection'
import { ExploreDetailResolve, PageResolve, PageNameResolve } from '@sunbird-cb/utils'
import { LearningGuard } from '../../project/ws/app/src/lib/routes/my-learning/guards/my-learning.guard'
import { InvalidUserComponent } from './component/invalid-user/invalid-user.component'
import { LoginRootComponent } from './component/login-root/login-root.component'
import { ETopBar } from './constants/topBar.constants'
import { EmptyRouteGuard } from './guards/empty-route.guard'
import { ExternalUrlResolverService } from './guards/external-url-resolver.service'
import { GeneralGuard } from './guards/general.guard'
import { LoginGuard } from './guards/login.guard'
import { FeaturesComponent } from './routes/features/features.component'
import { FeaturesModule } from './routes/features/features.module'
import { MobileAppHomeComponent } from './routes/public/mobile-app/components/mobile-app-home.component'
import { PublicAboutComponent } from './routes/public/public-about/public-about.component'
import { PublicContactComponent } from './routes/public/public-contact/public-contact.component'
import { TncComponent } from './routes/tnc/tnc.component'
import { TncAppResolverService } from './services/tnc-app-resolver.service'
import { TncPublicResolverService } from './services/tnc-public-resolver.service'
import { AppTocResolverService } from '@ws/app/src/lib/routes/app-toc/resolvers/app-toc-resolver.service'
import { PublicLogoutComponent } from './routes/public/public-logout/public-logout.component'
import { PublicSignupComponent } from './routes/public/public-signup/public-signup.component'
import { PublicHomeComponent } from './routes/public/public-home/public-home.component'
import { PublicContacthomeComponent } from './routes/public/public-contacthome/public-contacthome.component'
import { PublicLoginWComponent } from './routes/public/public-login-w/public-login-w.component'
import { PublicWelcomeComponent } from './routes/public/welcome/public-welcome.component'
import { PublicLoginWGComponent } from './routes/public/public-login-wg/public-login-wg.component'
import { WelcomeUserResolverService } from './services/welcome-user-resolver.service'
import { PublicTocComponent } from './routes/public/public-toc/public-toc.component'
import { AppPublicTocResolverService } from './routes/public/public-toc/app-public-toc-resolver.service'

// 💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥
// Please declare routes in alphabetical order
// 😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵

const routes: Routes = [
  {
    path: '',
    redirectTo: 'page/home',
    pathMatch: 'full',
    canActivate: [EmptyRouteGuard],
    data: {
      pageType: 'feature',
      pageKey: 'home',
      pageId: 'page/home',
      module: 'home',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  // {
  //   path: 'practice/behavioral',
  //   pathMatch: 'full',
  //   redirectTo: 'page/embed-behavioural-skills',
  //   canActivate: [GeneralGuard],
  //   data: {
  //   },
  // },
  {
    path: 'app/activities',
    loadChildren: () => import('./routes/route-activities.module').then(u => u.RouteActivitiesModule),
    canActivate: [GeneralGuard],
    data: {
      pageId: 'app/activities',
      module: 'Profile',
    },
  },
  {
    path: 'app/frac',
    loadChildren: () => import('./routes/route-frac.module').then(u => u.RouteFracModule),
    canActivate: [GeneralGuard],
    data: {
      pageId: 'app/frac',
      module: 'Frac',
    },
  },
  // {
  //   path: 'admin',
  //   data: {
  //     requiredRoles: ['register-admin', 'admin', 'content-assignment-admin'],
  //   },
  //   loadChildren: () => import('./routes/route-admin.module').then(u => u.RouteAdminModule),
  //   canActivate: [GeneralGuard],
  // },
  {
    path: 'app/careers',
    loadChildren: () =>
      import('./routes/route-careers.module').then(u => u.RouteCareerHubModule),
    canActivate: [GeneralGuard],
    data: {
      pageType: 'feature',
      pageKey: 'career',
      pageId: 'app/careers',
      module: 'careers',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  // {
  //   path: 'app/channels',
  //   loadChildren: () => import('./routes/route-channels.module').then(u => u.RouteChannelsModule),
  //   canActivate: [GeneralGuard],
  // },
  {
    path: 'app/competencies',
    loadChildren: () =>
      import('./routes/route-competencie.module').then(u => u.RouteCompetenciesModule),
    canActivate: [GeneralGuard],
    data: {
      pageType: 'feature',
      pageKey: 'competencie',
      pageId: 'app/competencies',
      module: 'competency',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'app/content-assignment',
    loadChildren: () =>
      import('./routes/route-content-assignment.module').then(u => u.RouteContentAssignmentModule),
    canActivate: [GeneralGuard],
    data: {
      pageId: 'app/content-assignment',
      module: 'Learn',
    },
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./routes/route-discuss.module').then(u => u.RouteDiscussModule),
    canActivate: [GeneralGuard],
    data: {
      pageType: 'feature',
      pageKey: 'discuss',
      pageId: 'app',
      module: 'Discuss',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'app/knowledge-resource',
    loadChildren: () =>
      import('./routes/route-knowledge-resource.module').then(u => u.RouteKnowledgeResourceModule),
    canActivate: [GeneralGuard],
    data: {
      pageType: 'feature',
      pageKey: 'knowledge-resource',
      pageId: 'app/knowledge-resource',
      module: 'knowledge-resource',
    },
    resolve: {
      pageData: PageResolve,
    },
  },

  {
    path: 'app/taxonomy',
    loadChildren: () =>
      import('./routes/route-taxonomy.module').then(u => u.RouteTaxonomyModule),
    canActivate: [GeneralGuard],
    data: {
      pageType: 'feature',
      pageKey: 'taxonomy',
      pageId: 'app/taxonomy',
      module: 'explore',
    },
    resolve: {
      pageData: PageResolve,
    },
    // path: 'certs',
    // loadChildren: () => import('./routes/route-cert.module').then(u => u.RouteCertificateModule),
  },
  {
    path: 'app/learn/browse-by/competency',
    loadChildren: () =>
      import('./routes/route-browse-competency.module').then(u => u.RouteBrowseCompetencyModule),
    canActivate: [GeneralGuard],
    data: {
      // pageType: 'feature',
      // pageKey: 'browse by competency',
      pageId: 'app/learn/browse-by/competency',
      module: 'explore',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'app/learn/browse-by/provider',
    loadChildren: () =>
      import('./routes/route-browse-provider.module').then(u => u.RouteBrowseProviderModule),
    canActivate: [GeneralGuard],
    data: {
      // pageType: 'feature',
      // pageKey: 'browse by competency',
      pageId: 'app/learn/browse-by/provider',
      module: 'explore',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'app/learn/mandatory-course',
    loadChildren: () =>
      import('./routes/route-mandatory-course.module').then(u => u.RouteMandatoryCourseModule),
    canActivate: [GeneralGuard],
    data: {
      pageType: 'feature',
      pageKey: 'mandatory-course',
      pageId: 'app/learn/mandatory-course',
      module: 'learn',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'app/discussion-forum',
    pathMatch: 'full',
    redirectTo: 'app/discussion',
    data: {
      pageId: 'app/discussion-forum',
      module: 'Discuss',
    },

  },
  {
    path: 'certs',
    data: {
      pageId: 'certs',
      module: 'Profile',
    },
    loadChildren: () => import('./routes/route-cert.module').then(u => u.RouteCertificateModule),
  },
  // {
  //   path: 'app/gamification',
  //   loadChildren: () =>
  //     import('./routes/route-gamification.module').then(u => u.RouteGamificationModule),
  //   canActivate: [GeneralGuard],
  //   data: {
  //   },
  // },
  // {
  //   path: 'app/setup',
  //   loadChildren: () => import('./routes/route-app-setup.module').then(u => u.RouteAppSetupModule),
  //   data: {
  //   },
  // },
  {
    path: 'app/setup',
    loadChildren: () =>
      import('./routes/route-profile-v3.module').then(u => u.RouteProfileV3Module),
    // canActivate: [GeneralGuard],
    data: {
      pageType: 'feature',
      pageKey: 'profile-v3',
      pageId: 'app/profile-v3',
      module: 'profile-v3',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'app/feedback',
    loadChildren: () =>
      import('./routes/route-feedback-v2.module').then(u => u.RouteFeedbackV2Module),
    canActivate: [GeneralGuard],
    data: {
      pageId: 'app/feedback',
      module: 'Settings',
    },
  },
  {
    path: 'app/features',
    component: FeaturesComponent,
    canActivate: [GeneralGuard],
    data: {
      pageId: 'app/features',
      module: 'Settings',
    },
  },

  {
    path: 'app/goals',
    loadChildren: () => import('./routes/route-goals-app.module').then(u => u.RouteGoalsAppModule),
    canActivate: [GeneralGuard],
    data: {
      pageId: 'app/Goals',
      module: 'Profile',
    },
  },
  {
    path: 'app/info',
    loadChildren: () => import('./routes/route-info-app.module').then(u => u.RouteInfoAppModule),
    canActivate: [GeneralGuard],
    data: {
      pageId: 'app/info',
      module: 'Settings',
    },
  },
  {
    path: 'app/invalid-user',
    component: InvalidUserComponent,
    data: {
      pageType: 'feature',
      pageKey: 'invalid-user',
      pageId: 'app/invalid-user',
      module: 'Error',
    },
    resolve: {
      pageData: PageResolve,
    },
  },

  {
    path: 'app/my-learning',
    loadChildren: () =>
      import('./routes/route-my-learning.module').then(u => u.RouteMyLearningModule),
    canActivate: [GeneralGuard, LearningGuard],
    data: {
      pageId: 'app/my-learning',
      module: 'Profile',
    },
  },
  {
    path: 'app/my-dashboard',
    loadChildren: () =>
      import('./routes/route-my-dashboard.module').then(u => u.RouteMyDashboardModule),
    canActivate: [GeneralGuard, LearningGuard],
    data: {
      pageId: 'app/my-dashboard',
      module: 'dashboard',
    },
  },
  {
    path: 'app/my-rewards',
    loadChildren: () =>
      import('./routes/route-my-rewards.module').then(u => u.RouteMyRewarddModule),
    canActivate: [GeneralGuard, LearningGuard],
    data: {
      pageId: 'app/my-rewards',
      module: 'Profile',
    },
  },
  {
    path: 'app/network-v2',
    loadChildren: () =>
      import('./routes/route-network-v2.module').then(u => u.RouteNetworkV2Module),
    canActivate: [GeneralGuard],
    data: {
      pageType: 'feature',
      pageKey: 'network-v2',
      pageId: 'app/network-v2',
      module: 'newtwork',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'app/notifications',
    loadChildren: () =>
      import('./routes/route-notification-app.module').then(u => u.RouteNotificationAppModule),
    canActivate: [GeneralGuard],
    data: {
      pageId: 'app/notifications',
      module: 'Settings',
    },
  },
  {
    path: 'app/playlist',
    loadChildren: () =>
      import('./routes/route-playlist-app.module').then(u => u.RoutePlaylistAppModule),
    canActivate: [GeneralGuard],
    data: {
    },
  },
  {
    path: 'app/profile',
    loadChildren: () =>
      import('./routes/route-profile-app.module').then(u => u.RouteProfileAppModule),
    canActivate: [GeneralGuard],
    data: {
      pageId: 'app/profile',
      module: 'profile',
    },
  },
  {
    path: 'app/person-profile',
    loadChildren: () =>
      import('./routes/route-profile-v2.module').then(u => u.RouteProfileV2Module),
    canActivate: [GeneralGuard],
    data: {
      pageType: 'feature',
      pageKey: 'profile-v2',
      pageId: 'app/person-profile',
      module: 'profile',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'app/person-profile2',
    loadChildren: () =>
      import('./routes/route-person-profile.module').then(u => u.RoutePersonProfileModule),
    canActivate: [GeneralGuard],
    data: {
      pageId: 'app/person-profile',
      module: 'profile',
    },
  },
  // {
  //   path: 'app/events',
  //   loadChildren: () => import('./routes/route-app-event.module').then(m => m.AppEventsModule),
  //   canActivate: [GeneralGuard],
  // },
  {
    path: 'app/event-hub',
    loadChildren: () => import('./routes/route-events.module').then(u => u.RouteEventsModule),
    canActivate: [GeneralGuard],
    data: {
      pageType: 'feature',
      pageKey: 'event',
      pageId: 'app/event-hub',
      module: 'events',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'app/search',
    loadChildren: () =>
      import('./routes/route-search-app.module').then(u => u.RouteSearchAppModule),
    data: {
      pageType: 'feature',
      pageKey: 'search',
      pageId: 'app/search',
      module: 'search',
    },
    resolve: {
      searchPageData: PageResolve,
    },
    canActivate: [GeneralGuard],
  },
  {
    path: 'app/globalsearch',
    loadChildren: () =>
      import('./routes/route-searchv2-app.module').then(u => u.RouteSearchV2AppModule),
    data: {
      pageType: 'feature',
      pageKey: 'globalsearch',
      pageId: 'app/globalsearch',
      module: 'search',
    },
  },
  {
    path: 'app/social',
    data: {
      pageId: 'app/social',
      module: 'social',
    },
    loadChildren: () =>
      import('./routes/route-social-app.module').then(u => u.RouteSocialAppModule),
    canActivate: [GeneralGuard],
  },
  {
    path: 'app/signup',
    data: {
      pageId: 'app/signup',
      module: 'signup',
    },
    loadChildren: () =>
      import('./routes/signup/signup.module').then(u => u.SignupModule),
  },
  {
    path: 'app/auto-signup/:id',
    loadChildren: () =>
      import('./routes/signup-auto/signup-auto.module').then(u => u.SignupAutoModule),
    data: {
    },
  },
  {
    path: 'app/toc',
    loadChildren: () => import('./routes/route-app-toc.module').then(u => u.RouteAppTocModule),
    canActivate: [GeneralGuard],
    data: {
      pageId: 'app/toc',
      module: 'Learn',
    },
  },
  {
    path: 'author/toc',
    loadChildren: () => import('./routes/route-app-toc.module').then(u => u.RouteAppTocModule),
    canActivate: [GeneralGuard],
    data: {
    },
  },
  {
    path: 'app/tnc',
    component: TncComponent,
    resolve: {
      tnc: TncAppResolverService,
      pageId: 'app/tnc',
      module: 'tnc',
    },
    data: {
    },
  },
  {
    path: 'app/user-profile',
    data: {
      pageId: 'app/user-profile',
      module: 'Profile',
    },
    loadChildren: () =>
      import('./routes/route-user-profile-app.module').then(u => u.RouteUserProfileAppModule),
  },
  // {
  //   path: 'author',
  //   data: {
  //     requiredRoles: [
  //       // 'content-creator',
  //       // 'ka-creator',
  //       // 'kb-creator',
  //       // 'channel-creator',
  //       // 'reviewer',
  //       // 'publisher',
  //       // 'editor',
  //       // 'admin',
  //     ],
  //   },
  //   canActivate: [GeneralGuard],
  //   loadChildren: () =>
  //     import('./routes/route-authoring-app.module').then(u => u.AuthoringAppModule),
  // },
  {
    path: 'error-access-forbidden',
    component: ErrorResolverComponent,
    data: {
      errorType: 'accessForbidden',
      pageId: 'error-access-forbidden',
      module: 'Error',
    },
  },
  {
    path: 'error-content-unavailable',
    component: ErrorResolverComponent,
    data: {
      errorType: 'contentUnavailable',
      pageId: 'error-content-unavailable',
      module: 'Error',
    },
  },
  {
    path: 'error-feature-disabled',
    component: ErrorResolverComponent,
    data: {
      errorType: 'featureDisabled',
      pageId: 'error-feature-disabled',
      module: 'Error',
    },
  },
  {
    path: 'error-feature-unavailable',
    component: ErrorResolverComponent,
    data: {
      errorType: 'featureUnavailable',
      pageId: 'error-feature-unavailable',
      module: 'Error',
    },
  },
  {
    path: 'error-internal-server',
    component: ErrorResolverComponent,
    data: {
      errorType: 'internalServer',
      pageId: 'error-internal-server',
      module: 'Error',
    },
  },
  {
    path: 'error-service-unavailable',
    component: ErrorResolverComponent,
    data: {
      errorType: 'serviceUnavailable',
      pageId: 'error-service-unavailable',
      module: 'Error',
    },
  },
  {
    path: 'error-somethings-wrong',
    component: ErrorResolverComponent,
    data: {
      errorType: 'somethingsWrong',
      pageId: 'error-somethings-wrong',
      module: 'Error',
    },
  },
  {
    path: 'externalRedirect',
    canActivate: [ExternalUrlResolverService],
    component: ErrorResolverComponent,
  },
  { path: 'home', redirectTo: 'page/home', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [LoginGuard],
    component: LoginRootComponent,
    data: {
      pageType: 'feature',
      pageKey: 'login',
      pageId: 'login',
      module: 'Login',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  { path: 'network', redirectTo: 'page/network', pathMatch: 'full' },
  {
    path: 'page/toc',
    redirectTo: '/',
    pathMatch: 'full',
  },
  {
    path: 'page/toc/:id',
    data: {
      pageType: 'page',
      pageKey: 'toc',
      pageId: 'page/toc/:id',
      module: 'Learn',
    },
    resolve: {
      pageData: PageResolve,
      content: AppTocResolverService,
    },
    runGuardsAndResolvers: 'paramsChange',
    component: PageComponent,
    canActivate: [GeneralGuard],
  },
  {
    path: 'page/:id',
    component: PageComponent,
    data: {
      pageType: 'page',
      pageKey: 'id',
    },
    resolve: {
      pageData: PageResolve,
      module: PageNameResolve,
      pageId: PageNameResolve,
    },
    canActivate: [GeneralGuard],
  },
  {
    path: 'page/explore/:tags',
    data: {
      pageType: 'page',
      pageKey: 'catalog-details',
      pageId: 'page/explore/:topic',
      module: 'Learn',
    },
    resolve: {
      pageData: ExploreDetailResolve,
      module: PageNameResolve,
    },
    component: PageComponent,
    canActivate: [GeneralGuard],
  },
  {
    path: 'page-leaders',
    loadChildren: () =>
      import('./routes/page-leader-renderer/page-leader-renderer.module').then(
        u => u.PageLeaderRendererModule,
      ),
    canActivate: [GeneralGuard],
  },
  {
    path: 'public/about',
    component: PublicAboutComponent,
    data: {
      pageType: 'feature',
      pageKey: 'about',
      module: 'support',
      pageId: 'public/about',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'public/contact',
    component: PublicContacthomeComponent,
    data: {
      pageType: 'feature',
      pageKey: 'public-contact',
      module: 'support',
      pageId: 'public/contact',
    },
  },
  {
    path: 'public/faq',
    component: PublicContactComponent,
    data: {
      pageType: 'feature',
      pageKey: 'public-faq',
      module: 'support',
      pageId: 'public/faq',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'public/logout',
    component: PublicLogoutComponent,
  },
  {
    path: 'public/home',
    component: PublicHomeComponent,
    data: {
      pageType: 'feature',
      pageKey: 'public-home',
      pageId: 'public/home',
      module: 'home',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'public/toc/:id/overview',
    component: PublicTocComponent,
    data: {
      pageType: 'feature',
      pageKey: 'toc',
      pageId: 'public/toc/:id',
      module: 'Learn',
    },
    resolve: {
      pageData: PageResolve,
      content: AppPublicTocResolverService,
    },
  },
  {
    path: 'public/sso',
    component: PublicLoginWComponent,
    data: {
      module: 'sso',
      pageId: 'public/sso',
    },
  },
  {
    path: 'public/google/sso',
    component: PublicLoginWGComponent,
    data: {
      module: 'Google SSO',
      pageId: 'public/google/sso',
    },
  },
  {
    path: 'public/welcome',
    component: PublicWelcomeComponent,
    data: {
      module: 'Welcome',
      pageId: 'public/welcome',
    },
    resolve: {
      userData: WelcomeUserResolverService,
    },
  },
  {
    path: 'public/google/sso',
    component: PublicLoginWComponent,
  },
  {
    path: 'public/signup',
    component: PublicSignupComponent,
    data: {
      module: 'Login',
      pageId: 'public/signup',
    },
  },
  {
    path: 'public/mobile-app',
    component: MobileAppHomeComponent,
    data: {
      pageType: 'feature',
      pageKey: 'mobile-app',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'public/tnc',
    component: TncComponent,
    data: {
      isPublic: true,
      module: 'support',
      pageId: 'public/tnc',
    },
    resolve: {
      tnc: TncPublicResolverService,
    },
  },
  {
    path: 'viewer',
    data: {
      topBar: ETopBar.NONE,
      module: 'Learn',
      pageId: 'viewer',
    },
    loadChildren: () => import('./routes/route-viewer.module').then(u => u.RouteViewerModule),
    canActivate: [GeneralGuard],
  },
  {
    path: 'author/viewer',
    loadChildren: () => import('./routes/route-viewer.module').then(u => u.RouteViewerModule),
    canActivate: [GeneralGuard],
  },
  {
    path: 'embed',
    data: {
      topBar: ETopBar.NONE,
    },
    loadChildren: () => import('./routes/route-viewer.module').then(u => u.RouteViewerModule),
    canActivate: [GeneralGuard],
  },
  {
    path: '**',
    component: ErrorResolverComponent,
    data: {
      errorType: 'notFound',
    },
  },
]
@NgModule({
  imports: [
    PageModule,
    FeaturesModule,
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'top',
      urlUpdateStrategy: 'eager',
      onSameUrlNavigation: 'reload',
      scrollOffset: [0, 80],
      // enableTracing: true,
    }),
  ],
  exports: [RouterModule],
  providers: [ExploreDetailResolve],
})
export class AppRoutingModule { }
