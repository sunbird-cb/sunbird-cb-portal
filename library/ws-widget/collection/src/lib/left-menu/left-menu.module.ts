import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { LeftMenuComponent } from './left-menu.component'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import {
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatChipsModule,
  MatCardModule,
  MatSidenavModule,
  MatListModule,
} from '@angular/material'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [LeftMenuComponent],
  imports: [
    CommonModule,
    RouterModule,
    WidgetResolverModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatChipsModule,
    MatCardModule,
    MatListModule,
    TranslateModule
  ],
  entryComponents: [LeftMenuComponent],
  exports: [
    LeftMenuComponent,
  ],
})
export class LeftMenuModule { }
