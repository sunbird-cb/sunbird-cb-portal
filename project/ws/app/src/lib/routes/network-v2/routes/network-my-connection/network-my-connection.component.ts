import { Component, OnInit } from '@angular/core'
import { UntypedFormControl } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
// import { ConnectionHoverService } from '../../components/connection-name/connection-hover.servive'
import { WsEvents, EventService, MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import { TranslateService } from '@ngx-translate/core'
import * as _ from 'lodash'

@Component({
  selector: 'ws-app-network-my-connection',
  templateUrl: './network-my-connection.component.html',
  styleUrls: ['./network-my-connection.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 mt-6 ' },
  /* tslint:enable */
})
export class NetworkMyConnectionComponent implements OnInit {
  queryControl = new UntypedFormControl('')
  currentFilter = 'timestamp'
  currentFilterSort = 'desc'
  enableSearchFeature = false
  datalist: any[] = []
  data: any[] = []
  filterdData: any[] = []
  constructor(
    private route: ActivatedRoute,
    // private connectionHoverService: ConnectionHoverService,
    private eventSvc: EventService,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
  ) {
    // this.data = this.route.snapshot.data.myConnectionList.data.result.data
    // this.data = this.route.snapshot.data.myConnectionList.data.result.data.map((v: NSNetworkDataV2.INetworkUser) => {
    //   if (v && v.personalDetails && v.personalDetails.firstname) {
    //     v.personalDetails.firstname = v.personalDetails.firstname.toLowerCase()
    //   }
    //   return v
    // })
    if (this.route.snapshot.data.myConnectionList
      && this.route.snapshot.data.myConnectionList.data
      && this.route.snapshot.data.myConnectionList.data.result
      && this.route.snapshot.data.myConnectionList.data.result.data) {
      this.datalist = this.route.snapshot.data.myConnectionList.data.result.data
    }
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }

    })
  }

  ngOnInit() {
    this.queryControl.valueChanges.subscribe(val => {
      if (val.length === 0) {
        this.filterdData = this.data
        this.enableSearchFeature = false
      } else {
        this.filterdData = this.data.filter((user: any) => user.fullName.toLowerCase().includes(val.toLowerCase()))
        this.enableSearchFeature = true
      }
    })

    if (this.datalist && this.datalist.length > 0) {
      this.filter('timestamp', 'desc')
      this.getFullUserData()
    }
  }

  translateHub(hubName: string): string {
    const translationKey =  hubName
    return this.translate.instant(translationKey)
  }

  getFullUserData() {
    this.data = this.datalist
    this.filterdData = this.datalist
    // this.datalist.forEach((usr: any) => {
      // const userrId = usr.identifier || usr.id
      // if (userrId) {
      //   this.connectionHoverService.fetchProfile(userrId).subscribe((res: any) => {
      //     this.data.push(res)
      //     this.data.forEach((item: any) => {
      //       if (item.profileDetails && item.profileDetails.personalDetails) {
      //         item.profileDetails.personalDetails.firstname = item.profileDetails.personalDetails.firstname.toLowerCase()
      //       } else if (!item.profileDetails && item.personalDetails) {
      //         item.personalDetails.firstname = item.personalDetails.firstname.toLowerCase()
      //       }
      //     })

      //   })
      // }
    // })
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
        // this.filterdData = this.datalist
        this.filterdData.sort((a: any, b: any) => {
          return a.id.toLowerCase().localeCompare(b.id.toLowerCase())
        })
      } else {
        this.filterdData.sort((a: any, b: any) => {
          return a.fullName.toLowerCase().localeCompare(b.fullName.toLowerCase())
        })
      }
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
