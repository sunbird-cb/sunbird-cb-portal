import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SeeAllModule } from '@ws/app/src/lib/routes/see-all/seeAll.module'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SeeAllModule,
  ],
  exports: [
    SeeAllModule,
  ],
})
export class RouteSeeAllAppModule { }
