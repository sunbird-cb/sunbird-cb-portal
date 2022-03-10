import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PipeFilterV3Pipe } from './pipe-filter-v3.pipe'

@NgModule({
  declarations: [PipeFilterV3Pipe],
  imports: [
    CommonModule,
  ],
  exports: [PipeFilterV3Pipe],
})
export class PipeFilterV3Module { }
