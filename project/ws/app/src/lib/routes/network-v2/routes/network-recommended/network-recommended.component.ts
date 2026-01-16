import { Component, OnInit } from '@angular/core'
import { NSNetworkDataV2 } from '../../models/network-v2.model'
import { UntypedFormControl } from '@angular/forms'
import { NetworkV2Service } from '../../services/network-v2.service'
import { ConfigurationsService, WsEvents, EventService, MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import { ActivatedRoute } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import * as _ from 'lodash'

@Component({
  selector: 'ws-app-network-recommended',
  templateUrl: './network-recommended.component.html',
  styleUrls: ['./network-recommended.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 mt-6 ' },
  /* tslint:enable */
})
export class NetworkRecommendedComponent implements OnInit {
  data!: NSNetworkDataV2.INetworkUser[]
  queryControl = new UntypedFormControl('')
  currentFilter = 'timestamp'
  currentFilterSort = 'desc'
  enableSearchFeature = false
  currentUserDept: any
  constructor(
    private networkV2Service: NetworkV2Service,
    private configSvc: ConfigurationsService,
    private route: ActivatedRoute,
    private eventSvc: EventService,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,

  ) {
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })

    this.currentUserDept = this.configSvc.userProfile && this.configSvc.userProfile.rootOrgName
    if (this.route.snapshot.data.recommendedList.data
      && this.route.snapshot.data.recommendedList.data.result) {
      this.data = this.route.snapshot.data.recommendedList.data.result.data.map(
        (v: NSNetworkDataV2.INetworkUser) => {
        if (v && v.personalDetails && v.personalDetails.firstname) {
          v.personalDetails.firstname = v.personalDetails.firstname.toLowerCase()
        }
        return v
      })
      this.getFullUserData()
    }
  }

  ngOnInit() {
    this.queryControl.valueChanges.subscribe(val => {
      if (val.length === 0) {
        this.enableSearchFeature = false
      } else {
        this.enableSearchFeature = true
      }
    })
    this.getRecommnededUsers()
  }

  translateHub(hubName: string): string {
    const translationKey =  hubName
    return this.translate.instant(translationKey)
  }

  getFullUserData() {
    const fulldata = this.data
    this.data = []
    fulldata.forEach((user: any) => {
      this.networkV2Service.fetchProfile(user.id).subscribe((res: any) => {
        // this.data.push(res.result.UserProfile[0])
        this.data.push(res.result.response)
      })
    })
  }

  getRecommnededUsers () {
    let req: NSNetworkDataV2.IRecommendedUserReq
      req = {
        size: 50,
        offset: 0,
        search: [
          {
            field: 'employmentDetails.departmentName',
            values: [this.currentUserDept],
          },
        ],
      }
    this.networkV2Service.fetchAllRecommendedUsers(req).subscribe((data: any) => {
      this.data = data.result.data[0].results
      this.data.forEach((value: any) => {
        if (value.profileDetails && value.profileDetails.personalDetails) {
          value.profileDetails.personalDetails.firstname = this.getName(value.profileDetails.personalDetails).toLowerCase()

        } else if (!value.profileDetails && value.personalDetails) {
          value.personalDetails.firstname = this.getName(value.personalDetails).toLowerCase()
        }
       })
    })
  }

  getName(userDetails: any) {
    return userDetails.firstName ? userDetails.firstName : userDetails.firstname
  }

  updateQuery(key: string) {
    if (key) {

    }
  }

  filter(key: string, order: string | 'asc' | 'desc') {
    if (key) {
      this.currentFilter = key
      this.currentFilterSort = order
      if (this.currentFilter === 'timestamp') {
        this.data.sort((a: any, b: any) => {
          return a.id.toLowerCase().localeCompare(b.id.toLowerCase())
        })
      } else {
        this.data.sort((a: any, b: any) => {
          return a.personalDetails.firstname.toLowerCase().localeCompare(b.personalDetails.firstname.toLowerCase())
        })
      }
    }
  }

  connectionUpdate(event: any) {
    if (event === 'connection-updated') {
      this.networkV2Service.fetchAllSuggestedUsers().subscribe(
        (data: any) => {
          this.data = data.result.data
        },
        (_err: any) => {
          // this.openSnackbar(err.error.message.split('|')[1] || this.defaultError)
        })
    }
  }

  public tabTelemetry(label: string, index: number) {
    const data: WsEvents.ITelemetryTabData = {
      label,
      index,
    }
    this.eventSvc.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        subType: WsEvents.EnumInteractSubTypes.NETWORK_TAB,
        id: `${_.camelCase(data.label)}-tab`,
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.NETWORK,
      }
    )
  }

}
