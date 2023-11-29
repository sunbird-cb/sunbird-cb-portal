import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AttendanceHelperComponent } from './attendance-helper.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatFormFieldModule,
  MatInputModule,
  MatSnackBarModule,
  MatCardModule,
  MatMenuModule,
} from '@angular/material'
import { HttpClient } from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { HttpLoaderFactory } from 'src/app/app.module'

@NgModule({
  declarations: [AttendanceHelperComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatMenuModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

  ],
  exports: [AttendanceHelperComponent],
  entryComponents: [AttendanceHelperComponent],
})
export class AttendanceHelperModule { }
