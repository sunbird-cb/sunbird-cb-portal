import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MatButtonModule, MatCardModule, MatIconModule } from '@angular/material'
import { BtnPageBackComponent } from './btn-page-back.component'
import { PipeOrderByModule } from '@sunbird-cb/utils/src/public-api'

@NgModule({
  declarations: [BtnPageBackComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    PipeOrderByModule,
  ],
  exports: [BtnPageBackComponent],
  entryComponents: [BtnPageBackComponent],
})
export class BtnPageBackModule { }
