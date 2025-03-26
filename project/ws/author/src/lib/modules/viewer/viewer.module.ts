import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { MatSelectModule, MatFormFieldModule, MatToolbarModule } from '@angular/material'
import { ViewerComponent } from './viewer.component'
import { ViewerRoutingModule } from './viewer-routing.module'
import { PipeSafeSanitizerModule } from '@sunbird-cb/utils-v2'

@NgModule({
  declarations: [ViewerComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    ViewerRoutingModule,
    PipeSafeSanitizerModule,
  ],
  exports: [
    ViewerComponent,
  ],
})
export class AuthViewerModule { }
