import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatIconModule,
  MatToolbarModule,
  MatMenuModule,
  MatSliderModule,
  MatTooltipModule
} from '@angular/material'
import { MatDialogModule} from '@angular/material';
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
import { SharedModule } from '../shared/shared.module';
import { FontSettingComponent } from './../component/font-setting/font-setting.component';
import { TopRightNavBarComponent } from './../component/top-right-nav-bar/top-right-nav-bar.component';
import { SkeletonLoaderModule } from '@sunbird-cb/collection/src/lib/_common/skeleton-loader/skeleton-loader.module';
@NgModule({
  declarations: [HeaderComponent, AppNavBarComponent, FontSettingComponent, TopRightNavBarComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatSliderModule,
    MatDialogModule,
    BtnFeatureModule,
    ErrorResolverModule,
    TourModule,
    WidgetResolverModule,
    StickyHeaderModule,
    SearchModule,
    RouterModule,
    GridLayoutModule,
    SharedModule,
    MatTooltipModule,
    SkeletonLoaderModule
  ],
  exports: [
    HeaderComponent,
    AppNavBarComponent,
    FontSettingComponent,
    TopRightNavBarComponent,
    SharedModule
  ],
  providers: [
    
    
    
  ]
})
export class HeaderModule { }
