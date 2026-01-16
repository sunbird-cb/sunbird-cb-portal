import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  PipeFilterModule,
  PipeHtmlTagRemovalModule,
  PipeOrderByModule,
  PipeRelativeTimeModule,
  PipeFilterSearchModule,
  PipeEmailModule,
} from '@sunbird-cb/utils-v2'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatDividerModule } from '@angular/material/divider'
import { WidgetResolverModule } from '@sunbird-cb/resolver'

import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { AvatarPhotoModule, BtnPageBackModule } from '@sunbird-cb/collection'
import { EditorSharedModule } from '@ws/author/src/lib/routing/modules/editor/shared/shared.module'
// import { CkEditorModule } from 'library/ws-widget/collection/src/lib/_common/ck-editor/ck-editor.module'
import { LoaderService } from '@ws/author/src/lib/services/loader.service'
import { InitResolveService } from './resolvers/init-resolve.service'
import { RouterModule } from '@angular/router'

import { NetworkV2RoutingModule } from './network-v2-routing.module'
import { NetworkComponent } from './routes/network/network.component'
import { NetworkHomeComponent } from './routes/network-home/network-home.component'
import { LeftMenuComponent } from './components/left-menu/left-menu.component'
import { ConnectionRequestCardComponent } from './components/connection-request-card/connection-request-card.component'
import { ConnectionPeopleCardComponent } from './components/connection-people-card/connection-people-card.component'
import { RecommendedResolveService } from './resolvers/recommended-resolve.service'
import { NetworkMyConnectionComponent } from './routes/network-my-connection/network-my-connection.component'
import { MyConnectionResolveService } from './resolvers/my-connection-resolve.service'
import { MyConnectionCardComponent } from './components/my-connection-card/my-connection-card.component'
import { NetworkMyMdoComponent } from './routes/network-my-mdo/network-my-mdo.component'
import { NetworkRecommendedComponent } from './routes/network-recommended/network-recommended.component'
import { NetworkConnectionRequestsComponent } from './routes/network-connection-requests/network-connection-requests.component'
import { ConnectionRequestResolveService } from './resolvers/connection-request-resolve.service'
import { ConnectionSearchCardComponent } from './components/connection-search-card/connection-search-card.component'
import { ConnectionRecommendedCardComponent } from './components/connection-recommended-card/connection-recommended-card.component'
import { ConnectionHoverCardComponent } from './components/connection-hover-card/connection-hover-card.component'
import { ConnectionHoverService } from './components/connection-name/connection-hover.servive'
import { ConnectionNameComponent } from './components/connection-name/connection-name.component'
import { TooltipDirective } from './directives/tooltip.directive'
import { TranslateModule } from '@ngx-translate/core'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatSidenavModule } from '@angular/material/sidenav'

@NgModule({
  declarations: [
    NetworkComponent,
    NetworkHomeComponent,
    LeftMenuComponent,
    ConnectionRequestCardComponent,
    ConnectionPeopleCardComponent,
    NetworkMyConnectionComponent,
    MyConnectionCardComponent,
    NetworkMyMdoComponent,
    NetworkRecommendedComponent,
    NetworkConnectionRequestsComponent,
    ConnectionSearchCardComponent,
    ConnectionRecommendedCardComponent,
    ConnectionHoverCardComponent,
    ConnectionNameComponent,
    TooltipDirective,
  ],
  imports: [
    CommonModule,
    NetworkV2RoutingModule,
    WidgetResolverModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
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
    PipeFilterSearchModule,
    PipeEmailModule,
    AvatarPhotoModule,
    EditorSharedModule,
    // CkEditorModule,
    PipeOrderByModule,
    BtnPageBackModule,
    WidgetResolverModule,
    TranslateModule,
  ],
  providers: [
    LoaderService,
    InitResolveService,
    RecommendedResolveService,
    ConnectionRequestResolveService,
    MyConnectionResolveService,
    ConnectionHoverService,
  ],
})
export class NetworkV2Module { }
