import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CatalogSelectComponent } from '../catalog-select/catalog-select.component'
import { MatTreeModule } from '@angular/material/tree'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'

@NgModule({
    declarations: [CatalogSelectComponent],
    imports: [
        CommonModule,
        MatTreeModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
    ],
    exports: [CatalogSelectComponent]
})
export class CatalogSelectModule { }
