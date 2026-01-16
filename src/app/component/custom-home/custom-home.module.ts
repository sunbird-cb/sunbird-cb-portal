import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { WidgetResolverModule } from '@sunbird-cb/resolver';
import {
  SlidersModule,
} from '@sunbird-cb/collection'
import { CustomHomeComponent } from './custom-home.component';
import { CustomHomeFormResolverService } from './resolvers/custom-home-form-resolver.service';
import { FeedListModule } from 'src/app/home/home/feed-list/feed-list.module';
import { AnnouncementsModule } from '@sunbird-cb/consumption';
import { ProfileCardStatsModule } from '@sunbird-cb/collection/src/lib/_common/profile-card-stats/profile-card-stats.module';
import { EventsCalendarModule } from '@ws/app/src/lib/routes/events/routes/events-calendar/events-calendar.module';


const routes: Routes = [
  {
    path: ':id',
    component: CustomHomeComponent,
    pathMatch: 'full',
    data: {
        pageId: ':id',
        module: 'CustomHome',
    },
    resolve: {
        pageData: CustomHomeFormResolverService,
    },
  }
];

@NgModule({
  declarations: [CustomHomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    WidgetResolverModule,
    SlidersModule,
    FeedListModule,
    AnnouncementsModule,
    ProfileCardStatsModule,
    EventsCalendarModule,
  ],
  exports: [CustomHomeComponent],
  providers: [CustomHomeFormResolverService ]
})
export class CustomHomeModule { }