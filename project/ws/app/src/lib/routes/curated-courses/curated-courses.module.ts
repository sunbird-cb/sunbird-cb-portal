import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PipeFilterModule, PipeHtmlTagRemovalModule, PipeOrderByModule, PipeRelativeTimeModule, PipeListFilterModule, PipeFilterV3Module } from '@sunbird-cb/utils'

// import { BasicCKEditorComponent } from './components/basic-ckeditor/basic-ckeditor.component'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatDividerModule } from '@angular/material/divider'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import {
  MatIconModule,
  MatListModule,
  MatFormFieldModule,
  MatDialogModule,
  MatSelectModule,
  MatInputModule,
  MatButtonModule,
  MatSidenavModule,
  MatChipsModule,
  MatProgressSpinnerModule,
} from '@angular/material'
import { MatCardModule } from '@angular/material/card'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { AvatarPhotoModule, BtnPageBackModule, CardContentModule } from '@sunbird-cb/collection'

import { CuratedCoursesRoutingModule } from './curated-courses-routing.module'
import { CuratedHomeComponent } from './routes/curated-home/curated-home.component'
import { CuratedexplorerComponent } from './routes/curatedexplorer/curatedexplorer.component'
import { CuratedCollectionCardComponent } from './components/curated-collection-card/curated-collection-card.component'
import { CuratedPopularCardComponent } from './components/curated-popular-card/curated-popular-card.component'
import { CuratedCollectionService } from './services/curated-collection.service'
import { LeftMenuComponent } from './components/left-menu/left-menu.component'
import { CardContentV2Module } from '@sunbird-cb/collection/src/lib/card-content-v2/card-content-v2.module'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [
    CuratedHomeComponent,
    CuratedexplorerComponent,
    CuratedCollectionCardComponent,
    CuratedPopularCardComponent,
    LeftMenuComponent,
  ],
  imports: [
    CommonModule,
    CuratedCoursesRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatGridListModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatDividerModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatListModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    PipeFilterModule,
    PipeHtmlTagRemovalModule,
    PipeRelativeTimeModule,
    AvatarPhotoModule,
    // EditorSharedModule,
    // CkEditorModule,
    PipeOrderByModule,
    PipeListFilterModule,
    BtnPageBackModule,
    WidgetResolverModule,
    CardContentModule,
    CardContentV2Module,
    PipeFilterV3Module,
    TranslateModule,
  ],
  providers: [
    CuratedCollectionService,
  ],
})
export class CuratedCoursesModule { }
