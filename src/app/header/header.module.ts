import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HeaderComponent } from './header/header.component'
import { AppNavBarComponent } from '../component/app-nav-bar/app-nav-bar.component'
import { RouterModule } from '@angular/router'
import { GridLayoutModule, BtnFeatureModule, ErrorResolverModule, TourModule, StickyHeaderModule } from '@sunbird-cb/collection'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { SearchV3Module, SearchModule } from '@ws/app/src/public-api'
import { SharedModule } from '../shared/shared.module'
import { FontSettingComponent } from './../component/font-setting/font-setting.component'
import { TopRightNavBarComponent } from './../component/top-right-nav-bar/top-right-nav-bar.component'
import { FormsModule } from '@angular/forms'
import { HttpClient } from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { HttpLoaderFactory } from '../app.module'
import { SkeletonLoaderModule } from '@sunbird-cb/collection/src/lib/_common/skeleton-loader/skeleton-loader.module'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { LibNotificationsService, NotificationDropdownModule } from '@sunbird-cb/notification'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { ConfirmDialogModule } from '@sunbird-cb/collection/src/lib/_common/confirm-dialog/confirm-dialog.module'
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
    SearchV3Module,
    RouterModule,
    GridLayoutModule,
    SharedModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatSnackBarModule,
    NotificationDropdownModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    SkeletonLoaderModule,
    ConfirmDialogModule
  ],
  exports: [
    HeaderComponent,
    AppNavBarComponent,
    FontSettingComponent,
    TopRightNavBarComponent,
    SharedModule,
  ],
  providers: [LibNotificationsService],
})
export class HeaderModule { }
