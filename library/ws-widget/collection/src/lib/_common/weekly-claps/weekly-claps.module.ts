import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { WeeklyClapsComponent } from './weekly-claps.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatDialogModule, MatIconModule } from '@angular/material'
import {InfoDialogModule} from './../info-dialog/info-dialog.module'
import {SkeletonLoaderModule} from './../skeleton-loader/skeleton-loader.module'

@NgModule({
  declarations: [WeeklyClapsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    InfoDialogModule,
    SkeletonLoaderModule
  ],
  exports: [
    WeeklyClapsComponent,
  ],
  entryComponents: [WeeklyClapsComponent],
})
export class WeeklyClapsModule { }