import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PipePublicURL } from './pipe-public-URL.pipe'

@NgModule({
  declarations: [PipePublicURL],
  imports: [
    CommonModule,
  ],
  exports: [PipePublicURL],
})
export class PipePublicURLModule { }
