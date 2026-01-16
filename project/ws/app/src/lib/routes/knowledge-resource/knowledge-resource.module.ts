import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { KnowledgeResourceRoutingModule } from './knowledge-resource-routing.module'
import { KnowledgeAllComponent } from './routes/knowledge-all/knowledge-all.component'
import { KnowledgeHomeComponent } from './routes/knowledge-home/knowledge-home.component'

import { LeftMenuComponent } from './components/left-menu/left-menu.component'
import { KnowledgeCardComponent } from './components/knowledge-card/knowledge-card.component'
import { KnowledgeSavedComponent } from './routes/knowledge-saved/knowledge-saved.component'
import { BtnPageBackModule } from '@sunbird-cb/collection'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { KnowledgeDetailComponent } from './routes/knowledge-detail/knowledge-detail.component'
// import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { PipeSafeSanitizerModule } from '@sunbird-cb/utils-v2'
import { MatExpansionModule } from '@angular/material/expansion'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
// import { HttpLoaderFactory } from 'src/app/app.module'
import { HttpClient } from '@angular/common/http'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatSidenavModule } from '@angular/material/sidenav'

// tslint:disable-next-line:function-name
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http)
}

@NgModule({
  declarations: [
  KnowledgeAllComponent,
  KnowledgeHomeComponent,
  LeftMenuComponent,
  KnowledgeCardComponent,
  KnowledgeSavedComponent,
  KnowledgeDetailComponent,
  ],
  imports: [
    CommonModule,
    KnowledgeResourceRoutingModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    BtnPageBackModule,
    WidgetResolverModule,
    // Ng2SearchPipeModule,
    PipeSafeSanitizerModule,
    MatExpansionModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
})
export class KnowledgeResourceModule { }
