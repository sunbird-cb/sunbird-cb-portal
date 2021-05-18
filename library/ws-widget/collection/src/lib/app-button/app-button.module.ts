import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule, MatCardModule, MatIconModule, MatTooltipModule } from '@angular/material'
import { RouterModule } from '@angular/router'
import { AppButtonComponent } from './app-button.component'

@NgModule({
  declarations: [AppButtonComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
  ],
  exports: [AppButtonComponent],
})
export class AppButtonModule { }
