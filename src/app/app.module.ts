import { FullscreenOverlayContainer, OverlayContainer } from '@angular/cdk/overlay'
import { APP_BASE_HREF, PlatformLocation } from '@angular/common'
import { HttpClient, HttpClientJsonpModule, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { APP_INITIALIZER, Injectable, NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import {
  GestureConfig,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatIconModule,
  MatMenuModule,
  MatProgressBarModule,
  MatRippleModule,
  MatSliderModule,
  MatToolbarModule,
  MatTooltipModule,
  MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatInputModule,
  MatFormFieldModule,
  MatCheckboxModule,
  MatTabsModule,
  MatSelectModule,
  MatTableModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
} from '@angular/material'
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {
  BtnFeatureModule, ErrorResolverModule, TourModule, WIDGET_REGISTERED_MODULES, WIDGET_REGISTRATION_CONFIG, PipeContentRoutePipe,
  StickyHeaderModule,
} from '@sunbird-cb/collection'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { SbUiResolverModule } from '@sunbird-cb/resolver-v2'
import { LoggerService, PipeSafeSanitizerModule, ConfigurationsService, PipeOrderByModule, NPSGridService } from '@sunbird-cb/utils-v2'
import { SearchModule } from '@ws/app/src/public-api'
import 'hammerjs'
import { KeycloakAngularModule } from 'keycloak-angular'
import { AppRoutingModule } from './app-routing.module'
import { InitService } from './services/init.service'
import { GlobalErrorHandlingService } from './services/global-error-handling.service'
import { AppTocResolverService } from '@ws/app/src/lib/routes/app-toc/resolvers/app-toc-resolver.service'

import { RootComponent } from './component/root/root.component'
import { LoginComponent } from './component/login/login.component'
import { AppFooterComponent } from './component/app-footer/app-footer.component'
import { AppPublicNavBarComponent } from './component/app-public-nav-bar/app-public-nav-bar.component'
import { DialogConfirmComponent } from './component/dialog-confirm/dialog-confirm.component'
import { InvalidUserComponent } from './component/invalid-user/invalid-user.component'
import { LoginRootComponent } from './component/login-root/login-root.component'
import { LoginRootDirective } from './component/login-root/login-root.directive'
import { TncRendererComponent } from './component/tnc-renderer/tnc-renderer.component'
import { MobileAppModule } from './routes/public/mobile-app/mobile-app.module'
import { PublicAboutModule } from './routes/public/public-about/public-about.module'
import { PublicContactModule } from './routes/public/public-contact/public-contact.module'
import { TncComponent } from './routes/tnc/tnc.component'
import { AppInterceptorService } from './services/app-interceptor.service'
import { AppRetryInterceptorService } from './services/app-retry-interceptor.service'
import { TncAppResolverService } from './services/tnc-app-resolver.service'
import { TncPublicResolverService } from './services/tnc-public-resolver.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ConfigService } from '@ws/app/src/lib/routes/discuss/services/config.service'
import { DiscussionUiModule } from '@sunbird-cb/discussions-ui-v8'
import { ServiceWorkerModule } from '@angular/service-worker'
import { environment } from 'src/environments/environment'
import { QuickTourModule } from '@ws/app/src/lib/routes/info/quick-tour/quick-tour.module'
import { AppIntroComponent } from './component/app-intro/app-intro.component'
import { NoConnectionComponent } from './component/no-connection/no-connection.component'
import { PublicLogoutModule } from './routes/public/public-logout/public-logout.module'
import { PublicSignupModule } from './routes/public/public-signup/public-signup.module'
import { PublicHomeComponent } from './routes/public/public-home/public-home.component'
import { PublicContacthomeComponent } from './routes/public/public-contacthome/public-contacthome.component'
import { PublicLoginWComponent } from './routes/public/public-login-w/public-login-w.component'
import { PublicLoginWGComponent } from './routes/public/public-login-wg/public-login-wg.component'
import { PublicWelcomeModule } from './routes/public/welcome/public-welcome.module'
import { WelcomeUserResolverService } from './services/welcome-user-resolver.service'
import { PublicTocModule } from './routes/public/public-toc/public-toc.module'
import { PublicRequestModule } from './routes/public/public-request/public-request.module'
import { AppTourComponent } from './component/app-tour/app-tour.component'
import { GuidedTourModule, GuidedTourService } from 'cb-tour-guide'
import { AppTourVideoComponent } from './component/app-tour-video/app-tour-video.component'
import { AppChatbotModule } from './component/app-chatbot/app-chatbot.module'
import { AppHierarchyResolverService } from './services/app-hierarchy-resolver.service'
import { AppEnrollmentResolverService } from './services/app-enrollment-resolver.service'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { AppContentResolverService } from './services/app-content-read-resolver.service'

import { HeaderModule } from './header/header.module'
import { DialogBoxComponent } from './component/dialog-box/dialog-box.component'
import { SocialLinkComponent } from './component/social-link/social-link.component'
import { FooterSectionComponent } from './component/app-footer/footer-section/footer-section.component'
import { AppLogoComponent } from './component/app-logo/app-logo.component'
import { ProfileV3Module } from '@ws/app/src/lib/routes/profile-v3/profile-v3.module'
import { NoDataComponent } from './component/no-data/no-data.component'
import { SurveyShikshaComponent } from './component/survey-shiksha/survey-shiksha.component'
import {
WIDGET_REGISTERED_LIB_MODULES, WIDGET_REGISTRATION_LIB_CONFIG,
} from '@sunbird-cb/consumption'
import { PrivacyPolicyComponent } from './component/privacy-policy/privacy-policy.component'
import { LearnerAdvisoryComponent } from './learner-advisory/learner-advisory.component'

@Injectable()
export class HammerConfig extends GestureConfig {
  buildHammer(element: HTMLElement) {
    return new GestureConfig({ touchAction: 'pan-y' }).buildHammer(element)
  }
}
const appInitializer = (initSvc: InitService, logger: LoggerService) => async () => {
  try {
    await initSvc.init()
  } catch (error) {
    logger.error('ERROR DURING APP INITIALIZATION >', error)
  }
}

const getBaseHref = (platformLocation: PlatformLocation): string => {
  return platformLocation.getBaseHrefFromDOM()
}

// tslint:disable-next-line:function-name
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http)
}

