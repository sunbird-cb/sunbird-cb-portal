import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GridLayoutComponent } from './grid-layout.component'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { MatButtonModule, MatFormFieldModule, MatIconModule } from '@angular/material'
import { FormsModule } from '@angular/forms'

@NgModule({
  declarations: [GridLayoutComponent],
  imports: [CommonModule, WidgetResolverModule, MatFormFieldModule, MatButtonModule, MatIconModule, FormsModule],
  exports: [GridLayoutComponent],
  entryComponents: [GridLayoutComponent],
})
export class GridLayoutModule { }
