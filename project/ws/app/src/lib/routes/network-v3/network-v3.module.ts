import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkV3RoutingModule } from './network-v3-routing.module';
import { NetworkProfileComponent } from './components/network-profile/network-profile.component';
import { NetworkNavigationComponent } from './components/network-navigation/network-navigation.component';
import { ConnectionsComponent } from './routes/connections/connections.component';
import { RecommendationsComponent } from './routes/recommendations/recommendations.component';
import { UpdatesComponent } from './routes/updates/updates.component';
import { NetworkComponent } from './routes/network/network.component';
import { NetworkHomeComponent } from './routes/network-home/network-home.component';
import { MentorsComponent } from './routes/mentors/mentors.component';
import { ProfileCardComponent } from './components/profile-card/profile-card.component';
import { ConnectionsCardComponent } from './components/connections-card/connections-card.component';
import { UpdatesCardComponent } from './components/updates-card/updates-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTabsModule } from '@angular/material/legacy-tabs';
import { AvatarPhotoModule } from '@sunbird-cb/collection/src/lib/_common/avatar-photo/avatar-photo.module';
import { ConnectionPeopleCardComponent } from './components/connection-people-card/connection-people-card.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AllRecommendationsComponent } from './components/all-recommendations/all-recommendations.component';
import { CommunitySuggestionsModule, HorizontalScrollerV2Module, ConnectionNameModule, DialogComponentsModule, AvatarPhotoLibModule } from '@sunbird-cb/consumption';
import { PaginationModule } from '@sunbird-cb/collection/src/lib/_common/pagination/pagination.module';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { SkeletonLoaderModule } from '@sunbird-cb/collection/src/lib/_common/skeleton-loader/skeleton-loader.module';
import { MatLegacyDialogModule } from '@angular/material/legacy-dialog';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';


@NgModule({
  declarations: [
    NetworkComponent,
    NetworkProfileComponent,
    NetworkNavigationComponent,
    NetworkHomeComponent,
    ConnectionsComponent,
    RecommendationsComponent,
    UpdatesComponent,
    MentorsComponent,
    ProfileCardComponent,
    ConnectionsCardComponent,
    UpdatesCardComponent,
    ConnectionPeopleCardComponent,
    AllRecommendationsComponent
  ],
  imports: [
    CommonModule,
    NetworkV3RoutingModule,
    MatIconModule,
    MatLegacyMenuModule,
    AvatarPhotoModule,
    ConnectionNameModule,
    PaginationModule,
    HorizontalScrollerV2Module,
    MatLegacyTabsModule,
    MatLegacyButtonModule,
    CommunitySuggestionsModule,
    SkeletonLoaderModule,
    MatLegacyDialogModule,
    DialogComponentsModule,
    AvatarPhotoLibModule,
    TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient],
                },
            }),
  ]
})
export class NetworkV3Module { }
