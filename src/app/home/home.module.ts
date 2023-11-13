import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module'
import { HeaderModule } from '../header/header.module';
import { HomeComponent } from './home/home.component';
import { IngsightSideBarComponent } from '../component/ingsight-side-bar/ingsight-side-bar.component';
import { PageContainerComponent } from '../component/page-container/page-container.component';
import {
  GridLayoutModule,  SlidersModule, ContentStripNewMultipleModule, DiscussStripMultipleModule, NetworkStripMultipleModule
} from '@sunbird-cb/collection';
import { FeedListComponent } from './home/feed-list/feed-list.component'
import { HomeOtherPortalComponent } from '../component/home-other-portal/home-other-portal.component'
import { MatCardModule } from '@angular/material'
import { NoDataComponent } from '../component/no-data/no-data.component'
import { ClientSliderComponent } from '../component/client-slider/client-slider.component';


@NgModule({
  declarations: [HomeComponent, FeedListComponent, IngsightSideBarComponent, 
    PageContainerComponent, HomeOtherPortalComponent, NoDataComponent,
    ClientSliderComponent],
  imports: [
    CommonModule,    
    HomeRoutingModule,
    GridLayoutModule,
    SlidersModule,
    ContentStripNewMultipleModule, 
    DiscussStripMultipleModule, 
    NetworkStripMultipleModule,
    MatCardModule,
  ],
  exports: [
    HeaderModule   
  ]
})
export class HomeModule { }
