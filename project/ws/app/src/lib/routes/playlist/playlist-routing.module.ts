import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { NsPlaylist } from '@sunbird-cb/collection'

import { PlaylistHomeComponent } from './routes/playlist-home/playlist-home.component'
import { PlaylistCreateComponent } from './routes/playlist-create/playlist-create.component'
import { PlaylistsResolve } from './resolvers/playlists.resolve'
import { PlaylistDetailComponent } from './routes/playlist-detail/playlist-detail.component'
import { PlaylistResolve } from './resolvers/playlist.resolve'
import { PlaylistEditComponent } from './routes/playlist-edit/playlist-edit.component'
import { PlaylistNotificationComponent } from './routes/playlist-notification/playlist-notification.component'
import { PageResolve } from '@sunbird-cb/utils-v2'
// import { ProfileResolverService } from './resolvers/profile-resolver.service'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'me',
  },
  {
    path: 'me',
    component: PlaylistHomeComponent,
    data: {
      type: NsPlaylist.EPlaylistTypes.ME,
      pageType: 'feature',
      pageKey: 'playlist',
    },
    resolve: {
      pageData: PageResolve,
      playlists: PlaylistsResolve,
      // profileData: ProfileResolverService,
    },
    runGuardsAndResolvers: 'paramsChange',
  },
  {
    path: 'me/:id',
    component: PlaylistDetailComponent,
    data: { type: NsPlaylist.EPlaylistTypes.ME },
    resolve: {
      playlist: PlaylistResolve,
      // profileData: ProfileResolverService,
    },
  },
  {
    path: 'me/:id/edit',
    component: PlaylistEditComponent,
    data: { type: NsPlaylist.EPlaylistTypes.ME },
    resolve: {
      playlist: PlaylistResolve,
      // profileData: ProfileResolverService,
    },
  },
  {
    path: 'shared',
    component: PlaylistHomeComponent,
    data: {
      type: NsPlaylist.EPlaylistTypes.SHARED,
      pageType: 'feature',
      pageKey: 'playlist',
    },
    resolve: {
      pageData: PageResolve,
      playlists: PlaylistsResolve,
      // profileData: ProfileResolverService,
    },
    runGuardsAndResolvers: 'paramsChange',
  },
  {
    path: 'shared/:id',
    component: PlaylistDetailComponent,
    data: { type: NsPlaylist.EPlaylistTypes.SHARED },
    resolve: {
      playlist: PlaylistResolve,
      // profileData: ProfileResolverService,
    },
  },
  {
    path: 'shared/:id/edit',
    component: PlaylistEditComponent,
    data: { type: NsPlaylist.EPlaylistTypes.SHARED },
    resolve: {
      playlist: PlaylistResolve,
      // profileData: ProfileResolverService,
    },
  },
  {
    path: 'create',
    component: PlaylistCreateComponent,
  },
  {
    path: 'notification',
    component: PlaylistNotificationComponent,
    data: { type: NsPlaylist.EPlaylistTypes.PENDING },
    resolve: {
      playlists: PlaylistsResolve,
      // profileData: ProfileResolverService,
    },
    runGuardsAndResolvers: 'paramsChange',
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [PlaylistsResolve, PlaylistResolve],
})
export class PlaylistRoutingModule { }
