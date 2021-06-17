import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MatButtonModule, MatCardModule, MatIconModule } from '@angular/material'
import { BreadcrumbsOrgComponent } from './breadcrumbs-org.component'

@NgModule({
  declarations: [BreadcrumbsOrgComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  exports: [BreadcrumbsOrgComponent],
  entryComponents: [BreadcrumbsOrgComponent],
})
export class BreadcrumbsOrgModule { }
