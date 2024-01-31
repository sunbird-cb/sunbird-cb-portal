import { Component, OnInit } from '@angular/core'
import { NSNetworkDataV2 } from '../../models/network-v2.model'
import { FormControl } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { NetworkV2Service } from '../../services/network-v2.service'
import { WsEvents, EventService } from '@sunbird-cb/utils/src/public-api'
import { TranslateService } from '@ngx-translate/core'

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
  queryControl = new FormControl('')
  currentFilter = 'timestamp'
  currentFilterSort = 'desc'
  datalist: any[] = []
  constructor(
    private route: ActivatedRoute,
    private networkV2Service: NetworkV2Service,
    private eventSvc: EventService,
    private translate: TranslateService,
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
      }
   }

  ngOnInit() {
    if (this.datalist && this.datalist.length > 0) {
      this.filter('timestamp', 'desc')
    }
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
        this.data = this.datalist
        this.data.sort((a: any, b: any) => {
          return a.id.toLowerCase().localeCompare(b.id.toLowerCase())
        })
      } else {
        this.data.sort((a: any, b: any) => {
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
    this.eventSvc.handleTabTelemetry(
      WsEvents.EnumInteractSubTypes.NETWORK_TAB,
      data,
    )
  }

}
