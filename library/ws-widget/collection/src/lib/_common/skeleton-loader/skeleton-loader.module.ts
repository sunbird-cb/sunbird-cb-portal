import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SkeletonLoaderComponent } from './skeleton-loader.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatIconModule } from '@angular/material/icon'

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
    ]
})
export class SkeletonLoaderModule { }
