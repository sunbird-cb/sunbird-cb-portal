import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BrowseByCompetencyModule } from '@ws/app'

@NgModule({
  imports: [CommonModule, BrowseByCompetencyModule],
  exports: [BrowseByCompetencyModule],
})
export class RouteBrowseCompetencyModule {

}
