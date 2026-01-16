import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UIAdminUserTableComponent } from './user-list/ui-admin-user-table.component'
import { UIUserTablePopUpComponent } from './user-list-popup/ui-user-table-pop-up.component'
import { UIDirectoryTableComponent } from './directory-list/directory-table.component'
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { MatSortModule } from '@angular/material/sort'
import { MatIconModule } from '@angular/material/icon'
import { AppButtonModule } from '../app-button/app-button.module'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { DefaultThumbnailModule, PipeCountTransformModule, PipeDurationTransformModule, PipeHtmlTagRemovalModule, PipePartialContentModule } from '@sunbird-cb/utils-v2'
import { BtnChannelAnalyticsModule } from '../btn-channel-analytics/btn-channel-analytics.module'
import { BtnContentFeedbackV2Module } from '../btn-content-feedback-v2/btn-content-feedback-v2.module'
import { BtnContentLikeModule } from '../btn-content-like/btn-content-like.module'
import { BtnContentMailMeModule } from '../btn-content-mail-me/btn-content-mail-me.module'
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator'
import { UserPopupComponent } from './user-popup/user-popup'
import { FormsModule } from '@angular/forms'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'
import { BtnPageBackModule } from '../btn-page-back/btn-page-back.module'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
@NgModule({
    declarations: [UIAdminUserTableComponent, UIDirectoryTableComponent, UserPopupComponent, UIUserTablePopUpComponent],
    imports: [
        CommonModule,
        MatTableModule,
        MatTooltipModule,
        MatSortModule,
        MatIconModule,
        MatMenuModule,
        DefaultThumbnailModule, PipeCountTransformModule,
        PipeDurationTransformModule, PipeHtmlTagRemovalModule,
        PipePartialContentModule,
        BtnChannelAnalyticsModule,
        BtnContentFeedbackV2Module,
        BtnContentMailMeModule,
        BtnContentLikeModule,
        MatPaginatorModule,
        MatDialogModule, MatButtonModule,
        MatCheckboxModule,
        FormsModule,
        MatRadioModule,
        BtnPageBackModule,
        AppButtonModule,
    ],
    exports: [UIAdminUserTableComponent, UIDirectoryTableComponent, UIUserTablePopUpComponent]
})
export class UIAdminTableModule { }
