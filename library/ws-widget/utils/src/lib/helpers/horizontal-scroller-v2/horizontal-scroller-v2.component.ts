import { Component, OnInit, OnChanges, OnDestroy, Input, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core'
import {
  fromEvent,
  Subscription,
  timer,
} from 'rxjs'
import { debounceTime, throttleTime } from 'rxjs/operators'
import { TFetchStatus } from '../../constants/misc.constants'

@Component({
  selector: 'ws-utils-horizontal-scroller-v2',
  templateUrl: './horizontal-scroller-v2.component.html',
  styleUrls: ['./horizontal-scroller-v2.component.scss'],
})
export class HorizontalScrollerV2Component implements OnInit, OnChanges, OnDestroy {

  @Input()
  loadStatus: TFetchStatus = 'fetching'
  @Input()
  onHover = false
  @Input() sliderConfig = {
    showNavs: true,
    showDots: true,
  }
  @Output()
  loadNext = new EventEmitter()
  @ViewChild('horizontalScrollElem', { static: true })
  horizontalScrollElem: ElementRef | null = null

  enablePrev = false
  enableNext = false
  activeNav = 0;
  private scrollObserver: Subscription | null = null

  constructor() { }

  ngOnInit() {
    if (this.horizontalScrollElem) {
      const horizontalScrollElem = this.horizontalScrollElem
      this.scrollObserver = fromEvent(
        horizontalScrollElem.nativeElement,
        'scroll',
      )
        .pipe(debounceTime(100), throttleTime(100))
        .subscribe(_ => {
          this.updateNavigationBtnStatus(horizontalScrollElem
            .nativeElement as HTMLElement)
        })
    }
  }
  ngOnChanges() {
    timer(100).subscribe(() => {
      if (this.horizontalScrollElem) {
        this.updateNavigationBtnStatus(this.horizontalScrollElem
          .nativeElement as HTMLElement)
      }
    })
  }
  ngOnDestroy() {
    if (this.scrollObserver) {
      this.scrollObserver.unsubscribe()
    }
  }
  showPrev() {
      // const elem = this.horizontalScrollElem.nativeElement
      // elem.scrollLeft -= 0.20 * elem.clientWidth
      if (this.horizontalScrollElem) {
        // const clientWidth = (this.horizontalScrollElem.nativeElement.clientWidth * 0.24)
        const clientWidth = (this.horizontalScrollElem.nativeElement.clientWidth)
        this.horizontalScrollElem.nativeElement.scrollTo({
          left: this.horizontalScrollElem.nativeElement.scrollLeft - clientWidth,
          behavior: 'smooth',
        })

        this.activeNav--;
      }
  }
  showNext() {
      // const elem = this.horizontalScrollElem.nativeElement
      // elem.scrollLeft += 0.20 * elem.clientWidth
      if (this.horizontalScrollElem) {
        // const clientWidth = (this.horizontalScrollElem.nativeElement.clientWidth * 0.24)
        const clientWidth = (this.horizontalScrollElem.nativeElement.clientWidth)
        this.horizontalScrollElem.nativeElement.scrollTo({
          left: this.horizontalScrollElem.nativeElement.scrollLeft + clientWidth,
          behavior: 'smooth',
        })
        this.activeNav++;
      }
  }
  private updateNavigationBtnStatus(elem: HTMLElement) {
    this.enablePrev = true
    this.enableNext = true
    if (elem.scrollLeft === 0) {
      this.enablePrev = false
    }
    if (elem.scrollWidth === elem.clientWidth + elem.scrollLeft) {
      if (this.loadStatus === 'hasMore') {
        this.loadNext.emit()
      } else {
        this.enableNext = false
      }
    }
  }

  slideTo(ele:any) {
    if(ele > this.activeNav && ele != this.activeNav) {
      if (this.horizontalScrollElem) {
        const clientWidth = (this.horizontalScrollElem.nativeElement.clientWidth)
        this.horizontalScrollElem.nativeElement.scrollTo({
          left: this.horizontalScrollElem.nativeElement.scrollLeft + clientWidth,
          behavior: 'smooth',
        })
      }
      this.activeNav = ele;
    } else {
      if (this.horizontalScrollElem && ele >= 0 && ele != this.activeNav) {
        const clientWidth = (this.horizontalScrollElem.nativeElement.clientWidth)
        this.horizontalScrollElem.nativeElement.scrollTo({
          left: this.horizontalScrollElem.nativeElement.scrollLeft - clientWidth,
          behavior: 'smooth',
        })
      }
      this.activeNav = ele;
    }
    
  }

}
