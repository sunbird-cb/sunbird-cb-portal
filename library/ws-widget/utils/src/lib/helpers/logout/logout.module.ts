import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule, MatDialogModule } from '@angular/material'

import { LogoutComponent } from './logout.component'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [LogoutComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    TranslateModule,
  ],
  entryComponents: [LogoutComponent],
})
export class LogoutModule { }
