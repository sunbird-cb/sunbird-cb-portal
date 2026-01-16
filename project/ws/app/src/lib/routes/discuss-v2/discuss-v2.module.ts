import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DiscussV2RoutingModule } from './discuss-v2-routing.module';
import { DiscussV2HomeComponent } from './routes/discuss-v2-home/discuss-v2-home.component';
import { WidgetDiscussionv2Module,DiscussionV2Module,WidgetTopicsAllModule,
  WidgetCommunitySearchModule,WidgetCommunityHomeModule,WidgetDiscussionv2HomeModule,TrendingDiscussionsModule,ShortcutsModule, WidgetPostdetailsModule, 
  WidgetDiscussionv2LandingPageModule} from '@sunbird-cb/discussion-v2';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PostDetailsComponent } from './routes/post-details/post-details.component';
import { CommunityDetailsHomeComponent } from './routes/community-details-home/community-details-home.component';
import { CommunitySearchComponent } from './routes/community-search/community-search.component';
import { TopicsAllComponent } from './routes/topics-all/topics-all.component';


@NgModule({
  declarations: [
    DiscussV2HomeComponent,
    PostDetailsComponent,
    CommunityDetailsHomeComponent,
    CommunitySearchComponent,
    TopicsAllComponent,
    
  ],
  imports: [
    CommonModule,
    DiscussV2RoutingModule,
    WidgetDiscussionv2Module,
    DiscussionV2Module,
    WidgetPostdetailsModule,
    CKEditorModule,
    WidgetDiscussionv2HomeModule,
    MatIconModule,
    ShortcutsModule,
    TrendingDiscussionsModule,
    WidgetCommunityHomeModule,
    WidgetCommunitySearchModule,
    WidgetTopicsAllModule,
    WidgetDiscussionv2LandingPageModule
  ]
})
export class DiscussV2Module { }
