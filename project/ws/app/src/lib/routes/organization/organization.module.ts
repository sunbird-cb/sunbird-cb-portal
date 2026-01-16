import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { BtnPageBackModule } from '@sunbird-cb/collection'
import { OrganizationRoutingModule } from './organization-routing.module'
import { OrganizationHomeComponent } from './routes/organization-home/organization-home.component'
import { OrganizationCourseDetailComponent } from './routes/organization-course-detail/organization-course-detail.component'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatIconModule } from '@angular/material/icon'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'

@NgModule({
  declarations: [OrganizationHomeComponent, OrganizationCourseDetailComponent],
  imports: [
    CommonModule,
    OrganizationRoutingModule,
    WidgetResolverModule,
    BtnPageBackModule,
    MatSidenavModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatTabsModule,
  ],
})
export class OrganizationModule { }
