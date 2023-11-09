import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { HeaderModule } from '../header/header.module';
import { HomeComponent } from './home/home.component';
import { InsightSideBarComponent } from '../component/in-sight-side-bar/in-sight-side-bar.component';
import { DiscussionInfoComponent } from '../component/discussion-info/discussion-info.component';
import { PageContainerComponent } from '../component/page-container/page-container.component';
import {
  GridLayoutModule,  SlidersModule, ContentStripNewMultipleModule, DiscussStripMultipleModule, NetworkStripMultipleModule
} from '@sunbird-cb/collection';
import { FeedListComponent } from './home/feed-list/feed-list.component';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  declarations: [HomeComponent, FeedListComponent, InsightSideBarComponent, PageContainerComponent, DiscussionInfoComponent],
  imports: [
    CommonModule,    
    HomeRoutingModule,
    GridLayoutModule,
    SlidersModule,
    ContentStripNewMultipleModule, 
    DiscussStripMultipleModule, 
    NetworkStripMultipleModule,
    MatCardModule,
    MatIconModule,
    SharedModule
  ],
  exports: [
    HeaderModule,
    MatCardModule,
    SharedModule
  ]
})
export class HomeModule { }
