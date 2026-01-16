import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UserLeaderboardComponent } from './user-leaderboard.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AvatarPhotoModule } from '../avatar-photo/avatar-photo.module'
import { SlidersDynamicModule } from '../../sliders-dynamic/sliders-dynamic.module'
import { PipeDurationTransformModule, PipeOrdinalModule } from '@sunbird-cb/utils-v2'
import { WeeklyClapsModule } from '../weekly-claps/weekly-claps.module'
import { TranslateModule } from '@ngx-translate/core'
import { SkeletonLoaderModule } from '../skeleton-loader/skeleton-loader.module'
import { UserProfileService } from '@ws/app/src/lib/routes/user-profile/services/user-profile.service'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

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
        PipeOrdinalModule,
    ],
    exports: [
        UserLeaderboardComponent,
    ],
    providers: [UserProfileService]
})
export class UserLeaderboardModule { }
