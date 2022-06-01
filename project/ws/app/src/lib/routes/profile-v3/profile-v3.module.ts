import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TopicCardComponent } from './components/topic-card/topic-card.component'
import { LeftMenuComponent } from './components/left-menu/left-menu.component'
import { ProfileHomeComponent } from './routes/profile-home/profile-home.component'
import { MatCardModule, MatIconModule } from '@angular/material'
import {MatListModule} from '@angular/material/list';
import { CurrentCompetenciesComponent } from './routes/current-competencies/current-competencies.component'
import {MatSidenavModule} from '@angular/material/sidenav'
import { RouterModule } from '@angular/router'


@NgModule({
  declarations: [TopicCardComponent, LeftMenuComponent, ProfileHomeComponent, CurrentCompetenciesComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatSidenavModule,
    MatIconModule,
    RouterModule,
  ]
})
export class ProfileV3Module { }
