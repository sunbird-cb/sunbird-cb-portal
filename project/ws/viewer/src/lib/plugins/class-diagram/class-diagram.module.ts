import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { DragDropModule } from '@angular/cdk/drag-drop'
import { ScrollingModule } from '@angular/cdk/scrolling'

import { PipeDurationTransformModule } from '@sunbird-cb/utils-v2'

import { ClassDiagramComponent } from './class-diagram.component'
import { ClassDiagramResultComponent } from './components/class-diagram-result/class-diagram-result.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table'

@NgModule({
  declarations: [ClassDiagramComponent, ClassDiagramResultComponent],
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    DragDropModule,
    PipeDurationTransformModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatTableModule,
  ],
  exports: [
    ClassDiagramComponent,
  ],
})
export class ClassDiagramModule { }
