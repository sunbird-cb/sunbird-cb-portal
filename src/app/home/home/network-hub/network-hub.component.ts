import { Component, OnInit, Input } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils-v2'
import { MatSnackBar } from '@angular/material'
import { HomePageService } from 'src/app/services/home-page.service'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-network-hub',
  templateUrl: './network-hub.component.html',
  styleUrls: ['./network-hub.component.scss'],
})

export class NetworkHubComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('networkConfig') networkConfig: any
  userInfo: any
  network = {
    networkRecommended: <any>[],
    suggestionsLoader: false,
    error: false,
  }

  recentRequests = {
    data: undefined,
    error: false,
    loadSkeleton: false,
  }

  constructor(
    private configService: ConfigurationsService,
    private homePageService: HomePageService,
    private matSnackBar: MatSnackBar,
    private translate: TranslateService,
    private eventService: EventService
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }

  ngOnInit() {
    this.userInfo =  this.configService && this.configService.userProfile
    if (this.networkConfig.recentRequests.active) {
      this.fetchRecentRequests()
    }

    if (this.networkConfig.networkSuggestions.active) {
      this.fetchNetworkRecommendations()
    }
  }

  translateHub(hubName: string): string {
    const translationKey =  hubName
    return this.translate.instant(translationKey)
  }

  fetchNetworkRecommendations(): void {
    const payload = {
      size: 2,
      offset: 0,
      search: [
        {
          field: 'employmentDetails.departmentName',
          values: [this.userInfo.departmentName],
        },
      ],
    }

    this.network.suggestionsLoader = true
    this.homePageService.getNetworkRecommendations(payload).subscribe(
      (res: any) => {
        this.network.suggestionsLoader = false
        this.network.networkRecommended = res.result.data[0].results
        if (this.network.networkRecommended.length) {
          this.network.networkRecommended = this.network.networkRecommended.map((obj: any) => {
            obj.fullName = this.createInitials(obj.personalDetails.firstname)
            obj.connecting = false
            return obj
          })
        }
        // tslint:disable-next-line: align
      }, (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.network.suggestionsLoader = false
        }
      }
    )
  }

  fetchRecentRequests(): void {
    this.recentRequests.loadSkeleton = true
    this.homePageService.getRecentRequests().subscribe(
      (res: any) => {
        this.recentRequests.loadSkeleton = false
        this.recentRequests.data = res.result.data && res.result.data.map((elem: any) => {
          elem.fullName = elem.fullName.charAt(0).toUpperCase() + elem.fullName.slice(1)
          elem.connecting = false
          return elem
        })
      // tslint:disable-next-line: align
      }, (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.recentRequests.loadSkeleton = false
        }
      }
    )
  }
// tslint:disable-next-line: whitespace
  handleUpdateRequest(event: any): void {
    this.homePageService.updateConnection(event.payload).subscribe(
      (_res: any) => {
        if (event.action === 'Approved') {
          this.matSnackBar.open('Request accepted successfully')
        } else {
          this.matSnackBar.open('Rejected the request')
        }
        event.reqObject.connecting = false
        this.fetchRecentRequests()
      // tslint:disable-next-line: align
      }, (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.matSnackBar.open('Unable to update connection, due to some error!')
        }
        event.reqObject.connecting = false
      }
    )
  }

  private raiseTelemetryEvent(id: string): void {
    this.eventService.raiseInteractTelemetry(
      {
        id,
        type: WsEvents.EnumInteractTypes.CLICK,
        subType: WsEvents.EnumInteractSubTypes.SUGGESTED_CONNECTIONS,
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.HOME,
      }
    )
  }

  handleConnect(obj: any): void {
    const payload = {
      connectionId: obj.userId,
      userIdFrom: this.userInfo.userId,
      userNameFrom: this.userInfo.userId,
      userDepartmentFrom: this.userInfo.departmentName,
      userIdTo: obj.userId,
      userNameTo: obj.userId,
      userDepartmentTo: obj.employmentDetails.departmentName,
    }

    // console.log("payload - ", payload);
    obj.connecting = true
    this.homePageService.connectToNetwork(payload).subscribe(
      (_res: any) => {
        this.fetchNetworkRecommendations()
        obj.connecting = false
        this.matSnackBar.open('Connection request sent successfully!')
        this.raiseTelemetryEvent('card-content')
      },
      (error: HttpErrorResponse) => {
        if (!error.ok) {
          obj.connecting = true
          this.matSnackBar.open('Unable to connect due to some error!')
        }
      }
    )
  }
  handleShowAll(): void {
    this.raiseTelemetryEvent('show-all')
  }

  createInitials(fname: string): string {
    let initials = ''
    const array = `${fname} `.toString().split(' ')
    if (array[0] !== 'undefined' && typeof array[1] !== 'undefined') {
      initials += array[0].charAt(0)
      initials += array[1].charAt(0)
    } else {
      for (let i = 0; i < fname.length; i += 1) {
        if (fname.charAt(i) === ' ') {
          continue
        }

        if (fname && fname.charAt(i)) {
          initials += fname.charAt(i)

          if (initials.length === 2) {
            break
          }
        }
      }
    }
    return initials.toUpperCase()
  }
}
