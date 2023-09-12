import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { ConnectionHoverService } from '../../components/connection-name/connection-hover.servive'
import { WsEvents, EventService } from '@sunbird-cb/utils/src/public-api'

@Component({
  selector: 'ws-app-network-my-connection',
  templateUrl: './network-my-connection.component.html',
  styleUrls: ['./network-my-connection.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 mt-6 ' },
  /* tslint:enable */
})
export class NetworkMyConnectionComponent implements OnInit {
  queryControl = new FormControl('')
  currentFilter = 'timestamp'
  currentFilterSort = 'desc'
  enableSearchFeature = false
  datalist: any[] = []
  data: any[] = []
  constructor(
    private route: ActivatedRoute,
    private connectionHoverService: ConnectionHoverService,
    private eventSvc: EventService,
  ) {
    // this.data = this.route.snapshot.data.myConnectionList.data.result.data
    // this.data = this.route.snapshot.data.myConnectionList.data.result.data.map((v: NSNetworkDataV2.INetworkUser) => {
    //   if (v && v.personalDetails && v.personalDetails.firstname) {
    //     v.personalDetails.firstname = v.personalDetails.firstname.toLowerCase()
    //   }
    //   return v
    // })
    this.datalist = this.route.snapshot.data.myConnectionList.data.result.data
  }

  ngOnInit() {
    this.queryControl.valueChanges.subscribe(val => {
      if (val.length === 0) {
        this.enableSearchFeature = false
      } else {
        this.enableSearchFeature = true
      }
    })

    if (this.datalist && this.datalist.length > 0) {
      this.filter('timestamp', 'desc')
      this.getFullUserData()
    }
  }

  getFullUserData() {
    this.datalist.forEach((usr: any) => {
      const userrId = usr.identifier || usr.id
      if (userrId) {
        this.connectionHoverService.fetchProfile(userrId).subscribe((res: any) => {
          this.data.push(res)
          this.data.forEach((item: any) => {
            if (item.profileDetails && item.profileDetails.personalDetails) {
              item.profileDetails.personalDetails.firstname = item.profileDetails.personalDetails.firstname.toLowerCase()
            } else if (!item.profileDetails && item.personalDetails) {
              item.personalDetails.firstname = item.personalDetails.firstname.toLowerCase()
            }
          })

        })
      }
    })
  }

  updateQuery(key: string) {
    if (key) {

    }
  }

  filter(key: string, order: string | 'asc' | 'desc') {
    if (key) {
      this.currentFilter = key
      this.currentFilterSort = order
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
