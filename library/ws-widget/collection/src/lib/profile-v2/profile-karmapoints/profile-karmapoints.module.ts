import { NgModule } from '@angular/core'
import { ProfileKarmapointsComponent } from './profile-karmapoints.component'
import {
  MatButtonModule, MatCardModule, MatChipsModule, MatDividerModule,
  MatExpansionModule, MatIconModule, MatProgressSpinnerModule,
} from '@angular/material'
import { BrowserModule } from '@angular/platform-browser'
import { PipeOrderByModule } from '@sunbird-cb/utils'

@NgModule({
  declarations: [ProfileKarmapointsComponent],
  imports: [BrowserModule, MatButtonModule, MatCardModule, MatChipsModule,
    MatDividerModule, MatExpansionModule, MatIconModule, MatProgressSpinnerModule, PipeOrderByModule],
  entryComponents: [ProfileKarmapointsComponent],
})
export class ProfileKarmapointsModule {

}
