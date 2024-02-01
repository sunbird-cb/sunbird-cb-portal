import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SlidersDynamicComponent } from './sliders-dynamic.component'
import { RouterModule } from '@angular/router'
import { NavigationModule, ImageResponsiveModule } from '@sunbird-cb/utils'
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser'
// tslint:disable-next-line
import  Hammer from 'hammerjs'
import { MatIconModule } from '@angular/material'
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
  ],
  exports: [SlidersDynamicComponent],
  entryComponents: [SlidersDynamicComponent],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
  ],
})
export class SlidersDynamicModule { }
