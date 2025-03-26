import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AdminRoutingModule } from './admin-routing.module'
import { AdminComponent } from './components/admin/admin.component'
import { ExcelService } from './components/excel.service'
import {
  MatTabsModule,
  MatCardModule,
  MatDividerModule,
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatFormFieldModule,
  MatInputModule, MatSidenavModule, MatMenuModule,
} from '@angular/material'
import { UserImageModule } from '@sunbird-cb/collection'
import { FormsModule } from '@angular/forms'
import { PipeNameTransformModule, PipeCountTransformModule } from '@sunbird-cb/utils-v2'
import { ConfigurationsComponent } from './components/configurations/configurations.component'

@NgModule({
  declarations: [AdminComponent,
    ConfigurationsComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatTabsModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatTabsModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    UserImageModule,
    PipeNameTransformModule,
    FormsModule,
    PipeCountTransformModule,
    MatFormFieldModule,
    MatInputModule, MatSidenavModule, MatMenuModule,
  ],
  providers: [ExcelService],
})
export class AdminModule { }
