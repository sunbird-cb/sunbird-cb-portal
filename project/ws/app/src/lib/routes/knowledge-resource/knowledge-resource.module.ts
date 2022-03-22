import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { KnowledgeResourceRoutingModule } from './knowledge-resource-routing.module'
import { KnowledgeAllComponent } from './routes/knowledge-all/knowledge-all.component'
import { KnowledgeHomeComponent } from './routes/knowledge-home/knowledge-home.component'
import { MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatSidenavModule } from '@angular/material'
import { LeftMenuComponent } from './components/left-menu/left-menu.component'
import { KnowledgeCardComponent } from './components/knowledge-card/knowledge-card.component'
import { KnowledgeSavedComponent } from './routes/knowledge-saved/knowledge-saved.component'
import { BtnPageBackModule } from '@sunbird-cb/collection'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { KnowledgeDetailComponent } from './routes/knowledge-detail/knowledge-detail.component'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { PipeSafeSanitizerModule } from '@sunbird-cb/utils'
import { MatExpansionModule } from '@angular/material/expansion'

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
    Ng2SearchPipeModule,
    PipeSafeSanitizerModule,
    MatExpansionModule,
  ],
})
export class KnowledgeResourceModule { }
