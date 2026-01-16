import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
// import { RecentForumPostComponent } from './recent-forum-post/components/recent-forum-post.component'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
// import { RecentForumPostComponent } from './recent-forum-post/components/recent-forum-post.component'
import { MatToolbarModule } from '@angular/material/toolbar'
import { RouterModule } from '@angular/router'
import { BtnPageBackModule } from '@sunbird-cb/collection'

import { ForumHomeRoutingModule } from './forum-home-routing.module'
import { ForumHomeComponent } from './forum-home.component'
import { ModeratorTimelineModule } from './forum-moderator/moderator-timeline.module'
// import { MyProfileComponent } from './forum-myprofile/components/my-profile.component'
import { ForumPostEditModule } from './forum-post-edit/forum-post-edit.module'
import { ForumPostReplyModule } from './forum-post-reply/forum-post-reply.module'
import { ForumPostResultModule } from './forum-post-result/forum-post-result.module'
import { ForumPostViewModule } from './forum-post-view/forum-post-view.module'
import { ForumViewModule } from './forum-view/forum-view.module'
import { MyforumPostComponent } from './myforum-post/components/myforum-post.component'
import { MyforumPostModule } from './myforum-post/myforum-post.module'
import { RecentForumPostModule } from './recent-forum-post/recent-forum-post.module'
import { ForumHandlerService } from './service/EmitterService/forum-handler.service'
import { FilterDispalyComponent } from './widgets/filter-display/filter-dispaly.component'
import { ViewForumService } from '../../resolvers/view-forum.service'
import { ModeratorTimelineService } from '../../resolvers/moderator-timeline.service'
import { PostViewModule } from './post-view/post-view.module'
import { PostCreateModule } from './post-create/post-create.module'
import { AdminTimelineModule } from './forum-admin/admin-timeline.module'
import { ForumEditModule } from './forum-edit/forum-edit.module'
import { EditForumService } from '../../resolvers/edit-forum.service'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatRippleModule } from '@angular/material/core'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'

@NgModule({
  declarations: [ForumHomeComponent, FilterDispalyComponent],
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    MatRadioModule,
    MatCardModule,
    ForumHomeRoutingModule,
    ForumPostEditModule,
    ForumPostReplyModule,
    ForumPostResultModule,
    ForumPostViewModule,
    ForumViewModule,
    MyforumPostModule,
    AdminTimelineModule,
    BtnPageBackModule,
    RecentForumPostModule,
    ModeratorTimelineModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatMenuModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatListModule,
    RouterModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatDividerModule,
    PostViewModule,
    PostCreateModule,
    ForumEditModule,
  ],

  providers: [ForumHandlerService, MyforumPostComponent, ViewForumService, ModeratorTimelineService, EditForumService],
  exports: [ForumHomeComponent],
})
export class ForumHomeModule {

}
