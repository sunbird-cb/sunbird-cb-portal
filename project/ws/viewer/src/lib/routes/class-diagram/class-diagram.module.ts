import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { ClassDiagramComponent } from './class-diagram.component'
import { ClassDiagramRoutingModule } from './class-diagram-routing.module'
import { ClassDiagramModule as ClassDiagramViewContainerModule } from '../../route-view-container/class-diagram/class-diagram.module'
@NgModule({
  declarations: [ClassDiagramComponent],
  imports: [
    CommonModule,
    MatCardModule,
    ClassDiagramViewContainerModule,
    ClassDiagramRoutingModule,
  ],
})
export class ClassDiagramModule { }
