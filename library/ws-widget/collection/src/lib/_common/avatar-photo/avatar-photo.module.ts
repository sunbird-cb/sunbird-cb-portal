import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MatButtonModule, MatIconModule, MatMenuModule, MatRippleModule } from '@angular/material'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { AvatarPhotoComponent } from './avatar-photo.component'
import { PipeCertificateImageURLModule } from '@sunbird-cb/utils-v2'

@NgModule({
  declarations: [AvatarPhotoComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatRippleModule,
    WidgetResolverModule,
    PipeCertificateImageURLModule,
],
  exports: [AvatarPhotoComponent],
  entryComponents: [AvatarPhotoComponent],
})
export class AvatarPhotoModule { }
