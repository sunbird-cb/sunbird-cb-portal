import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { HeaderModule } from '../header/header.module'
import {
  GridLayoutModule,  SlidersModule,  ContentStripWithTabsModule, AvatarPhotoModule,
} from '@sunbird-cb/collection'
import { SkeletonLoaderModule } from '@sunbird-cb/collection/src/lib/_common/skeleton-loader/skeleton-loader.module'
import { PipeRelativeTimeModule } from '@sunbird-cb/utils-v2'
import { SharedModule } from '../shared/shared.module'
import { CardContentV2Module } from '@sunbird-cb/collection/src/lib/card-content-v2/card-content-v2.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { FilterSearchPipeModule } from '../pipes/filter-search/filter-search.module'
import { TranslateModule } from '@ngx-translate/core'
import { MatBottomSheetModule } from '@angular/material/bottom-sheet'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { RecommendeLearningsRoutingModule } from './recommende-learnings-routing.module'
import { RecommendeLearningsComponent } from './recommende-learnings/recommende-learnings.component'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { CardsModule } from '@sunbird-cb/consumption'
@NgModule({
    declarations: [RecommendeLearningsComponent],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        RecommendeLearningsRoutingModule,
        MatExpansionModule,
        GridLayoutModule,
        SlidersModule,
        ContentStripWithTabsModule,
        MatBottomSheetModule,
        MatCardModule,
        MatIconModule,
        MatCheckboxModule,
        SharedModule,
        MatTabsModule,
        MatChipsModule,
        MatIconModule,
        SkeletonLoaderModule,
        PipeRelativeTimeModule,
        AvatarPhotoModule,
        CardContentV2Module,
        FilterSearchPipeModule,
        MatMenuModule,
        MatRadioModule,
        TranslateModule,
        CardsModule
    ],
    exports: [
        HeaderModule,
        MatCardModule,
        SharedModule,
    ],
    providers: []
})
export class RecommendeLearningsModule { }
