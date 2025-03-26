import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PipeFilterModule, PipeHtmlTagRemovalModule, PipeOrderByModule, PipeRelativeTimeModule, PipeListFilterModule } from '@sunbird-cb/utils-v2'
import { TaxonomyHomeComponent } from './routes/taxonomy-home/taxonomy.component'
import { TaxonomyRoutingModule } from './taxonomy.rounting.module'
import { TaxonomyLevelCardComponent } from './components/taxonomy-level-card/taxonomy-level-card.component'
import { LeftMenuComponent } from './components/left-menu/left-menu.component'

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
// import { EditorSharedModule } from '@ws/author/src/lib/routing/modules/editor/shared/shared.module'
// import { CkEditorModule } from 'library/ws-widget/collection/src/lib/_common/ck-editor/ck-editor.module'
import { LoaderService } from '@ws/author/src/lib/services/loader.service'
// import { CKEditorService } from 'library/ws-widget/collection/src/lib/_common/ck-editor/ck-editor.service'

import { TaxonomyExplorerComponent } from './routes/taxonomy-explorer/explorer.component'
import { BreadcrumbsOrgModule } from './components/breadcrumbs/breadcrumbs-org.module'
import { CardContentV2Module } from '@sunbird-cb/collection/src/lib/card-content-v2/card-content-v2.module'

@NgModule({
  declarations: [
    TaxonomyHomeComponent,
    TaxonomyLevelCardComponent,
    LeftMenuComponent,
    TaxonomyExplorerComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TaxonomyRoutingModule,
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
    BreadcrumbsOrgModule,
   ],
  providers: [
    // CKEditorService,
    LoaderService,
  ],
})
export class TaxonomyModule {

}
