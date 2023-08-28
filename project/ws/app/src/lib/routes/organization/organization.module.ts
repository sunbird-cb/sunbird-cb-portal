import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule,MatIconModule, MatSidenavModule, MatTableModule } from '@angular/material'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { BtnPageBackModule } from '@sunbird-cb/collection'
import { OrganizationRoutingModule } from './organization-routing.module'
import { OrganizationHomeComponent } from './routes/organization-home/organization-home.component'


@NgModule({
  declarations: [OrganizationHomeComponent],
  imports: [
    CommonModule,
    OrganizationRoutingModule,
    WidgetResolverModule,
    BtnPageBackModule,
    MatSidenavModule,
    MatCardModule,
    MatIconModule,
    MatTableModule
  ]
})
export class OrganizationModule { }
