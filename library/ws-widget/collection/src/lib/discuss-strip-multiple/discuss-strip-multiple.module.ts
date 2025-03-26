import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { DiscussStripMultipleComponent } from './discuss-strip-multiple.component'
import { HorizontalScrollerModule } from '@sunbird-cb/utils-v2'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import {
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatChipsModule,
  MatCardModule,
} from '@angular/material'

@NgModule({
  declarations: [DiscussStripMultipleComponent],
  imports: [
    CommonModule,
    RouterModule,
    HorizontalScrollerModule,
    WidgetResolverModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatCardModule,
  ],
  entryComponents: [DiscussStripMultipleComponent],
  exports: [DiscussStripMultipleComponent],
})
export class DiscussStripMultipleModule { }
