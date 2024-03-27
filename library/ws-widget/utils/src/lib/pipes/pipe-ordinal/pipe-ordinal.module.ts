import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PipeOrdinalPipe } from './pipe-ordinal.pipe'

@NgModule({
  declarations: [PipeOrdinalPipe],
  imports: [
    CommonModule,
  ],
  exports: [PipeOrdinalPipe],
})
export class PipeOrdinalModule { }
