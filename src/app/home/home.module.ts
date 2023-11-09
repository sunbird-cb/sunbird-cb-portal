import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module'
import { HeaderModule } from '../header/header.module';
import { HomeComponent } from './home/home.component';
import { IngsightSideBarComponent } from '../component/ingsight-side-bar/ingsight-side-bar.component';
import { PageContainerComponent } from '../component/page-container/page-container.component';
import {
  GridLayoutModule,  SlidersModule, DiscussStripMultipleModule, NetworkStripMultipleModule, ContentStripWithTabsModule
} from '@sunbird-cb/collection';
import { FeedListComponent } from './home/feed-list/feed-list.component';

@NgModule({
  declarations: [HomeComponent, FeedListComponent, IngsightSideBarComponent, PageContainerComponent],
  imports: [
    CommonModule,    
    HomeRoutingModule,
    GridLayoutModule,
    SlidersModule,
    DiscussStripMultipleModule, 
    NetworkStripMultipleModule,
    ContentStripWithTabsModule,
  ],
  exports: [
    HeaderModule   
  ]
})
export class HomeModule { }
