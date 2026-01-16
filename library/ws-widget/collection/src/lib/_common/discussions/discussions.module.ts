import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { SkeletonLoaderModule } from '../skeleton-loader/skeleton-loader.module'
import { PipeRelativeTimeModule } from '@sunbird-cb/utils-v2'

import { DiscussionsComponent } from './discussions.component'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
    declarations: [DiscussionsComponent],
    imports: [
        CommonModule,
        RouterModule,
        MatIconModule,
        SkeletonLoaderModule,
        PipeRelativeTimeModule,
        TranslateModule,
    ],
    exports: [
        DiscussionsComponent,
    ]
})

export class DiscussionsModule { }
