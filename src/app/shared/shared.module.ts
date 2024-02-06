import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DownloadAppComponent } from '../component/download-app/download-app.component'

@NgModule({
  declarations: [DownloadAppComponent],
  imports: [
    CommonModule,
  ],
  exports: [
    DownloadAppComponent,
  ],
})
export class SharedModule { }
