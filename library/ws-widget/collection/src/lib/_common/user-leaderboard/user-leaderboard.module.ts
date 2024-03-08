import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UserLeaderboardComponent } from './user-leaderboard.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatDialogModule, MatIconModule, MatTooltipModule } from '@angular/material'
import { AvatarPhotoModule } from '../avatar-photo/avatar-photo.module'
import { SlidersDynamicModule } from '../../sliders-dynamic/sliders-dynamic.module'
import { PipeDurationTransformModule } from '@sunbird-cb/utils/src/public-api'
import { WeeklyClapsModule } from '../weekly-claps/weekly-claps.module'
import { TranslateModule } from '@ngx-translate/core'
import { SkeletonLoaderModule } from '../skeleton-loader/skeleton-loader.module'
import { UserProfileService } from '@ws/app/src/lib/routes/user-profile/services/user-profile.service'

@NgModule({
  declarations: [UserLeaderboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    AvatarPhotoModule,
    SlidersDynamicModule,
    PipeDurationTransformModule,
    WeeklyClapsModule,
    TranslateModule,
    MatTooltipModule,
    SkeletonLoaderModule,
    AvatarPhotoModule,
  ],
  exports: [
    UserLeaderboardComponent,
  ],
  providers: [UserProfileService],
  entryComponents: [UserLeaderboardComponent],
})
export class UserLeaderboardModule { }
