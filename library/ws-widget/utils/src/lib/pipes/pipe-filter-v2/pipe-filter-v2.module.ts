import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PipeFilterV2Pipe } from './pipe-filter-v2.pipe'

@NgModule({
  declarations: [PipeFilterV2Pipe],
  imports: [
    CommonModule,
  ],
  exports: [PipeFilterV2Pipe],
})
export class PipeFilterV2Module { }
