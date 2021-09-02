import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { BrowseProviderService } from '../../services/browse-provider.service'
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators'
import { Subject, Observable } from 'rxjs'

@Component({
  selector: 'ws-app-all-providers',
  templateUrl: './all-providers.component.html',
  styleUrls: ['./all-providers.component.scss'],
})
export class AllProvidersComponent implements OnInit {
  public displayLoader!: Observable<boolean>
  provider = 'JPAL'
  page = 1
  defaultLimit = 18
  limit = 18
  searchForm: FormGroup | undefined
  sortBy: any
  searchQuery = ''
  allProviders: any
  disableLoadMore =  false
  totalCount = 0
  private unsubscribe = new Subject<void>()
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school' },
    { title: 'All Providers' , url: 'none', icon: '' },
  ]
  getAllProvidersReq = {
      request: {
          filters: {
            isCbp: true,
          },
          sort_by: {
              orgName: 'asc',
          },
          query: '',
          limit: this.limit,
          offset: 0,
      },
  }
  constructor(
    private browseProviderSvc: BrowseProviderService
  ) { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      sortByControl: new FormControl(''),
      searchKey: new FormControl(''),
    })
    this.displayLoader = this.browseProviderSvc.isLoading()
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        switchMap(async formValue => {
          this.sortBy = formValue.sortByControl
          this.updateQuery(formValue.searchKey)
        }),
        takeUntil(this.unsubscribe)
      ).subscribe()
    this.getAllProviders()
  }

  getAllProviders(req?: any) {
    const request = req || this.getAllProvidersReq
    this.browseProviderSvc.fetchAllProviders(request).subscribe(res => {
      if (res && res.result &&  res.result.response && res.result.response.content) {
        this.allProviders = res.result.response.content
        this.totalCount = res.result.response.count
        if ((this.page * this.defaultLimit) >= this.totalCount) {
          this.disableLoadMore = true
        } else {
          this.disableLoadMore = false
        }
      }
    })
  }

  updateQuery(key: string) {
    this.searchQuery = key
    this.getAllProvidersReq.request.query = this.searchQuery
    this.getAllProvidersReq.request.offset = 0
    this.getAllProvidersReq.request.limit = this.defaultLimit
    this.page = 1
    this.getAllProvidersReq.request.sort_by.orgName = this.sortBy
    this.getAllProviders()
  }

  loadMore() {
    this.page = this.page + 1
    // this.getAllProvidersReq.request.offset = this.page * this.limit
    this.limit = (this.page * this.defaultLimit) || this.defaultLimit
    this.getAllProvidersReq.request.limit = this.limit
    this.getAllProviders()
    if ((this.page * this.defaultLimit) >= this.totalCount) {
      this.disableLoadMore = true
    } else {
      this.disableLoadMore = false
    }
  }

}
