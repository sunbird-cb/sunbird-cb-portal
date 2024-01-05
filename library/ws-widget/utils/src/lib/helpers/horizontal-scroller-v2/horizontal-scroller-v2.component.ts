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
  @Input() widgetsLength: any
  @Input() defaultMaxWidgets: any
  @Input() stripConfig: any
  @ViewChild('horizontalScrollElem', { static: true })
  horizontalScrollElem: ElementRef | null = null

  enablePrev = false
  enableNext = false
  activeNav = 0
  cardSubType = 'standard'
  bottomDotsArray: any = []
  private scrollObserver: Subscription | null = null

  constructor() { }

  ngOnInit() {
    this.cardSubType = this.stripConfig && this.stripConfig.cardSubType ? this.stripConfig.cardSubType : 'standard'
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

       this.getBottomDotsArray()
    }
  }
  ngOnChanges() {
    timer(100).subscribe(() => {
      if (this.horizontalScrollElem) {
        this.updateNavigationBtnStatus(this.horizontalScrollElem
          .nativeElement as HTMLElement)
      }
    })
    this.getBottomDotsArray()
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

        this.activeNav -= 1
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
        this.activeNav += 1
      }
  }
  private updateNavigationBtnStatus(elem: HTMLElement) {
    this.enablePrev = true
    this.enableNext = true
    if (elem.scrollLeft === 0) {
      this.enablePrev = false
      this.activeNav = 0
    }
    if (elem.scrollWidth === elem.clientWidth + elem.scrollLeft) {
      if (this.loadStatus === 'hasMore') {
        this.loadNext.emit()
      } else {
        this.enableNext = false
        if (this.bottomDotsArray.length) {
          this.activeNav = this.bottomDotsArray.length - 1
        }
      }
    }
    if (elem.scrollLeft !== 0 && (elem.scrollWidth !== elem.clientWidth + elem.scrollLeft)) {
      this.activeNav = Math.ceil(elem.scrollLeft / elem.clientWidth)
    }
  }

  slideTo(ele: any) {
    const diff = ele - this.activeNav
    // if (ele > this.activeNav && ele !== this.activeNav) {
    //   if (this.horizontalScrollElem) {
    //     const clientWidth = (this.horizontalScrollElem.nativeElement.clientWidth)
    //     this.horizontalScrollElem.nativeElement.scrollTo({
    //       left: this.horizontalScrollElem.nativeElement.scrollLeft + (clientWidth*diff),
    //       behavior: 'smooth',
    //     })
    //   }
    //   this.activeNav = ele
    // } else {
    //   if (this.horizontalScrollElem && ele >= 0 && ele !== this.activeNav) {
    //     const clientWidth = (this.horizontalScrollElem.nativeElement.clientWidth)
    //     this.horizontalScrollElem.nativeElement.scrollTo({
    //       left: this.horizontalScrollElem.nativeElement.scrollLeft - (clientWidth*diff),
    //       behavior: 'smooth',
    //     })
    //   }
    //   this.activeNav = ele
    // }
    if (this.horizontalScrollElem) {
      const clientWidth = (this.horizontalScrollElem.nativeElement.clientWidth)
      this.horizontalScrollElem.nativeElement.scrollTo({
        left: this.horizontalScrollElem.nativeElement.scrollLeft + (clientWidth * diff),
        behavior: 'smooth',
      })
    }
    this.activeNav = ele

  }

  getBottomDotsArray() {
    if (this.horizontalScrollElem) {
      this.bottomDotsArray = []
      let cardWidth
      let arrLength
      // console.log('this.cardSubType-->',this.cardSubType)
      if (this.cardSubType !== 'card-wide-v2') {
        cardWidth = this.cardSubType === 'standard' ? 245 :
        ((document.getElementsByClassName(this.cardSubType) &&
         document.getElementsByClassName(this.cardSubType)[0] !== undefined)
        ? document.getElementsByClassName(this.cardSubType)[0].clientWidth : 245)
        if (document.getElementsByClassName('horizontal-scroll-container') &&
        document.getElementsByClassName('horizontal-scroll-container')[0]) {
          const scrollerWidth = document.getElementsByClassName('horizontal-scroll-container')[0].clientWidth
          const totalCardsLength = cardWidth * this.widgetsLength
            if (totalCardsLength > scrollerWidth) {
              arrLength = (scrollerWidth / cardWidth)
              this.defaultMaxWidgets = this.defaultMaxWidgets ?  this.widgetsLength < this.defaultMaxWidgets ?
               this.widgetsLength : this.defaultMaxWidgets : this.defaultMaxWidgets
              arrLength = this.defaultMaxWidgets / arrLength
              for (let i = 0; i < arrLength; i += 1) {
                this.bottomDotsArray.push(i)
              }
              // console.log('this.cardSubType', this.cardSubType, arrLength, this.widgetsLength ,
              // this.defaultMaxWidgets, scrollerWidth, this.bottomDotsArray)
            }
          }
      } else {
          setTimeout(() => {
            arrLength = document.getElementsByClassName(this.cardSubType).length
            for (let i = 0; i < arrLength; i += 1) {
              this.bottomDotsArray.push(i)
            }
          },         1000)
      }

    }

  }

}
