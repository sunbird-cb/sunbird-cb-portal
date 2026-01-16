import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { LearningTimeComponent } from './components/learning-time/learning-time.component'
import { LearningHistoryComponent } from './components/learning-history/learning-history.component'
import { LearningHomeComponent } from './components/learning-home/learning-home.component'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { LearningTimeResolver } from './resolvers/learning-time.resolver'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { PipeDurationTransformModule } from '@sunbird-cb/utils-v2'
import { LearningHistoryResolver } from './resolvers/learning-history.resolver'
import { LearningHistoryProgressComponent } from './components/learning-history-progress/learning-history-progress.component'
import { DisplayContentTypeModule } from '@sunbird-cb/collection'
import { ProgressRadialComponent } from './components/progress-radial/progress-radial.component'
import { CalendarModule } from '../../module/calendar-module/calendar.module'
import { HistoryCardComponent } from './components/history-card/history-card.component'
import { AnalyticsModule } from '../analytics/analytics.module'
import { BubbleChartComponent } from './components/bubble-chart/bubble-chart.component'
import { HistoryTileComponent } from './components/history-tile/history-tile.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { MatToolbarModule } from '@angular/material/toolbar'
@NgModule({
  declarations: [
    LearningTimeComponent,
    LearningHistoryComponent,
    LearningHomeComponent,
    LearningHistoryProgressComponent,
    ProgressRadialComponent,
    HistoryCardComponent,
    BubbleChartComponent,
    HistoryTileComponent,
  ],
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatCardModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatGridListModule,
    MatPaginatorModule,

    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    WidgetResolverModule,
    PipeDurationTransformModule,
    DisplayContentTypeModule,
    AnalyticsModule,
  ],
  providers: [LearningTimeResolver, LearningHistoryResolver],
})
export class LearningModule {}
