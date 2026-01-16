import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ViewerResolve } from '@ws/viewer/src/lib/viewer.resolve'
// import { EventsHomeComponent } from './routes/events-home/events-home.component'
// import { EventsComponent } from './routes/events/events.component'
import { EventDetailComponent } from './routes/event-detail/event-detail.component'
import { EventRecentResolve } from './resolvers/event-resolve'
import { EventDetailResolve } from './resolvers/event-detail-resolve'
import { EventPlayerComponent } from './routes/event-player/event-player.component'
import { EventPdfPlayerComponent } from './components/event-pdf-player/event-pdf-player.component'
import { EventYouTubeComponent } from './components/event-you-tube/event-you-tube.component'
import { EventResolve } from './services/event-resolver.resolve'
import { EventsHomeV2Component } from './routes/events-home-v2/events-home-v2.component'
import { ViewAllComponent } from './routes/view-all/view-all.component'
import { SeeAllComponent } from './routes/events/see-all/see-all.component'
import { EventVideoPlayerComponent } from './components/event-video-player/event-video-player.component'
import { EventsV2Component } from './routes/events-v2/events-v2.component'
import { AppEventPageResolverService } from 'src/app/services/app-event-page-resolver.service'
import { MyAllEventsComponent } from './routes/events/my-all-events/my-all-events.component'

const routes: Routes = [
  {
    path: '',
    component: EventsHomeV2Component,
    data: {
      pageId: '',
      module: '',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      // {
      //   path: 'home',
      //   component: EventsComponent,
      //   data: {
      //     pageId: 'home',
      //     module: 'Events',
      //   },
      //   resolve: {
      //     topics: EventRecentResolve,
      //   },
      // },
      {
        path: 'home',
        component: EventsV2Component,
        data: {
          pageType: 'feature',
          pageKey: 'event',
          pageId: 'app/event-hub',
          module: 'Events',
        },
        resolve: {
          pageData: AppEventPageResolverService,
        },
      },
      {
        path: 'see-all',
        component: SeeAllComponent,
        data: {
          pageId: 'see-all',
          module: 'Events',
        },
      },
      {
        path: 'my-events',
        component: MyAllEventsComponent,
        data: {
          pageId: 'my-events',
          module: 'Events',
        },
      },
      {
        path: 'view-all',
        component: ViewAllComponent,
        data: {
          pageId: 'view-all',
          module: 'Events',
        },
        resolve: {
          pageData: AppEventPageResolverService,
        },
      },
      {
        path: 'home/:eventId',
        component: EventDetailComponent,
        data: {
          pageId: 'home/:eventId',
          module: 'Events',
        },
      },
      {
        path: 'player/:eventId',
        component: EventPlayerComponent,
        children: [
          {
            path: 'pdf',
            component: EventPdfPlayerComponent,
            data: {
              resourceType: 'pdf',
              module: 'Events',
              pageId: 'pdf',
            },
            resolve: {
              content: ViewerResolve,
            },
          },
          {
            path: 'youtube/:videoId',
            component: EventYouTubeComponent,
            data: {
              resourceType: 'youtube',
              module: 'Events',
              pageId: 'youtube',
            },
            resolve: {
              content: EventResolve,
              pageData: AppEventPageResolverService,
            },
          },
          {
            path: 'video/:videoId',
            component: EventVideoPlayerComponent,
            data: {
              resourceType: 'video',
              module: 'Events',
              pageId: 'video',
            },
            resolve: {
              content: EventResolve,
              pageData: AppEventPageResolverService,
            },
          },
        ],
        data: {
          resourceType: 'pdf',
          module: 'Events',
          pageId: 'player/:eventId',
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
  providers: [
    EventRecentResolve,
    EventDetailResolve,
  ],
})
export class EventsRoutingModule { }
