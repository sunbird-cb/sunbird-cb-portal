import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule, MatTabsModule } from '@angular/material';

import { ContentTocComponent } from './content-toc.component';
import { AppTocAboutComponent } from './app-toc-about/app-toc-about.component';
import { AppTocContentComponent } from './app-toc-content/app-toc-content.component';

@NgModule({
  declarations: [ContentTocComponent, AppTocAboutComponent, AppTocContentComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatTabsModule,
  ],
  exports: [
    ContentTocComponent
  ],
  entryComponents: [
    ContentTocComponent
  ]
})

export class ContentTocModule { }
