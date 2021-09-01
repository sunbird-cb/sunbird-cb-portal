import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BrowseByProviderModule } from '@ws/app'

@NgModule({
  imports: [CommonModule, BrowseByProviderModule],
  exports: [BrowseByProviderModule],
})
export class RouteBrowseProviderModule { }
