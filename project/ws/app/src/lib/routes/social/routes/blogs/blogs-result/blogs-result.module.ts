import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BlogResultComponent } from './components/blog-result.component'
import { RouterModule } from '@angular/router'

import { PipeSafeSanitizerModule } from '@sunbird-cb/utils-v2'
import { DialogSocialDeletePostModule, BtnPageBackModule } from '@sunbird-cb/collection'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'

@NgModule({
  declarations: [BlogResultComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    PipeSafeSanitizerModule,
    DialogSocialDeletePostModule,
    BtnPageBackModule,
  ],
  exports: [BlogResultComponent],
})
export class BlogsResultModule {}
