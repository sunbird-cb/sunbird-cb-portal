import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

// Import the component
import { HomeOtherPortalComponent } from './home-other-portal.component';

// Import resolver module for widget resolution
import { WidgetResolverModule } from '@sunbird-cb/resolver';
import { SkeletonLoaderModule } from '@sunbird-cb/collection/src/lib/_common/skeleton-loader/skeleton-loader.module';

@NgModule({
  declarations: [HomeOtherPortalComponent],
  imports: [
    CommonModule,
    TranslateModule,
    SkeletonLoaderModule,
    WidgetResolverModule
  ],
  exports: [HomeOtherPortalComponent]
})
export class HomeOtherPortalModule { }