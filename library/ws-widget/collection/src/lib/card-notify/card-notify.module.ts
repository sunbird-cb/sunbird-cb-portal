import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CardNotifyComponent } from './card-notify.component'
import { BrowserModule } from '@angular/platform-browser'
import { MatButtonModule } from '@angular/material'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [CardNotifyComponent],
  imports: [
    CommonModule,
    BrowserModule,
    MatButtonModule,
    TranslateModule,
  ],
  exports: [CardNotifyComponent],
  entryComponents: [CardNotifyComponent],
})
export class CardNotifyModule { }
