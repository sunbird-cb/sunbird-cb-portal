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

  ngOnInit() {
    this.fetchProfileById(this.configSvc.unMappedUser.id).subscribe(x => {
      // console.log(x.profileDetails, "x.profileDetails====")
      // if (x.profileDetails.mandatoryFieldsExists) {
      //   this.isNudgeOpen = false
      // }
      if (x && x.profileDetails && x.profileDetails.personalDetails && x.profileDetails.personalDetails.phoneVerified) {
        this.isNudgeOpen = false
      }
    })

    this.updateTelemetryDataSubscription = this.npsService.updateTelemetryDataObservable.subscribe((value: boolean) => {
      if (value) {
        this.npsService.getFeedStatus(this.configSvc.unMappedUser.id).subscribe((res: any) => {
          if (res.result.response.userFeed && res.result.response.userFeed.length > 0) {
            const feed = res.result.response.userFeed
            feed.forEach((item: any) => {
              if (item.category === 'NPS' && item.data.actionData.formId) {
                this.isNPSOpen = true
                this.formID = item.data.actionData.formId

                this.npsService.getFormData(this.formID).subscribe((resform: any) => {
                  console.log('resform', resform)
                })
              }
            })
          }
        })
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
        if (rating.value < 4) {
          this.phtext = 'How can we make it better for you next time?'
        } else  {
          this.phtext = 'Inspire Others by sharing your experience'
        }
        // console.log('ratingGiven', this.ratingGiven)
      } else {
        r.showImage = false
      }
    })
  }

  submitRating(value: any) {
    const currenttimestamp = new Date().getTime()
    const reqbody = {
      formId: this.formID,
      timestamp: currenttimestamp,
      version: 1,
      dataObject: {
        'Please rate your experience  with the platform': this.ratingGiven.value,
        'Tell us more about your experience': value,
      },
    }

    this.npsService.submitNPS(reqbody).subscribe((resp: any) => {
      if (resp) {
        this.onSuccessRating = true
      }
    })
  }

  closeNPS() {
    const reqbody = {
      id: this.formID,
      dataObject: {},
    }
    this.npsService.submitNPS(reqbody).subscribe((resp: any) => {
      if (resp) {
        this.isNPSOpen = false
      }
    })
  }
}
