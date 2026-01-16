import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PublicExtTocComponent } from './public-ext-toc.component'
import { RouterModule } from '@angular/router'
import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'
import { AppTocModule } from '@ws/app/src/public-api'
import { BtnPageBackNavModule } from '@sunbird-cb/collection/src/public-api'

@NgModule({
    declarations: [PublicExtTocComponent],
    imports: [
        CommonModule,
        RouterModule,
        AppTocModule,
        BtnPageBackNavModule,
    ],
    exports: [PublicExtTocComponent],
    providers: [AppTocService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PublicExtTocModule { }
