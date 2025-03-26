import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatTabsModule,
} from '@angular/material'
import { MatRadioModule } from '@angular/material/radio'
import { DefaultThumbnailModule, PipeDurationTransformModule, PipePublicURLModule } from '@sunbird-cb/utils-v2'
import { DisplayContentTypeModule } from '../_common/display-content-type/display-content-type.module'
import { PickerContentComponent } from './picker-content.component'

@NgModule({
  declarations: [PickerContentComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DefaultThumbnailModule,
    PipeDurationTransformModule,
    // material modules
    MatButtonModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    DisplayContentTypeModule,
    MatSelectModule,
    MatTabsModule,
    MatRadioModule,
    PipePublicURLModule,
  ],
  exports: [PickerContentComponent],
})
export class PickerContentModule {}
