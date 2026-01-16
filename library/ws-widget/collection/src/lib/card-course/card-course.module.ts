import { NgModule } from '@angular/core'
import { CardCourseComponent } from './card-course.component'
import { BrowserModule } from '@angular/platform-browser'
import { AvatarPhotoModule } from '../_common/avatar-photo/avatar-photo.module'
import { HorizontalScrollerModule, PipeNameTransformModule } from '@sunbird-cb/utils-v2'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'

@NgModule({
    declarations: [CardCourseComponent],
    imports: [BrowserModule, MatButtonModule, MatCardModule, MatChipsModule, MatDividerModule, MatProgressBarModule,
        MatExpansionModule, MatIconModule, MatProgressSpinnerModule, AvatarPhotoModule, HorizontalScrollerModule, PipeNameTransformModule]
})
export class CardCourseModule {

}
