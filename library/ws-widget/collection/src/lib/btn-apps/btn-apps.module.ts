import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { BtnAppsComponent } from './btn-apps.component'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatRippleModule } from '@angular/material/core'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'

@NgModule({
    declarations: [BtnAppsComponent],
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatRippleModule,
        WidgetResolverModule,
    ],
    exports: [BtnAppsComponent]
})
export class BtnAppsModule { }
