import { NgModule, Injectable } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SlidersComponent } from './sliders.component'
import { RouterModule } from '@angular/router'
import { NavigationModule, ImageResponsiveModule } from '@sunbird-cb/utils-v2'
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser'
/* tslint:disable */
import  Hammer from 'hammerjs'
/* tslint:enable */
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
    declarations: [SlidersComponent],
    imports: [
        CommonModule,
        RouterModule,
        NavigationModule,
        ImageResponsiveModule,
    ],
    exports: [SlidersComponent],
    providers: [
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: MyHammerConfig,
        },
    ]
})
export class SlidersModule { }
