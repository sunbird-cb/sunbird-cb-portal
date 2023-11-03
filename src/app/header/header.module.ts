import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatIconModule,
  MatToolbarModule,
  MatMenuModule
} from '@angular/material'
import { HeaderComponent } from './header/header.component';
import { AppNavBarComponent } from '../component/app-nav-bar/app-nav-bar.component';
import { RouterModule } from '@angular/router';
import {
  GridLayoutModule
} from '@sunbird-cb/collection';
import {
  BtnFeatureModule, ErrorResolverModule, TourModule,
  StickyHeaderModule,
} from '@sunbird-cb/collection'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { SearchModule } from '@ws/app/src/public-api'

@NgModule({
  declarations: [HeaderComponent, AppNavBarComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    BtnFeatureModule,
    ErrorResolverModule,
    TourModule,
    WidgetResolverModule,
    StickyHeaderModule,
    SearchModule,
    RouterModule,
    GridLayoutModule 
  ],
  exports: [
    HeaderComponent,
    AppNavBarComponent
  ],
  providers: [
    
    
    
  ]
})
export class HeaderModule { }
