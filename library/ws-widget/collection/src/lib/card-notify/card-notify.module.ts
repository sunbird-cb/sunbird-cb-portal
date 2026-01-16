import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CardNotifyComponent } from './card-notify.component'
import { BrowserModule } from '@angular/platform-browser'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
    declarations: [CardNotifyComponent],
    imports: [
        CommonModule,
        BrowserModule,
        MatButtonModule,
        TranslateModule,
    ],
    exports: [CardNotifyComponent]
})
export class CardNotifyModule { }
