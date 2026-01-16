import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AppTourDialogComponent } from './app-tour-dialog.component'
import { RouterModule } from '@angular/router'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatIconModule } from '@angular/material/icon'

@NgModule({
    declarations: [AppTourDialogComponent],
    imports: [
        CommonModule,
        MatDialogModule, MatButtonModule,
        MatIconModule,
        RouterModule,
    ]
})
export class AppTourDialogModule { }
