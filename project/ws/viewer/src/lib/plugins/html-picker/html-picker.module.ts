import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

// import { AceEditorModule } from 'ng2-ace-editor'

import { HtmlPickerComponent } from './html-picker.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatExpansionModule } from '@angular/material/expansion'

@NgModule({
  declarations: [HtmlPickerComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    // AceEditorModule,
  ],
  exports: [
    HtmlPickerComponent,
  ],
})
export class HtmlPickerModule { }
