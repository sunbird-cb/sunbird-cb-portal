import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { SignupAutoRoutingModule } from './signup-auto-routing.module'
import { SignupAutoComponent } from './signup-auto.component'
import { SignupAutoService } from './signup-auto.service'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'

@NgModule({
  declarations: [SignupAutoComponent],
  imports: [
    CommonModule,
    SignupAutoRoutingModule,
    MatProgressSpinnerModule,
  ],
  providers: [SignupAutoService],
})
export class SignupAutoModule { }
