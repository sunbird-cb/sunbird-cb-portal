import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ViewerComponent } from './viewer.component'
import { ViewerResolve } from './viewer.resolve'
import { AudioComponent } from './routes/audio/audio.component'
import { AudioModule } from './routes/audio/audio.module'
import { AudioNativeComponent } from './routes/audio-native/audio-native.component'
import { AudioNativeModule } from './routes/audio-native/audio-native.module'
import { HtmlComponent } from './routes/html/html.component'
import { HtmlModule } from './routes/html/html.module'
import { PdfComponent } from './routes/pdf/pdf.component'
import { PdfModule } from './routes/pdf/pdf.module'
import { ChannelComponent } from './routes/channel/channel.component'
import { ChannelModule } from './routes/channel/channel.module'
import { VideoComponent } from './routes/video/video.component'
import { VideoModule } from './routes/video/video.module'
import { YoutubeComponent } from './routes/youtube/youtube.component'
import { YoutubeModule } from './routes/youtube/youtube.module'
// import { ConfigurationsService } from './resolvers/config-resolver.service'
// import { ProfileResolverService } from './resolvers/profile-resolver.service'

const routes: Routes = [
  {
    path: 'audio/:resourceId',
    component: AudioComponent,
    data: {
      resourceType: 'audio',
    },
    resolve: {
      content: ViewerResolve,
      // configData: ConfigurationsService,
      // profileData: ProfileResolverService,
    },
  },
  {
    path: 'audio-native/:resourceId',
    component: AudioNativeComponent,
    data: {
      resourceType: 'audio-native',
    },
    resolve: {
      content: ViewerResolve,
      // configData: ConfigurationsService,
      // profileData: ProfileResolverService,
    },
  },
  {
    path: 'certification',
    data: {
      resourceType: 'certification',
    },
    resolve: {
      // configData: ConfigurationsService,
      // profileData: ProfileResolverService,
    },
    loadChildren: () =>
      import('./routes/certification/certification.module').then(u => u.CertificationModule),
  },
  {
    path: 'class-diagram',
    data: {
      resourceType: 'class-diagram',
    },
    resolve: {
      // configData: ConfigurationsService,
      // profileData: ProfileResolverService,
    },
    loadChildren: () =>
      import('./routes/class-diagram/class-diagram.module').then(u => u.ClassDiagramModule),
  },
  {
    path: 'dnd-quiz',
    data: {
      resourceType: 'dnd-quiz',
    },
    resolve: {
      // configData: ConfigurationsService,
      // profileData: ProfileResolverService,
    },
    loadChildren: () =>
      import('./routes/dnd-quiz/dnd-quiz.module').then(u => u.DndQuizModule),
  },
  {
    path: 'hands-on',
    data: {
      resourceType: 'hands-on',
    },
    resolve: {
      // configData: ConfigurationsService,
      // profileData: ProfileResolverService,
    },
    loadChildren: () =>
      import('./routes/hands-on/hands-on.module').then(u => u.HandsOnModule),
  },
  {
    path: 'html/:resourceId',
    component: HtmlComponent,
    data: {
      resourceType: 'html',
    },
    resolve: {
      content: ViewerResolve,
      // configData: ConfigurationsService,
      // profileData: ProfileResolverService,
    },
  },
  {
    path: 'html-picker',
    data: {
      resourceType: 'html-picker',
    },
    loadChildren: () =>
      import('./routes/html-picker/html-picker.module').then(u => u.HtmlPickerModule),
  },
  {
    path: 'channel/:resourceId',
    data: {
      resourceType: 'channel',
    },
    resolve: {
      content: ViewerResolve,
      // configData: ConfigurationsService,
      // profileData: ProfileResolverService,
    },
    component: ChannelComponent,
  },
  {
    path: 'iap',
    data: {
      resourceType: 'iap',
    },
    resolve: {
      content: ViewerResolve,
      // configData: ConfigurationsService,
      // profileData: ProfileResolverService,
    },
    loadChildren: () =>
      import('./routes/iap/iap.module').then(u => u.IapModule),
  },
  {
    path: 'interactive-exercise',
    data: {
      resourceType: 'interactive-exercise',
    },
    resolve: {
      content: ViewerResolve,
      // configData: ConfigurationsService,
      // profileData: ProfileResolverService,
    },
    loadChildren: () =>
      import('./routes/interactive-exercise/interactive-exercise.module').then(u => u.InteractiveExerciseModule),
  },
  {
    path: 'pdf/:resourceId',
    component: PdfComponent,
    data: {
      resourceType: 'pdf',
    },
    resolve: {
      content: ViewerResolve,
      // configData: ConfigurationsService,
      // profileData: ProfileResolverService,
    },
  },
  {
    path: 'quiz',
    data: {
      resourceType: 'quiz',
    },
    resolve: {
      content: ViewerResolve,
      // configData: ConfigurationsService,
      // profileData: ProfileResolverService,
    },
    loadChildren: () =>
      import('./routes/quiz/quiz.module').then(u => u.QuizModule),
  },
  {
    path: 'assessment',
    data: {
      resourceType: 'assessment',
    },
    resolve: {
      content: ViewerResolve,
      // configData: ConfigurationsService,
      // profileData: ProfileResolverService,
    },
    loadChildren: () =>
      import('./routes/assessment/assessment.module').then(u => u.AssessmentModule),
  },
  {
    path: 'rdbms-hands-on',
    data: {
      resourceType: 'rdbms-hands-on',
    },
    resolve: {
      content: ViewerResolve,
      // configData: ConfigurationsService,
      // profileData: ProfileResolverService,
    },
    loadChildren: () =>
      import('./routes/rdbms-hands-on/rdbms-hands-on.module').then(u => u.RdbmsHandsOnModule),
  },
  {
    path: 'resource-collection',
    data: {
      resourceType: 'resource-collection',
    },
    resolve: {
      content: ViewerResolve,
      // configData: ConfigurationsService,
      // profileData: ProfileResolverService,
    },
    loadChildren: () => import('./routes/resource-collection/resource-collection.module')
      .then(u => u.ResourceCollectionModule),
  },
  {
    path: 'video/:resourceId',
    component: VideoComponent,
    data: {
      resourceType: 'video',
    },
    resolve: {
      content: ViewerResolve,
      // configData: ConfigurationsService,
      // profileData: ProfileResolverService,
    },
  },
  {
    path: 'web-module',
    data: {
      resourceType: 'web-module',
    },
    resolve: {
      content: ViewerResolve,
      // configData: ConfigurationsService,
      // profileData: ProfileResolverService,
    },
    loadChildren: () =>
      import('./routes/web-module/web-module.module').then(u => u.WebModuleModule),
  },
  {
    path: 'youtube/:resourceId',
    component: YoutubeComponent,
    data: {
      resourceType: 'youtube',
    },
    resolve: {
      content: ViewerResolve,
      // configData: ConfigurationsService,
      // profileData: ProfileResolverService,
    },
  },
  {
    path: ':resourceId',
    component: ViewerComponent,
    data: {
      resourceType: 'unknown',
    },
    resolve: {
      content: ViewerResolve,
      // configData: ConfigurationsService,
      // profileData: ProfileResolverService,
    },
  },
  {
    path: '**',
    data: {
      resourceType: 'error',
    },
    resolve: {
      content: ViewerResolve,
      // configData: ConfigurationsService,
      // profileData: ProfileResolverService,
    },
  },
]

@NgModule({
  imports: [
    AudioModule,
    AudioNativeModule,
    HtmlModule,
    PdfModule,
    VideoModule,
    YoutubeModule,
    ChannelModule,
    RouterModule.forChild([
      {
        path: '',
        component: ViewerComponent,
        children: routes,
      },
    ])],
  exports: [RouterModule],
  providers: [
    ViewerResolve,
    // ConfigurationsService,
    // ProfileResolverService,
  ],
})
export class ViewerRoutingModule { }
