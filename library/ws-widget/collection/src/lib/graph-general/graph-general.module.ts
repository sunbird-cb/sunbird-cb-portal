import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GraphGeneralComponent } from './graph-general.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'

@NgModule({
    declarations: [GraphGeneralComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule]
})
export class GraphGeneralModule {}
