import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebRoutingModule } from './web-routing.module'
import { HeaderModule } from '../header/header.module';
import { WebComponent } from './web/web.component';
import { IngsightSideBarComponent } from '../component/ingsight-side-bar/ingsight-side-bar.component';
import { PageContainerComponent } from '../component/page-container/page-container.component';
import {
  GridLayoutModule,  SlidersModule, ContentStripNewMultipleModule, DiscussStripMultipleModule, NetworkStripMultipleModule
} from '@sunbird-cb/collection';
import { FeedListComponent } from './web/feed-list/feed-list.component';

@NgModule({
  declarations: [WebComponent, FeedListComponent, IngsightSideBarComponent, PageContainerComponent],
  imports: [
    CommonModule,    
    WebRoutingModule,
    GridLayoutModule,
    SlidersModule,
    ContentStripNewMultipleModule, 
    DiscussStripMultipleModule, 
    NetworkStripMultipleModule
  ],
  exports: [
    HeaderModule   
  ]
})
export class WebModule { }
