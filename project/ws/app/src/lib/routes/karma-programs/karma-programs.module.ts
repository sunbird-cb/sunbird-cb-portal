import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { KarmaProgramsMicrositeV1Component } from './karma-programs-microsite-v1/karma-programs-microsite-v1.component'
import { KarmaProgramsRoutingModule } from './karma-programs-routing.module'
import { CardsModule, CommonMethodsService, SlidersLibModule } from '@sunbird-cb/consumption'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { KarmaProgramsService } from './service/karma-programs.service'
import { ImageResponsiveModule, PipeFilterV2Module, PipeOrderByModule } from '@sunbird-cb/utils-v2'
import { BtnPageBackModule } from '@sunbird-cb/collection/src/public-api'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { HttpClient } from '@angular/common/http'
import { HttpLoaderFactory } from 'src/app/app.module'
import { KarmaProgramDataService } from './service/karma-program-data.service'
import { KarmaProgramsComponent } from './karma-programs/karma-programs.component'
import { KarmaProgramsMicrositeV2Component } from './karma-programs-microsite-v2/karma-programs-microsite-v2.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatSidenavModule } from '@angular/material/sidenav'

@NgModule({
  declarations: [
    KarmaProgramsComponent,
    KarmaProgramsMicrositeV1Component,
    KarmaProgramsMicrositeV2Component],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    KarmaProgramsRoutingModule,
    SlidersLibModule,
    CardsModule,
    MatFormFieldModule,
    MatInputModule,
    PipeOrderByModule,
    PipeFilterV2Module,
    BtnPageBackModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    ImageResponsiveModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [KarmaProgramsService, KarmaProgramDataService, CommonMethodsService],
})
export class KarmaProgramsModule { }
