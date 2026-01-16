import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GridLayoutComponent } from './grid-layout.component'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { FormsModule } from '@angular/forms'
import { NPSGridService } from './nps-grid.service'
import { TranslateModule } from '@ngx-translate/core'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar'

@NgModule({
    declarations: [GridLayoutComponent],
    imports: [CommonModule, WidgetResolverModule, MatFormFieldModule,
        MatButtonModule, MatIconModule, FormsModule, TranslateModule, MatSnackBarModule],
    exports: [GridLayoutComponent],
    providers: [
        NPSGridService,
    ]
})
export class GridLayoutModule { }
