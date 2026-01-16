import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ScrollspyLeftMenuComponent } from './scrollspy-left-menu.component'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'

@NgModule({
  declarations: [ScrollspyLeftMenuComponent],
  imports: [
    CommonModule,
    MatListModule,
  ],
  exports: [ScrollspyLeftMenuComponent],
})
export class ScrollspyLeftMenuModule { }
