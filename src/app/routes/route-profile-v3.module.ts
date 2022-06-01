import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProfileV3Module } from '@ws/app/src/lib/routes/profile-v3/profile-v3.module'


@NgModule({
  imports: [
    CommonModule, ProfileV3Module],
  exports: [ProfileV3Module],
})
export class RouteProfileV3Module { }
