import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadAppComponent } from '../component/download-app/download-app.component';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.module';


@NgModule({
  declarations: [DownloadAppComponent],
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

  ],
  exports: [
    DownloadAppComponent
  ]
})
export class SharedModule { }
