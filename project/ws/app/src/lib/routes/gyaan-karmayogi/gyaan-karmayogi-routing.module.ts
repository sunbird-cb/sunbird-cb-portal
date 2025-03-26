import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { GyaanKarmayogiHomeComponent } from './components/gyaan-karmayogi-home/gyaan-karmayogi-home.component'
import { GyaanResolverService } from './resolver/gyaan-resolver.service'
import { GyaanPlayerComponent } from './components/gyaan-player/gyaan-player.component'
import { GyaanKarmayogiComponent } from './gyaan-karmayogi.component'
import { ViewerResolve } from '@ws/viewer/src/lib/viewer.resolve'
import { GyaanKarmayogiViewAllComponent } from './components/gyaan-karmayogi-view-all/gyaan-karmayogi-view-all.component'
import { PageResolve } from '@sunbird-cb/utils-v2'
import { GyaanVideoComponent } from './components/players/gyaan-video/gyaan-video.component'
import { PdfComponent } from './components/players/pdf/pdf.component'
import { GyaanAudioComponent } from './components/players/gyaan-audio/gyaan-audio.component'
import { GyaanYoutubeComponent } from './components/players/gyaan-youtube/gyaan-youtube.component'

const routes: Routes = [
  {
    path: '',
    component: GyaanKarmayogiComponent,
    data: {
      key: 'tenant-admin',
    },
    resolve: {
      featureData: GyaanResolverService,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'all',
      },
      {
        path: 'all',
        component: GyaanKarmayogiHomeComponent,
        data: {
          pageId: 'all',
          module: 'Knowledge Resources',
        },
      },

      {
        path: 'view-all',
        component: GyaanKarmayogiViewAllComponent,
        data: {
          pageType: 'feature',
          pageKey: 'knowledge-resource',
          pageId: 'app/knowledge-resource',
        },
        resolve: {
          pageData: PageResolve,
        },
      },
      {
        path: 'player',
        component: GyaanPlayerComponent,
        children: [
          {
            path: 'pdf/:resourceId',
            component: PdfComponent,
            data: {
              resourceType: 'pdf',
              module: 'Learn',
              pageId: 'pdf/:resourceId',
            },
            resolve: {
              content: ViewerResolve,
            },
          },
          {
            path: 'audio/:resourceId',
            component: GyaanAudioComponent,
            data: {
              resourceType: 'audio',
              module: 'Learn',
              pageId: 'audio/:resourceId',
            },
            resolve: {
              content: ViewerResolve,
            },
          },
          {
            path: 'youtube/:resourceId',
            component: GyaanYoutubeComponent,
            data: {
              resourceType: 'youtube',
              module: 'Learn',
              pageId: 'youtube/:resourceId',
            },
            resolve: {
              content: ViewerResolve,
            },
          },
          {
            path: 'video/:resourceId',
            component: GyaanVideoComponent,
            data: {
              resourceType: 'video',
              module: 'Learn',
              pageId: 'video/:resourceId',
            },
            resolve: {
              content: ViewerResolve,
            },
          },
        ],
        data: {
          resourceType: 'pdf',
          module: 'Learn',
          pageId: 'pdf/:resourceId',
        },
        resolve: {
          content: ViewerResolve,
        },
      },
    ],
},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GyaanKarmayogiRoutingModule { }
