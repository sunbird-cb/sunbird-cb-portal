import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BtnProfileComponent } from './btn-profile.component'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { RouterModule } from '@angular/router'
import { LogoutModule } from '@sunbird-cb/utils-v2'
import { AvatarPhotoModule } from '../_common/avatar-photo/avatar-photo.module'
import { WidgetUrlResolverDirective } from './widget-url-resolver.directive'
import { TranslateModule } from '@ngx-translate/core'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
// import { TreeCatalogModule } from '../tree-catalog/tree-catalog.module'

@NgModule({
    declarations: [BtnProfileComponent, WidgetUrlResolverDirective],
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
        TranslateModule,
    ],
    exports: [BtnProfileComponent]
})
export class BtnProfileModule { }
