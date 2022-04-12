import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CardNotifyComponent } from './card-notify.component'
import { BrowserModule } from '@angular/platform-browser'
import { MatButtonModule } from '@angular/material'

@NgModule({
  declarations: [CardNotifyComponent],
  imports: [
    CommonModule,
    BrowserModule,
    MatButtonModule,
  ],
  exports: [CardNotifyComponent],
  entryComponents: [CardNotifyComponent],
})
export class CardNotifyModule { }
