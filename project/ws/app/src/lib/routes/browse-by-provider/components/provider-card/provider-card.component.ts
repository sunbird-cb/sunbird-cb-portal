import { Component, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'
import { EventService, WsEvents } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'ws-app-provider-card',
  templateUrl: './provider-card.component.html',
  styleUrls: ['./provider-card.component.scss'],
})
export class ProviderCardComponent implements OnInit {
  @Input() provider!: any

  constructor(
    private events: EventService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  /**
   * Navigate to provider micro-sites page
   */
  navigateToProvider(): void {
    debugger
    let url = ''
    let queryParams = {}
    if(this.provider?.internalOrgId) {
       url = `/app/learn/browse-by/provider/${this.provider.contentPartnerName|| this.provider?.name}/${this.provider?.internalOrgId}/micro-sites`
    }  else if(this.provider?.orgId) {
      url  = `/app/learn/browse-by/provider/${this.provider.name}/${this.provider.orgId}/micro-sites`
    } else {
      url = `app/seeAll/content`
      queryParams = {
        key: this.provider?.contentDisplayType || 'extContent',
        provider: this.provider?.id || '',
        providerName: this.provider?.contentPartnerName || this.provider?.partnerCode || ''
      }
    }
    this.router.navigate([url], { queryParams })
  }

  /**
   * Raise telemetry event on card click
   */
  raiseTelemetery(): void {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        id: 'card-content',
      },
      {
        id: this.provider.name,
        type: this.provider.orgId,
      },
      {
        pageIdExt: 'card-content',
        module: WsEvents.EnumTelemetrymodules.LEARN,
      })
  }

  /**
   * Handle provider card click
   * Raises telemetry event and navigates to provider page
   */
  onCardClick(): void {
    this.raiseTelemetery()
    this.navigateToProvider()
  }

}
