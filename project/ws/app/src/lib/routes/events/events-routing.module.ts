import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ViewerResolve } from '@ws/viewer/src/lib/viewer.resolve'
import { EventsHomeComponent } from './routes/events-home/events-home.component'
import { EventsComponent } from './routes/events/events.component'
import { EventDetailComponent } from './routes/event-detail/event-detail.component'
import { EventRecentResolve } from './resolvers/event-resolve'
import { EventDetailResolve } from './resolvers/event-detail-resolve'
import { EventPlayerComponent } from './routes/event-player/event-player.component'
import { EventPdfPlayerComponent } from './components/event-pdf-player/event-pdf-player.component'
import { EventYouTubeComponent } from './components/event-you-tube/event-you-tube.component'
import { EventResolve } from './services/event-resolver.resolve'

const routes: Routes = [
  {
    path: '',
    component: EventsHomeComponent,
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
      {
        path: 'home',
        component: EventsComponent,
        data: {
          pageId: 'home',
          module: 'Events',
        },
        resolve: {
          topics: EventRecentResolve,
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
