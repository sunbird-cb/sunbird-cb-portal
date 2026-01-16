import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GalleryViewComponent } from './gallery-view.component'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { HorizontalScrollerModule } from '@sunbird-cb/utils-v2'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatIconModule } from '@angular/material/icon'

@NgModule({
    declarations: [GalleryViewComponent],
    imports: [CommonModule, WidgetResolverModule, HorizontalScrollerModule, MatIconModule, MatCardModule],
    exports: [GalleryViewComponent]
})
export class GalleryViewModule { }
