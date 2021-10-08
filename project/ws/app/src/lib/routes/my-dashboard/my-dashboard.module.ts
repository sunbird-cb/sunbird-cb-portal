import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule, MatCardModule, MatIconModule, MatToolbarModule } from '@angular/material'
import { BreadcrumbsOrgModule } from '@sunbird-cb/collection'
import { MyDashboardHomeComponent } from './components/my-dashboard-home/my-dashboard-home.component'
import { QumlComponent } from './components/quml/quml.component'
import { MyDashboardRoutingModule } from './my-dashboard-routing.module'
import { RainDashboardsModule } from '@sunbird-cb/rain-dashboards'
import { CarouselModule } from 'ngx-bootstrap/carousel'
// import { QuestionCursorImplementationService } from './services/question-cursor-implementation.service'
import { QumlLibraryModule } from '@project-sunbird/sunbird-quml-player-v8'

@NgModule({
  declarations: [MyDashboardHomeComponent, QumlComponent],
  imports: [
    CommonModule,
    MyDashboardRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    BreadcrumbsOrgModule,
    RainDashboardsModule,
    QumlLibraryModule,
    CarouselModule.forRoot(),
  ],
  providers: [],
  exports: [MyDashboardHomeComponent, QumlComponent],
})
export class MyDashboardModule { }
