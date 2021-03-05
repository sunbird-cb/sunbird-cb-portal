import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import {
  MatButtonModule,
  MatDividerModule,
  MatToolbarModule,
  MatIconModule,
  MatChipsModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatFormFieldModule,
  MatAutocompleteModule,
} from '@angular/material'
import { BtnPageBackModule, EditorQuillModule } from '@sunbird-cb/collection'
import { QnaEditComponent } from './components/qna-edit/qna-edit.component'

@NgModule({
  declarations: [QnaEditComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    WidgetResolverModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    BtnPageBackModule,
    EditorQuillModule,
  ],
})
export class QnaEditModule { }
