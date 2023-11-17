import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SkeletonLoaderComponent } from './skeleton-loader.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatDialogModule, MatIconModule } from '@angular/material'

@NgModule({
  declarations: [SkeletonLoaderComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
  ],
  exports: [
    SkeletonLoaderComponent,
  ],
  entryComponents: [SkeletonLoaderComponent],
})
export class SkeletonLoaderModule { }