// tslint:disable-next-line: max-classes-per-file
@NgModule({
  declarations: [
    RootComponent,
    LoginComponent,
    // AppNavBarComponent,
    AppPublicNavBarComponent,
    NoDataComponent,
    TncComponent,
    AppIntroComponent,
    TncRendererComponent,
    AppFooterComponent,
    InvalidUserComponent,
    DialogConfirmComponent,
    LoginRootComponent,
    LoginRootDirective,
    NoConnectionComponent,
    PublicHomeComponent,
    PublicContacthomeComponent,
    PublicLoginWComponent,
    PublicLoginWGComponent,
    AppTourVideoComponent,
    AppTourComponent,
    DialogBoxComponent,
    SocialLinkComponent,
    FooterSectionComponent,
    AppLogoComponent,
    SurveyShikshaComponent,
    PrivacyPolicyComponent,
    LearnerAdvisoryComponent,
  ],
  imports: [
    FormsModule,
    MatCheckboxModule,
    QuickTourModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserModule,
    BrowserAnimationsModule,
    KeycloakAngularModule,
    AppRoutingModule,
    ...WIDGET_REGISTERED_MODULES,
    ...WIDGET_REGISTERED_LIB_MODULES,
    WidgetResolverModule.forRoot([...WIDGET_REGISTRATION_CONFIG, ...WIDGET_REGISTRATION_LIB_CONFIG]),
    SbUiResolverModule.forRoot([...WIDGET_REGISTRATION_LIB_CONFIG]),
    StickyHeaderModule,
    ErrorResolverModule,
    // Material Imports
    MatSliderModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatRippleModule,
    MatDialogModule,
    MatInputModule,
    MatTooltipModule,
    MatTableModule,
    MatProgressSpinnerModule,
    SearchModule,
    BtnFeatureModule,
    PipeOrderByModule,
    PublicAboutModule,
    PublicContactModule,
    PublicLogoutModule,
    PublicSignupModule,
    PublicRequestModule,
    PublicWelcomeModule,
    PublicTocModule,
    MobileAppModule,
    PipeSafeSanitizerModule,
    TourModule,
    MatTabsModule,
    GuidedTourModule,
    AppChatbotModule,
    DiscussionUiModule.forRoot(ConfigService),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HeaderModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ProfileV3Module,
    MatSidenavModule,
  ],
  exports: [
    TncComponent,
    HeaderModule,
    TranslateModule,
  ],
  bootstrap: [RootComponent],
  entryComponents: [
    DialogConfirmComponent,
    LoginComponent,
    AppIntroComponent,
    DialogBoxComponent,
  ],
  providers: [
    {
      deps: [InitService, LoggerService],
      multi: true,
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 5000 },
    },
    {
      provide: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS,
      useValue: {
        diameter: 55,
        strokeWidth: 4,
      },
    },
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AppRetryInterceptorService, multi: true },
    TncAppResolverService,
    TncPublicResolverService,
    WelcomeUserResolverService,
    ConfigurationsService,
    PipeContentRoutePipe,
    AppTocResolverService,
    AppHierarchyResolverService,
    AppContentResolverService,
    AppEnrollmentResolverService,
    NPSGridService,
    HttpClient,
    {
      provide: APP_BASE_HREF,
      useFactory: getBaseHref,
      deps: [PlatformLocation],
    },
    {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient],
    },
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer },
    { provide: HAMMER_GESTURE_CONFIG, useClass: HammerConfig },
    { provide: ErrorHandler, useClass: GlobalErrorHandlingService },
    { provide: 'environment', useValue: environment },
    GuidedTourService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
