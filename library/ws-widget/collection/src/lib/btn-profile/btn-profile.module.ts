import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule, MatSlideToggleModule, MatDialogModule } from '@angular/material'
import { BtnProfileComponent } from './btn-profile.component'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { RouterModule } from '@angular/router'
import { LogoutModule } from '@sunbird-cb/utils'
import { AvatarPhotoModule } from '../_common/avatar-photo/avatar-photo.module'
// import { TreeCatalogModule } from '../tree-catalog/tree-catalog.module'

@NgModule({
  declarations: [BtnProfileComponent],
  imports: [
    AvatarPhotoModule,
    CommonModule,
    LogoutModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatSlideToggleModule,
    RouterModule,
    WidgetResolverModule,

  ],
  entryComponents: [BtnProfileComponent],
})
export class BtnProfileModule { }
