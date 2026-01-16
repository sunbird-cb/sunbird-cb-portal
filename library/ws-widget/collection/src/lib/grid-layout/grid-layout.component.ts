// import { HttpClient } from '@angular/common/http'
import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { ConfigurationsService, EventService, WsEvents, NPSGridService  } from '@sunbird-cb/utils-v2'
// import { IUserProfileDetailsFromRegistry } from '@ws/app/src/lib/routes/user-profile/models/user-profile.model'
import { Subscription } from 'rxjs'
// import { map } from 'rxjs/operators'
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
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'

// const API_END_POINTS = {
//   fetchProfileById: (id: string) => `/apis/proxies/v8/api/user/v2/read/${id}`,
// }

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
    // private http: HttpClient,
    private npsService: NPSGridService,
    private snackBar: MatSnackBar,
  ) {
    super()
  }

  @Input() widgetData!: IGridLayoutDataMain
  @Input() fromHeader = false
  containerClass = ''
  processed: IGridLayoutProcessedData[][] = []
  isNudgeOpen = true

  // NPS
  updateTelemetryDataSubscription: Subscription | any = null
  isNPSOpen = false
  ratingGiven: any
  onSuccessRating = false
  phtext: any
  reviewText: any
  formID: any
  feedID: any
  formFields: any
  submitBtnClick = false
  npsCategory: any = 'NPS'
  ratingList = [
    {
      value: 0,
      image: '/assets/images/nps/0.svg',
      showImage: false,
    },
    {
      value: 1,
      image: '/assets/images/nps/1.svg',
      showImage: false,
    },
    {
      value: 2,
      image: '/assets/images/nps/2.svg',
      showImage: false,
    },
    {
      value: 3,
      image: '/assets/images/nps/3.svg',
      showImage: false,
    },
    {
      value: 4,
      image: '/assets/images/nps/4.svg',
      showImage: false,
    },
    {
      value: 5,
      image: '/assets/images/nps/5.svg',
      showImage: false,
    },
    {
      value: 6,
      image: '/assets/images/nps/6.svg',
      showImage: false,
    },
    {
      value: 7,
      image: '/assets/images/nps/7.svg',
      showImage: false,
    },
    {
      value: 8,
      image: '/assets/images/nps/8.svg',
      showImage: false,
    },
    {
      value: 9,
      image: '/assets/images/nps/9.svg',
      showImage: false,
    },
    {
      value: 10,
      image: '/assets/images/nps/10.svg',
      showImage: false,
    },
  ]
  fullMenuHeight = false
  isMobile = false
  reviewCommentLength = 0
  @ViewChild('textArea') textArea!: ElementRef
  noHtmlCharacter = new RegExp(/<[^>]*>|(function[^\s]+)|(javascript:[^\s]+)/i)
  disableMenu = false
  ngOnInit() {
    let isNotMyUser = false
    let isIgotOrg = false
    if (this.configSvc && this.configSvc.unMappedUser
      && this.configSvc.unMappedUser.profileDetails
      && this.configSvc.unMappedUser.profileDetails.profileStatus) {
      isNotMyUser = this.configSvc.unMappedUser.profileDetails.profileStatus.toLowerCase() === 'not-my-user' ? true : false
    }
    if (this.configSvc && this.configSvc.unMappedUser
      && this.configSvc.unMappedUser.profileDetails
      && this.configSvc.unMappedUser.profileDetails.employmentDetails
      && this.configSvc.unMappedUser.profileDetails.employmentDetails.departmentName) {
        isIgotOrg = this.configSvc.unMappedUser.profileDetails.employmentDetails.departmentName.toLowerCase() === 'igot' ? true : false
    }
    // let isIgotOrg = true
    if (isNotMyUser && isIgotOrg) {
      this.disableMenu = true
      // this.router.navigateByUrl('app/person-profile/me#profileInfo')
    } else {
      this.disableMenu = false
    }
    this.npsCategory = localStorage.getItem('npsCategory') ? localStorage.getItem('npsCategory') : 'NPS'
    if (window.innerWidth < 540) {
      this.isMobile = true
    } else {
      this.isMobile = false
    }
    this.configSvc.changeNavBarFullView.subscribe((data: any) => {
      // console.log('data-->', data)
      this.fullMenuHeight = data
    })
    if (this.configSvc.unMappedUser && this.configSvc.unMappedUser.id) {
      // this.fetchProfileById(this.configSvc.unMappedUser.id).subscribe(x => {
        // console.log(x.profileDetails, "x.profileDetails====")
        // if (x.profileDetails.mandatoryFieldsExists) {
        //   this.isNudgeOpen = false
        // }
        if (this.configSvc.unMappedUser &&
        this.configSvc.unMappedUser.profileDetails &&
        this.configSvc.unMappedUser.profileDetails.personalDetails &&
        this.configSvc.unMappedUser.profileDetails.personalDetails.phoneVerified &&
        this.configSvc.unMappedUser.profileDetails.personalDetails.phoneVerified === 'true') {
          this.isNudgeOpen = false
        }
      // })
    }

    if (this.npsCategory === 'NPS') {
      this.ratingList = [
        {
          value: 1,
          image: '/assets/images/nps/Rating_1@2x.svg',
          showImage: false,
        },
        {
          value: 2,
          image: '/assets/images/nps/Rating_2@2x.svg',
          showImage: false,
        },
        {
          value: 3,
          image: '/assets/images/nps/Rating_3@2x.svg',
          showImage: false,
        },
        {
          value: 4,
          image: '/assets/images/nps/Rating_4@2x.svg',
          showImage: false,
        },
        {
          value: 5,
          image: '/assets/images/nps/Rating_5@2x.svg',
          showImage: false,
        },
      ]
    } else {
      this. ratingList = [
        {
          value: 0,
          image: '/assets/images/nps/0.svg',
          showImage: false,
        },
        {
          value: 1,
          image: '/assets/images/nps/1.svg',
          showImage: false,
        },
        {
          value: 2,
          image: '/assets/images/nps/2.svg',
          showImage: false,
        },
        {
          value: 3,
          image: '/assets/images/nps/3.svg',
          showImage: false,
        },
        {
          value: 4,
          image: '/assets/images/nps/4.svg',
          showImage: false,
        },
        {
          value: 5,
          image: '/assets/images/nps/5.svg',
          showImage: false,
        },
        {
          value: 6,
          image: '/assets/images/nps/6.svg',
          showImage: false,
        },
        {
          value: 7,
          image: '/assets/images/nps/7.svg',
          showImage: false,
        },
        {
          value: 8,
          image: '/assets/images/nps/8.svg',
          showImage: false,
        },
        {
          value: 9,
          image: '/assets/images/nps/9.svg',
          showImage: false,
        },
        {
          value: 10,
          image: '/assets/images/nps/10.svg',
          showImage: false,
        },
      ]
    }

    if (localStorage.getItem('platformRatingSubmit')) {
      this.isNPSOpen = false
      // this.submitBtnClick = false
    } else {
      this.updateTelemetryDataSubscription = this.npsService.updateTelemetryDataObservable.subscribe((value: any) => {
        if (value) {
          if (localStorage.getItem('ratingformID')) {
            this.isNPSOpen = true
            // this.submitBtnClick = true
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
    }

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

  // fetchProfileById(id: any): Observable<any> {
  //   return this.http.get<[IUserProfileDetailsFromRegistry]>(API_END_POINTS.fetchProfileById(id))
  //     .pipe(map((res: any) => {
  //       return _.get(res, 'result.response')
  //     }))
  // }
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
        } else {
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
    this.submitBtnClick = true
    this.onSuccessRating = true
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
    if (localStorage.getItem('platformRatingSubmit')) {
      this.isNPSOpen = false
      // this.submitBtnClick = false
    } else {
      this.npsService.submitPlatformRating(reqbody).subscribe((resp: any) => {
        // tslint:disable-next-line
        console.log(resp)
        localStorage.setItem('platformRatingSubmit', 'true')
        setTimeout(() => {
          this.isNPSOpen = false
          this.onSuccessRating = false
        },         4000)
          const feedIDN = JSON.parse(this.feedID).map((item: any) => {
            return item.replace(/\"/g, '')
           })
          // const feedIDN = this.feedID.replace(/\"/g, '')
          if (feedIDN.length > 0) {
            if (localStorage.getItem('ratingformID')) {
              localStorage.removeItem('ratingformID')
            }
            if (localStorage.getItem('ratingfeedID')) {
              localStorage.removeItem('ratingfeedID')
            }
            for (const item of feedIDN) {
              const req = {
                request: {
                  userId: this.configSvc.unMappedUser.id,
                  category: 'NPS',
                  feedId: item,
                },
              }
              this.npsService.deleteFeed(req).subscribe((res: any) => {
              // tslint:disable-next-line
              console.log(res)
              }
              )
            }
          }
        }
      )
    }
  }

  closeNPS() {
    if (!this.onSuccessRating) {
      const currenttimestamp = new Date().getTime()
      const reqbody = {
        formId: Number(this.formID),
        timestamp: currenttimestamp,
        version: 1,
        dataObject: this.npsCategory === 'NPS' ? {} : {
          'Please rate your experience with the platform': -1,
        },
      }
      this.npsService.submitPlatformRating(reqbody).subscribe((resp: any) => {
        this.isNPSOpen = false
         // tslint:disable-next-line
         console.log(resp)
          // const feedIDN = this.feedID.replace(/\"/g, '')
          const feedIDN = JSON.parse(this.feedID).map((item: any) => {
            return item.replace(/\"/g, '')
           })
           if (feedIDN.length > 0) {
            if (localStorage.getItem('ratingformID')) {
              localStorage.removeItem('ratingformID')
            }
            if (localStorage.getItem('ratingfeedID')) {
              localStorage.removeItem('ratingfeedID')
            }
            for (const item of feedIDN) {
              const req = {
                request: {
                  userId: this.configSvc.unMappedUser.id,
                  category: 'NPS',
                  feedId: item,
                },
              }
              this.npsService.deleteFeed(req).subscribe((res: any) => {
                if (res) {
                  this.configSvc.updatePlatformRatingMethod({ bottom: '120px' })
                  this.raisePlatformRatingEndTelemetry()
                }
              }
              )
            }
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
        subType: this.ratingGiven ? this.ratingGiven.value : 0,
        id: `platform-rating-${type}`,
      },
      {},
      {
        module: WsEvents.EnumTelemetrySubType.PlatformRating,
      }
    )
  }

  private openSnackbar(primaryMsg: string, duration: number = 2000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  getReviewCommentLength() {
    if (this.textArea && this.textArea.nativeElement && this.textArea.nativeElement.value) {
      this.reviewCommentLength = this.textArea.nativeElement.value.length
      if (this.textArea.nativeElement.value.match(this.noHtmlCharacter)) {
        this.submitBtnClick = true
        this.openSnackbar('HTML or Js is not allowed')
      } else {
        this.submitBtnClick = false
      }
    } else {
      this.reviewCommentLength = 0
    }

  }
}
