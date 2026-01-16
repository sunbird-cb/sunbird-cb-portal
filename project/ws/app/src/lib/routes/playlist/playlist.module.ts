import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import {
  BtnPageBackModule,
  BtnPlaylistModule,
  DisplayContentsModule,
  DisplayContentTypeModule,
  PickerContentModule,
  TourModule,
  // EmailInputModule,
  TreeCatalogModule,
  UserAutocompleteModule,
  UserImageModule,
  ContentPickerV2Module,
  BtnLinkedinShareModule,
  BtnFacebookShareModule,
  BtnTwitterShareModule,
} from '@sunbird-cb/collection'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { DefaultThumbnailModule, PipeDurationTransformModule } from '@sunbird-cb/utils-v2'
import { PlaylistCardComponent } from './components/playlist-card/playlist-card.component'
import { PlaylistContentDeleteDialogComponent } from './components/playlist-content-delete-dialog/playlist-content-delete-dialog.component'
import { PlaylistContentDeleteErrorDialogComponent } from './components/playlist-content-delete-error-dialog/playlist-content-delete-error-dialog.component'
import { PlaylistDeleteDialogComponent } from './components/playlist-delete-dialog/playlist-delete-dialog.component'
import { PlaylistShareDialogComponent } from './components/playlist-share-dialog/playlist-share-dialog.component'
import { FilterPlaylistPipe } from './pipes/filter-playlist.pipe'
import { PlaylistRoutingModule } from './playlist-routing.module'
import { PlaylistCreateComponent } from './routes/playlist-create/playlist-create.component'
import { PlaylistDetailComponent } from './routes/playlist-detail/playlist-detail.component'
import { PlaylistEditComponent } from './routes/playlist-edit/playlist-edit.component'
import { PlaylistHomeComponent } from './routes/playlist-home/playlist-home.component'
import { PlaylistNotificationComponent } from './routes/playlist-notification/playlist-notification.component'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatRippleModule } from '@angular/material/core'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
@NgModule({
    declarations: [
        PlaylistCardComponent,
        PlaylistContentDeleteDialogComponent,
        PlaylistDeleteDialogComponent,
        PlaylistHomeComponent,
        PlaylistEditComponent,
        PlaylistNotificationComponent,
        PlaylistDetailComponent,
        FilterPlaylistPipe,
        PlaylistCreateComponent,
        PlaylistShareDialogComponent,
        PlaylistContentDeleteErrorDialogComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PlaylistRoutingModule,
        BtnPlaylistModule,
        BtnPageBackModule,
        WidgetResolverModule,
        DisplayContentTypeModule,
        PickerContentModule,
        PipeDurationTransformModule,
        DragDropModule,
        // EmailInputModule,
        TreeCatalogModule,
        DefaultThumbnailModule,
        DisplayContentsModule,
        UserImageModule,
        UserAutocompleteModule,
        TourModule,
        ContentPickerV2Module,
        // material imports
        MatIconModule,
        MatInputModule,
        MatTabsModule,
        MatRippleModule,
        MatButtonModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatMenuModule,
        MatDialogModule,
        MatCardModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatTooltipModule,
        MatProgressBarModule,
        BtnLinkedinShareModule,
        BtnFacebookShareModule,
        BtnTwitterShareModule,
    ]
})
export class PlaylistModule { }
