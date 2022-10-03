import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PipeCertificateImageURL } from './pipe-certimage-URL.pipe'

@NgModule({
  declarations: [PipeCertificateImageURL],
  imports: [
    CommonModule,
  ],
  exports: [PipeCertificateImageURL],
})
export class PipeCertificateImageURLModule { }
