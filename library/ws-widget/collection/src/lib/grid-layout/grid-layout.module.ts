import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GridLayoutComponent } from './grid-layout.component'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { MatButtonModule, MatFormFieldModule, MatIconModule } from '@angular/material'
import { FormsModule } from '@angular/forms'
import { NPSGridService } from './nps-grid.service'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [GridLayoutComponent],
  imports: [CommonModule, WidgetResolverModule, MatFormFieldModule, MatButtonModule, MatIconModule, FormsModule, TranslateModule],
  exports: [GridLayoutComponent],
  entryComponents: [GridLayoutComponent],
  providers: [
    NPSGridService,
  ],
})
export class GridLayoutModule { }
