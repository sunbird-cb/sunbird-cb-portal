import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { KarmaProgramsComponent } from './karma-programs/karma-programs.component'
import { KarmaProgramsMicrositeComponent } from './karma-programs-microsite/karma-programs-microsite.component'
import { KarmaProgramsRoutingModule } from './karma-programs-routing.module'
import { CardsModule, CommonMethodsService, SlidersLibModule } from '@sunbird-cb/consumption'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatProgressSpinnerModule, MatSelectModule, MatSidenavModule } from '@angular/material'
import { KarmaProgramsService } from './service/karma-programs.service'
import { PipeFilterV2Module, PipeOrderByModule } from '@sunbird-cb/utils-v2'
import { BtnPageBackModule } from '@sunbird-cb/collection/src/public-api'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { HttpClient } from '@angular/common/http'
import { HttpLoaderFactory } from 'src/app/app.module'

@NgModule({
  declarations: [KarmaProgramsComponent, KarmaProgramsMicrositeComponent],
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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [KarmaProgramsService, CommonMethodsService],
})
export class KarmaProgramsModule { }
