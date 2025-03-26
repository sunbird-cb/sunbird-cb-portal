import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule, TitleCasePipe } from '@angular/common'

import { MatFormFieldModule, MatIconModule, MatCheckboxModule, MatInputModule, MatSelectModule, MatSidenavModule, MatBottomSheetModule, MatRadioModule, MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material'
import { GyaanKarmayogiRoutingModule } from './gyaan-karmayogi-routing.module'
import { GyaanKarmayogiHomeComponent } from './components/gyaan-karmayogi-home/gyaan-karmayogi-home.component'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { HttpClient } from '@angular/common/http'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { BtnPageBackModule, ContentStripWithTabsModule } from '@sunbird-cb/collection/src/public-api'
import { PdfModule } from '@ws/viewer/src/lib/routes/pdf/pdf.module'
import { GyaanPlayerComponent } from './components/gyaan-player/gyaan-player.component'
import { GyaanKarmayogiComponent } from './gyaan-karmayogi.component'
import { ViewerResolve } from '@ws/viewer/src/lib/viewer.resolve'
import { PdfScormDataService } from '@ws/viewer/src/lib/pdf-scorm-data-service'
import { GyaanKarmayogiViewAllComponent } from './components/gyaan-karmayogi-view-all/gyaan-karmayogi-view-all.component'
import { DefaultThumbnailModule } from '@sunbird-cb/utils-v2'
import { CardContentV2Module } from '@sunbird-cb/collection/src/lib/card-content-v2/card-content-v2.module'
import { GyaanKarmayogiService } from './services/gyaan-karmayogi.service'
import { PdfComponent } from './components/players/pdf/pdf.component'
import { GyaanVideoComponent } from './components/players/gyaan-video/gyaan-video.component'
import { VideoModule } from '@ws/viewer/src/lib/routes/video/video.module'
import { ViewerDataService } from '@ws/viewer/src/public-api'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SkeletonLoaderModule } from '@sunbird-cb/collection/src/lib/_common/skeleton-loader/skeleton-loader.module'
import { ShareTocModule } from '../app-toc/share-toc/share-toc.module'
import { GyaanFilterComponent } from './components/gyaan-filter/gyaan-filter.component'
import { GyaanAudioComponent } from './components/players/gyaan-audio/gyaan-audio.component'
import { AudioModule } from '@ws/viewer/src/lib/routes/audio/audio.module'
import { YoutubeModule } from '@ws/viewer/src/lib/routes/youtube/youtube.module'
import { GyaanYoutubeComponent } from './components/players/gyaan-youtube/gyaan-youtube.component'
import { InfiniteScrollModule } from 'ngx-infinite-scroll'
import { ReplaceNbspTextPipe } from './pipes/replace-nbsp-text.pipe'

// tslint:disable-next-line:function-name
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http)
}

@NgModule({
  declarations: [GyaanKarmayogiHomeComponent, GyaanPlayerComponent,
    GyaanKarmayogiComponent, GyaanKarmayogiViewAllComponent,
     PdfComponent, GyaanVideoComponent, GyaanFilterComponent, GyaanAudioComponent, GyaanYoutubeComponent, ReplaceNbspTextPipe],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    GyaanKarmayogiRoutingModule,
    DefaultThumbnailModule,
    ContentStripWithTabsModule,
    MatCheckboxModule,
    CardContentV2Module,
    PdfModule,
    VideoModule,
    AudioModule,
    YoutubeModule,
    MatSidenavModule,
    ReactiveFormsModule,
    SkeletonLoaderModule,
    BtnPageBackModule,
    ShareTocModule,
    MatBottomSheetModule,
    MatRadioModule,
    InfiniteScrollModule,
   TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  entryComponents: [
    GyaanFilterComponent,
    GyaanKarmayogiViewAllComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
     { provide: MatBottomSheetRef, useValue: {} },
     ViewerResolve, TitleCasePipe,
     PdfScormDataService, GyaanKarmayogiService,
      ViewerDataService],
})
export class GyaanKarmayogiModule { }
