import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MatIconModule, MatTabsModule, MatProgressBarModule, MatExpansionModule } from '@angular/material'
import { SkeletonLoaderModule } from '../skeleton-loader/skeleton-loader.module'

import { ContentTocComponent } from './content-toc.component'
import { AppTocAboutComponent } from './app-toc-about/app-toc-about.component'
import { AppTocContentComponent } from './app-toc-content/app-toc-content.component'

@NgModule({
  declarations: [ContentTocComponent, AppTocAboutComponent, AppTocContentComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatTabsModule,
    SkeletonLoaderModule,
    MatProgressBarModule,
    MatExpansionModule,
  ],
  exports: [
    ContentTocComponent,
    AppTocAboutComponent,
    AppTocContentComponent,
  ],
  entryComponents: [
    ContentTocComponent,
  ],
})

export class ContentTocModule { }
