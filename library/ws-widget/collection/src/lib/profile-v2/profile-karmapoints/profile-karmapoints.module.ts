import { NgModule } from '@angular/core'
import { ProfileKarmapointsComponent } from './profile-karmapoints.component'
import {
  MatButtonModule, MatCardModule, MatChipsModule, MatDividerModule,
  MatExpansionModule, MatIconModule, MatProgressSpinnerModule,
} from '@angular/material'
import { BrowserModule } from '@angular/platform-browser'
import { PipeOrderByModule } from '@sunbird-cb/utils'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [ProfileKarmapointsComponent],
  imports: [BrowserModule, MatButtonModule, MatCardModule, MatChipsModule,
    MatDividerModule, MatExpansionModule, MatIconModule, MatProgressSpinnerModule, PipeOrderByModule, TranslateModule],
  entryComponents: [ProfileKarmapointsComponent],
})
export class ProfileKarmapointsModule {

}
