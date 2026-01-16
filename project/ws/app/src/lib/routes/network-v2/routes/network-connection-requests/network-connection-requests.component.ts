import { Component, OnInit } from '@angular/core'
import { NSNetworkDataV2 } from '../../models/network-v2.model'
import { UntypedFormControl } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { NetworkV2Service } from '../../services/network-v2.service'
import { WsEvents, EventService, MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import { TranslateService } from '@ngx-translate/core'
import * as _ from 'lodash'

@Component({
  selector: 'ws-app-network-connection-requests',
  templateUrl: './network-connection-requests.component.html',
  styleUrls: ['./network-connection-requests.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 mt-6 ' },
  /* tslint:enable */
})
export class NetworkConnectionRequestsComponent implements OnInit {
  data!: NSNetworkDataV2.INetworkUser[]
  queryControl = new UntypedFormControl('')
  currentFilter = 'timestamp'
  currentFilterSort = 'desc'
  datalist: any[] = []
  filterdData: any[] = []
  enableSearchFeature = false
  constructor(
    private route: ActivatedRoute,
    private networkV2Service: NetworkV2Service,
    private eventSvc: EventService,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
  ) {
    if (this.route.snapshot.data.connectionRequests
      && this.route.snapshot.data.connectionRequests.data
      && this.route.snapshot.data.connectionRequests.data.result
      && this.route.snapshot.data.connectionRequests.data.result.data) {
        this.datalist = this.route.snapshot.data.connectionRequests.data.result.data
        this.data = this.route.snapshot.data.connectionRequests.data.result.data
        this.data = this.data.map((v: NSNetworkDataV2.INetworkUser) => {
          if (v && v.personalDetails && v.personalDetails.firstname) {
            v.personalDetails.firstname = v.personalDetails.firstname.toLowerCase()
          }
          return v
        })
        this.filterdData = this.data
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
    if (this.datalist && this.datalist.length > 0) {
      this.filter('timestamp', 'desc')
    }

    this.queryControl.valueChanges.subscribe(val => {
      if (val.length === 0) {
        this.filterdData = this.data
        this.enableSearchFeature = false
      } else {
        this.filterdData = this.data.filter((user: any) => user.fullName.toLowerCase().includes(val.toLowerCase()))
        this.enableSearchFeature = true
      }
    })
  }

  translateHub(hubName: string): string {
    const translationKey =  hubName
    return this.translate.instant(translationKey)
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

  connectionUpdate(event: any) {
    if (event === 'connection-updated') {
      this.networkV2Service.fetchAllReceivedConnectionRequests().subscribe(
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
