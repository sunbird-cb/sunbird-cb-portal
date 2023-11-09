import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { ICarousel } from './sliders-dynamic.model'
import { Subscription, interval } from 'rxjs'
import { EventService, WsEvents } from '@sunbird-cb/utils'

@Component({
  selector: 'ws-widget-sliders-dynamic',
  templateUrl: './sliders-dynamic.component.html',
  styleUrls: ['./sliders-dynamic.component.scss'],
})
export class SlidersDynamicComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<ICarousel> {
  @Input() widgetData!: ICarousel
  @HostBinding('id')
  public id = `banner_${Math.random()}`
  currentIndex = 0
  slideInterval: Subscription | null = null

  constructor(private events: EventService) {
    super()
  }

  ngOnInit() {
    this.reInitiateSlideInterval()
  }
  reInitiateSlideInterval() {
    if (this.widgetData && this.widgetData.sliderData.length > 1) {
      try {
        if (this.slideInterval) {
          this.slideInterval.unsubscribe()
        }
      } catch (e) {
      } finally {
        this.slideInterval = interval(8000).subscribe(() => {
          if (this.currentIndex === this.widgetData.sliderData.length - 1) {
            this.currentIndex = 0
          } else {
            this.currentIndex += 1
          }
        })
      }
    }
  }
  slideTo(index: number) {
    if (index >= 0 && index < this.widgetData.sliderData.length) {
      this.currentIndex = index
    } else if (index === this.widgetData.sliderData.length) {
      this.currentIndex = 0
    } else {
      this.currentIndex = this.widgetData.sliderData.length + index
    }
    this.reInitiateSlideInterval()
  }

  get isOpenInNewTab() {
    const currentData = this.widgetData.sliderData[this.currentIndex]
    if (currentData.redirectUrl && currentData.redirectUrl.includes('mailto') || this.widgetData.sliderData[this.currentIndex].openInNewTab) {
      return true
    } return false
  }

  openInNewTab() {
    const currentData = this.widgetData.sliderData[this.currentIndex]
    if (currentData.redirectUrl && currentData.redirectUrl.includes('mailto') || this.widgetData.sliderData[this.currentIndex].openInNewTab) {
      window.open(currentData.redirectUrl)
    }
  }
  raiseTelemetry(bannerUrl: string | undefined) {
    this.openInNewTab()
    const path = window.location.pathname.replace('/', '')
    const url = path + window.location.search

    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: 'banner',
      },
      {
        pageUrl: url,
        bannerRedirectUrl: bannerUrl,
      },
      {
        pageIdExt: 'banner',
        module: WsEvents.EnumTelemetrymodules.CONTENT,
    })
  }
}
