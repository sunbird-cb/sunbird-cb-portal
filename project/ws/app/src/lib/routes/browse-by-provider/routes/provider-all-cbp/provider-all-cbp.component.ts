import { Component, OnInit, OnDestroy } from '@angular/core'
import { BrowseProviderService } from '../../services/browse-provider.service'
import { Subscription } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
// tslint:disable
import _ from 'lodash'

@Component({
  selector: 'ws-app-provider-all-cbp',
  templateUrl: './provider-all-cbp.component.html',
  styleUrls: ['./provider-all-cbp.component.scss'],
})
export class ProviderAllCbpComponent implements OnInit, OnDestroy {
  private paramSubscription: Subscription | null = null
  cbps: any
  totalCount: any
  provider = ''
  searchReq = {
    request: {
      filters: {
        primaryCategory: [
          'Course',
          'Program',
        ],
        source: [''],
      },
      query: '',
      sort_by: {
        name: 'asc',
      },
      fields: [],
      facets: ['primaryCategory', 'mimeType', 'source'],
    },
  }

  constructor(
    private browseProviderSvc: BrowseProviderService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    if(this.activatedRoute.parent){
      this.paramSubscription = this.activatedRoute.parent.params.subscribe(async (params: any) => {
        this.provider = _.get(params, 'provider')
        this.searchReq.request.filters.source.splice(0,1, this.provider)
        this.getAllCbps()
      })
    }
  }

  getAllCbps(req?: any) {
    const request = req || this.searchReq
    this.browseProviderSvc.fetchSearchData(request).subscribe((res: any) => {
      console.log('res ::', res)
      if (res && res.result &&  res.result && res.result.content) {
        this.cbps = res.result.content
        this.totalCount = res.result.count
      }
    })
  }

  ngOnDestroy() {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe()
    }
  }

}
