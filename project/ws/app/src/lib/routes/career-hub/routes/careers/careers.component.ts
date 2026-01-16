import { Component, OnInit } from '@angular/core'
import { NSDiscussData } from '../../../discuss/models/discuss.model'
import { ActivatedRoute, Router } from '@angular/router'
import { UntypedFormControl } from '@angular/forms'
import { DiscussService } from '../../../discuss/services/discuss.service'
import { WsEvents, EventService, MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import { TranslateService } from '@ngx-translate/core'
import * as _ from 'lodash'

@Component({
  selector: 'ws-app-careers',
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.scss'],
})
export class CareersComponent implements OnInit {
  data!: NSDiscussData.IDiscussionData
  queryControl = new UntypedFormControl('')
  currentFilter = 'timestamp'
  pager = {}
  paginationData!: any
  currentActivePage!: any
  categoryId!: any
  fetchNewData = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private discussService: DiscussService,
    private eventSvc: EventService,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService
  ) {
    this.data = this.route.snapshot.data.topics.data
    this.paginationData = this.data.pagination
    this.categoryId = this.route.snapshot.data['careersCategoryId'] || 1
    this.setPagination()
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
  }

  ngOnInit() {
    this.route.queryParams.subscribe(x => {
      this.currentActivePage = x.page || 1
      this.refreshData(this.currentActivePage)
    })
  }

  translateHub(hubName: string): string {
    const translationKey =  hubName
    return this.translate.instant(translationKey)
  }

  filter(key: string | 'timestamp' | 'viewcount') {
    if (key) {
      this.currentFilter = key
      this.refreshData(this.currentActivePage)
    }
  }
  updateQuery(key: string) {
    if (key) {

    }
  }

  refreshData(page: any) {
    if (this.fetchNewData) {
      if (this.currentFilter === 'timestamp') {
        this.discussService.fetchSingleCategoryDetails(this.categoryId, page).subscribe(
          (data: any) => {
            this.data = data
            this.paginationData = data.pagination
            this.setPagination()
          },
          (_err: any) => {
          })
      } else {
        this.discussService.fetchSingleCategoryDetailsSort(this.categoryId, 'voted', page).subscribe(
          (data: any) => {
            this.data = data
            this.paginationData = data.pagination
            this.setPagination()
          },
          (_err: any) => {
          })
      }
    }
  }

  navigateWithPage(page: any) {
    if (page !== this.currentActivePage) {
      this.router.navigate([`/app/careers/home`], { queryParams: { page } })
      this.fetchNewData = true
    }
  }

  setPagination() {
    this.pager = {
      startIndex: this.paginationData.first.page,
      endIndex: this.paginationData.last.page,
      // pages: Array.from(Array(this.paginationData.pageCount), (_x, index) => index + 1),
      pages: this.paginationData.pages,
      currentPage: this.paginationData.currentPage,
      totalPage: this.paginationData.pageCount,
    }
  }

  tabTelemetry(label: string, index: number) {
    const data: WsEvents.ITelemetryTabData = {
      label,
      index,
    }
    this.eventSvc.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        subType: WsEvents.EnumInteractSubTypes.CAREER_TAB,
        id: `${_.camelCase(data.label)}-tab`,
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.CAREER,
      }
    )
  }

}
