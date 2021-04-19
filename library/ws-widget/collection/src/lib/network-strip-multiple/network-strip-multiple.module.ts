import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { NetworkStripMultipleComponent } from './network-strip-multiple.component'
import { HorizontalScrollerModule } from '@sunbird-cb/utils'
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
  declarations: [NetworkStripMultipleComponent],
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
  entryComponents: [NetworkStripMultipleComponent],
})
export class NetworkStripMultipleModule { }
