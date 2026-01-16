import { NgModule, Injectable } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser'
import { RouterModule } from '@angular/router'

import { NavigationModule, ImageResponsiveModule } from '@sunbird-cb/utils-v2'
import { SlidersDynamicComponent } from './sliders-dynamic.component'
// tslint:disable-next-line
import  Hammer from 'hammerjs'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement) {
    const mc = new Hammer(element, {
      touchAction: 'pan-y',
    })
    return mc
  }
}

// tslint:disable-next-line: max-classes-per-file
@NgModule({
    declarations: [SlidersDynamicComponent],
    imports: [
        CommonModule,
        RouterModule,
        NavigationModule,
        ImageResponsiveModule,
        MatIconModule,
        MatTooltipModule,
    ],
    exports: [SlidersDynamicComponent],
    providers: [
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: MyHammerConfig,
        },
    ]
})
export class SlidersDynamicModule { }
