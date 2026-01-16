import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscussV2HomeComponent } from './routes/discuss-v2-home/discuss-v2-home.component';
import { PostDetailsComponent } from './routes/post-details/post-details.component';
import { CommunityDetailsHomeComponent } from './routes/community-details-home/community-details-home.component';
import { CommunitySearchComponent } from './routes/community-search/community-search.component';
import { TopicsAllComponent } from './routes/topics-all/topics-all.component';

const routes: Routes = [
  {
    path: '',
    // loadChildren: () => import('./wrapper/wrapper.module').then(u => u.WrapperModule),
    component: DiscussV2HomeComponent,
    data: {
      pageId: 'discussion-forum',
      module: 'Discuss',
    },
  },
  {
    path: 'post/:discussionId',
    // loadChildren: () => import('./wrapper/wrapper.module').then(u => u.WrapperModule),
    component: PostDetailsComponent,
    data: {
      pageId: 'discussion-forum',
      module: 'Discuss',
    },
  },
  {
    path: 'community/:communityId',
    // loadChildren: () => import('./wrapper/wrapper.module').then(u => u.WrapperModule),
    component: CommunityDetailsHomeComponent,
    data: {
      pageId: 'discussion-forum',
      module: 'Discuss',
    },
  },
  {
    path: 'community/:communityId/:discussionId',
    // loadChildren: () => import('./wrapper/wrapper.module').then(u => u.WrapperModule),
    component: CommunityDetailsHomeComponent,
    data: {
      pageId: 'discussion-forum',
      module: 'Discuss',
    },
  },
  {
    path: 'search',
    // loadChildren: () => import('./wrapper/wrapper.module').then(u => u.WrapperModule),
    component: CommunitySearchComponent,
    data: {
      pageId: 'discussion-forum',
      module: 'Discuss',
    },
  },
  {
    path: 'communities/:topicName',
    component: CommunitySearchComponent,
    data: {
      pageId: 'discussion-forum',
      module: 'Discuss',
    },
  },

  {
    path: 'topics/all',
    component: TopicsAllComponent,
    data: {
      pageId: 'discussion-forum',
      module: 'Discuss',
    },
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscussV2RoutingModule { }
