import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TopicCardComponent } from './components/topic-card/topic-card.component'
import { ProfileHomeComponent } from './routes/profile-home/profile-home.component'
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSnackBarModule } from '@angular/material'
import { MatListModule } from '@angular/material/list'
import { CurrentCompetenciesComponent } from './routes/current-competencies/current-competencies.component'
import { MatSidenavModule } from '@angular/material/sidenav'
import { RouterModule } from '@angular/router'
import { ProfileV3RoutingModule } from './profile-v3-routing.module'
import { CompetencyCardComponent } from './components/competency-card/competency-card.component'
import { SetupLeftMenuComponent } from './components/left-menu/left-menu.component'
import { DesiredCompetenciesComponent } from './routes/desired-competencies/desired-competencies.component'
import { TopicComponent } from './routes/topics/topic.component'
import { CompetencyFiltersComponent } from '../browse-by-competency/components/competency-filters/competency-filters.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PipeFilterV2Module } from '@sunbird-cb/utils/src/public-api'
import { TreeCatalogModule } from '@sunbird-cb/collection/src/public-api'
import { TopicService } from './services/topics.service'
// import { PlayerVideoComponent } from '@sunbird-cb/collection/src/lib/player-video/player-video.component'
import { PlatformWalkthroughComponent } from './routes/platform-walkthrough/platform-walkthrough.component'

import { AddTopicDialogComponent } from './components/add-topic/add-topic.component'



@NgModule({
  declarations: [
    DesiredCompetenciesComponent,
    TopicCardComponent,
    ProfileHomeComponent,
    CurrentCompetenciesComponent,
    CompetencyCardComponent,
    SetupLeftMenuComponent,
    TopicComponent,
    CompetencyFiltersComponent,
    PlatformWalkthroughComponent,
    // VideoWrapperComponent,
    AddTopicDialogComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatSidenavModule,
    MatIconModule,
    RouterModule,
    MatButtonModule,
    ProfileV3RoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    PipeFilterV2Module,
    MatInputModule,
    TreeCatalogModule,
    MatSnackBarModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  providers: [
    TopicService,
  ],
  entryComponents: [
    AddTopicDialogComponent,
  ],
})
export class ProfileV3Module { }
