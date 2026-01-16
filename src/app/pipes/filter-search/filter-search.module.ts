import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FilterSearchPipe } from './filter-search.pipe'

@NgModule({
  declarations: [FilterSearchPipe],
  imports: [
    CommonModule,
  ],
  exports: [FilterSearchPipe],
})
export class FilterSearchPipeModule { }
