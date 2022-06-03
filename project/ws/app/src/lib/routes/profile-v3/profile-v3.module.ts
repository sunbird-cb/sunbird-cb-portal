import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TopicCardComponent } from './components/topic-card/topic-card.component'
import { ProfileHomeComponent } from './routes/profile-home/profile-home.component'
import { MatButtonModule, MatCardModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSnackBarModule } from '@angular/material'
import { MatListModule } from '@angular/material/list';
import { CurrentCompetenciesComponent } from './routes/current-competencies/current-competencies.component'
import { MatSidenavModule } from '@angular/material/sidenav'
import { RouterModule } from '@angular/router'
import { ProfileV3RoutingModule } from './profile-v3-routing.module';
import { CompetencyCardComponent } from './components/competency-card/competency-card.component'
import { SetupLeftMenuComponent } from './components/left-menu/left-menu.component'
import { DesiredCompetenciesComponent } from './routes/desired-competencies/desired-competencies.component'
import { TopicComponent } from './routes/topics/topic.component'
import { TreeCatalogModule } from '@sunbird-cb/collection/src/public-api'
import { TopicService } from './services/topics.service'
import { AddTopicDialogComponent } from './components/add-topic/add-topic.component'
import { ReactiveFormsModule } from '@angular/forms'


@NgModule({
  declarations: [
    DesiredCompetenciesComponent,
    TopicCardComponent,
    ProfileHomeComponent,
    CurrentCompetenciesComponent,
    CompetencyCardComponent,
    SetupLeftMenuComponent,
    TopicComponent,
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
