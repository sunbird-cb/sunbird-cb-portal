import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TaxonomyModule } from '@ws/app'

@NgModule({
  imports: [CommonModule, TaxonomyModule],
  exports: [TaxonomyModule],
})
export class RouteTaxonomyModule {

}
