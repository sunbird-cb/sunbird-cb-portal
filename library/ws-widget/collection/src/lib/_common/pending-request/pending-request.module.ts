import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PendingRequestComponent } from './pending-request.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AvatarPhotoModule } from './../avatar-photo/avatar-photo.module'
import { SkeletonLoaderModule } from '../skeleton-loader/skeleton-loader.module'
import { TranslateModule } from '@ngx-translate/core'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatIconModule } from '@angular/material/icon'

@NgModule({
    declarations: [PendingRequestComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatIconModule,
        AvatarPhotoModule,
        SkeletonLoaderModule,
        TranslateModule,
    ],
    exports: [
        PendingRequestComponent,
    ]
})
export class PendingRequestModule { }
