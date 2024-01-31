import { HttpClient } from '@angular/common/http'
import { Component, OnInit, Input, OnDestroy } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { ConfigurationsService } from '@sunbird-cb/utils/src/lib/services/configurations.service'
import { IUserProfileDetailsFromRegistry } from '@ws/app/src/lib/routes/user-profile/models/user-profile.model'
import { Observable, Subscription } from 'rxjs'
import { map } from 'rxjs/operators'
import { Router } from '@angular/router'
import {
  IGridLayoutData,
  IGridLayoutProcessedData,
  responsiveSuffix,
  sizeSuffix,
  IGridLayoutDataMain,
} from './grid-layout.model'
// tslint:disable-next-line
import _ from 'lodash'
import { NPSGridService } from './nps-grid.service'
import { EventService, WsEvents } from '@sunbird-cb/utils/src/public-api'

const API_END_POINTS = {
  fetchProfileById: (id: string) => `/apis/proxies/v8/api/user/v2/read/${id}`,
}

@Component({
  selector: 'ws-widget-grid-layout',
  templateUrl: './grid-layout.component.html',
  styleUrls: ['./grid-layout.component.scss'],
})

export class GridLayoutComponent extends WidgetBaseComponent
  implements OnInit, OnDestroy, NsWidgetResolver.IWidgetData<IGridLayoutDataMain> {
    constructor(
      private router: Router,
      private events: EventService,
      private configSvc: ConfigurationsService,
      private http: HttpClient,
      private npsService: NPSGridService,
    ) {
      super()
    }

  @Input() widgetData!: IGridLayoutDataMain
  containerClass = ''
  processed: IGridLayoutProcessedData[][] = []
  isNudgeOpen = true

  // NPS
  updateTelemetryDataSubscription: Subscription | null = null
  isNPSOpen = false
  ratingGiven: any
  onSuccessRating = false
  phtext: any
  reviewText: any
  formID: any
  feedID: any
  formFields: any
  ratingList = [
    {
      value:  1,
      image: '/assets/images/nps/Rating_1@2x.svg',
      showImage: false,
    },
    {
      value:  2,
      image: '/assets/images/nps/Rating_2@2x.svg',
      showImage: false,
    },
    {
      value:  3,
      image: '/assets/images/nps/Rating_3@2x.svg',
      showImage: false,
    },
    {
      value:  4,
      image: '/assets/images/nps/Rating_4@2x.svg',
      showImage: false,
    },
    {
      value:  5,
      image: '/assets/images/nps/Rating_5@2x.svg',
      showImage: false,
    },
  ]
  fullMenuHeight = false
  ngOnInit() {
    this.configSvc.changeNavBarFullView.subscribe((data: any) => {
      // console.log('data-->', data)
      this.fullMenuHeight = data
    })
    if (this.configSvc.unMappedUser && this.configSvc.unMappedUser.id) {
      this.fetchProfileById(this.configSvc.unMappedUser.id).subscribe(x => {
        // console.log(x.profileDetails, "x.profileDetails====")
        // if (x.profileDetails.mandatoryFieldsExists) {
        //   this.isNudgeOpen = false
        // }
        if (x && x.profileDetails && x.profileDetails.personalDetails && x.profileDetails.personalDetails.phoneVerified) {
          this.isNudgeOpen = false
        }
      })
    }

    this.updateTelemetryDataSubscription = this.npsService.updateTelemetryDataObservable.subscribe((value: any) => {
      if (value) {
        if (localStorage.getItem('ratingformID')) {
          this.isNPSOpen = true

          if (this.isNPSOpen) {
            this.configSvc.updatePlatformRatingMethod({ bottom: '190px' })
          }
          this.formID = localStorage.getItem('ratingformID')
          this.npsService.getFormData(this.formID).subscribe((resform: any) => {
            if (resform) {
              this.formFields = resform.fields
            }
          })
          this.raisePlatformRatingStartTelemetry()
        }
        if (localStorage.getItem('ratingfeedID')) {
          this.feedID = localStorage.getItem('ratingfeedID')
        }
        // this.npsService.getFeedStatus(this.configSvc.unMappedUser.id).subscribe((res: any) => {
        //   if (res.result.response.userFeed && res.result.response.userFeed.length > 0) {
        //     const feed = res.result.response.userFeed
        //     feed.forEach((item: any) => {
        //       if (item.category === 'NPS' && item.data.actionData.formId) {
        //         this.isNPSOpen = true
        //         this.formID = item.data.actionData.formId
        //         this.feedID = item.id

        //         this.npsService.getFormData(this.formID).subscribe((resform: any) => {
        //           if (resform) {
        //             this.formFields = resform.fields
        //           }
        //         })
        //       }
        //     })
        //   }
        // })
      }
    })

    if (this.widgetData.gutter != null) {
      this.containerClass = `-mx-${this.widgetData.gutter}`
    }
    const gutterAdjustment = this.widgetData.gutter !== null ? `p-${this.widgetData.gutter}` : ''
    this.processed = this.widgetData.widgets.map(row =>
      row.map(
        (col: IGridLayoutData): IGridLayoutProcessedData => ({
          className: Object.entries(col.dimensions).reduce(
            (agg, [k, v]) =>
              `${agg} ${(responsiveSuffix as { [id: string]: string })[k]}:${sizeSuffix[v]}`,
            `${col.className} w-full ${gutterAdjustment}`,
          ),
          styles: col.styles,
          widget: col.widget,
        }),
      ),
    )
  }

  ngOnDestroy(): void {
    if (this.updateTelemetryDataSubscription) {
      this.updateTelemetryDataSubscription.unsubscribe()
    }
  }

  remindlater() {
    this.isNudgeOpen = false
  }
  tracker(index: number, item: any) {
    if (index >= 0) { }
    return item
  }
  tracker2(index: number, item: any) {
    if (index >= 0) { }
    return item
  }

  fetchProfileById(id: any): Observable<any> {
    return this.http.get<[IUserProfileDetailsFromRegistry]>(API_END_POINTS.fetchProfileById(id))
      .pipe(map((res: any) => {
        return _.get(res, 'result.response')
      }))
  }
  fetchProfile() {
    this.router.navigate(['/app/user-profile/details'])
  }

  // NPS
  toggleImg(rating: any) {
    this.ratingList.forEach((r: any) => {
      if (rating.value === r.value) {
        r.showImage = true
        this.ratingGiven = r
        this.configSvc.updatePlatformRatingMethod({ bottom: '190px' })
        if (rating.value < 4) {
          this.phtext = 'How can we make it better for you next time?'
        } else  {
          this.phtext = 'Inspire others by sharing your positive experience'
        }
        // console.log('ratingGiven', this.ratingGiven)
      } else {
        r.showImage = false
      }
    })
  }

  showPRImage(rating: any) {
    this.ratingList.forEach((r: any) => {
      if (rating.value === r.value) {
        r.showImage = true
      }
      if (rating.value !== r.value && this.ratingGiven !== r) {
        r.showImage = false
      }
    })
  }

  unshowPRImage(rating: any) {
    this.ratingList.forEach((r: any) => {
      if (rating.value === r.value && this.ratingGiven !== r) {
        r.showImage = false
      }
    })
  }

  submitRating(value: any) {
    const currenttimestamp = new Date().getTime()
    const reqbody = {
      formId: Number(this.formID),
      timestamp: currenttimestamp,
      version: 1,
      dataObject: {
        'Please rate your experience with the platform': this.ratingGiven.value,
        'Tell us more about your experience': value,
      },
    }

    this.npsService.submitPlatformRating(reqbody).subscribe((resp: any) => {
      if (resp) {
        const feedIDN = this.feedID.replace(/\"/g, '')
          const req = {
            request: {
              userId: this.configSvc.unMappedUser.id,
              category: 'NPS',
              feedId: feedIDN,
            },
          }
        this.npsService.deleteFeed(req).subscribe((res: any) => {
          if (res) {
            this.onSuccessRating = true
            if (localStorage.getItem('ratingformID')) {
              localStorage.removeItem('ratingformID')
            }
            if (localStorage.getItem('ratingfeedID')) {
              localStorage.removeItem('ratingfeedID')
            }
          }
        })
      }
    })
  }

  closeNPS() {
    if (!this.onSuccessRating) {
      const currenttimestamp = new Date().getTime()
      const reqbody = {
        formId: Number(this.formID),
        timestamp: currenttimestamp,
        version: 1,
        dataObject: {},
      }
      this.npsService.submitPlatformRating(reqbody).subscribe((resp: any) => {
        if (resp) {
          // this.isNPSOpen = false
          const feedIDN = this.feedID.replace(/\"/g, '')
          const req = {
            request: {
              userId: this.configSvc.unMappedUser.id,
              category: 'NPS',
              feedId: feedIDN,
            },
          }
          this.npsService.deleteFeed(req).subscribe((res: any) => {
            if (res) {
              this.isNPSOpen = false
              this.configSvc.updatePlatformRatingMethod({ bottom: '120px' })
              if (localStorage.getItem('ratingformID')) {
                localStorage.removeItem('ratingformID')
              }
              if (localStorage.getItem('ratingfeedID')) {
                localStorage.removeItem('ratingfeedID')
              }
              this.raisePlatformRatingEndTelemetry()
            }
          })
        }
      })
    } else {
      this.isNPSOpen = false
      this.configSvc.updatePlatformRatingMethod({ bottom: '120px' })
      if (localStorage.getItem('ratingformID')) {
        localStorage.removeItem('ratingformID')
      }
      if (localStorage.getItem('ratingfeedID')) {
        localStorage.removeItem('ratingfeedID')
      }
      this.raisePlatformRatingEndTelemetry()
    }
  }

  raisePlatformRatingStartTelemetry() {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: '' },
        object: {},
        state: WsEvents.EnumTelemetrySubType.Loaded,
        eventSubType: WsEvents.EnumTelemetrySubType.PlatformRating,
        type: WsEvents.EnumTelemetrySubType.PlatformRating,
        mode: 'view',
      },
      pageContext: { pageId: '/home', module: WsEvents.EnumTelemetrySubType.PlatformRating },
      from: '',
      to: 'Telemetry',
    }
    this.events.dispatchPlatformRatingEvent<WsEvents.IWsEventTelemetryInteract>(event)
  }

  raisePlatformRatingEndTelemetry() {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: '' },
        object: {},
        state: WsEvents.EnumTelemetrySubType.Unloaded,
        eventSubType: WsEvents.EnumTelemetrySubType.PlatformRating,
        type: WsEvents.EnumTelemetrySubType.PlatformRating,
        mode: 'view',
      },
      pageContext: { pageId: '/home', module: WsEvents.EnumTelemetrySubType.PlatformRating },
      from: '',
      to: 'Telemetry',
    }
    this.events.dispatchPlatformRatingEvent<WsEvents.IWsEventTelemetryInteract>(event)
  }

  raiseInteractTelemetry(type?: any) {
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        subType: this.ratingGiven ? this.ratingGiven.value :  0,
        id: `platform-rating-${type}`,
      },
      {},
      {
        module: WsEvents.EnumTelemetrySubType.PlatformRating,
      }
    )
  }
}
