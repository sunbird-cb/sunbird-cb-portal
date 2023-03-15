import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PipeEmailPipe } from './pipe-email.pipe'

@NgModule({
  declarations: [PipeEmailPipe],
  imports: [
    CommonModule,
  ],
  exports: [PipeEmailPipe],
})
export class PipeEmailModule { }
