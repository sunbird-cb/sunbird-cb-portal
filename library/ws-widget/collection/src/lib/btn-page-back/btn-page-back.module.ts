import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MatButtonModule, MatCardModule, MatIconModule } from '@angular/material'
import { BtnPageBackComponent } from './btn-page-back.component'
import { PipeOrderByModule } from '@sunbird-cb/utils/src/public-api'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [BtnPageBackComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    PipeOrderByModule,
    TranslateModule,
  ],
  exports: [BtnPageBackComponent],
  entryComponents: [BtnPageBackComponent],
})
export class BtnPageBackModule { }
