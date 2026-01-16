import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { InfoDialogComponent } from './info-dialog.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatIconModule } from '@angular/material/icon'
@NgModule({
    declarations: [InfoDialogComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatIconModule,
    ],
    exports: [
        InfoDialogComponent,
    ]
})
export class InfoDialogModule { }
