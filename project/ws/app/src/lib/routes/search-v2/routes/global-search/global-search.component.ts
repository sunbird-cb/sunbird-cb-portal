import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { NsContent } from '@sunbird-cb/collection/src/public-api'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'ws-app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
})
export class GlobalSearchComponent implements OnInit {
  searchParam = ''
  userValue = ''
  searchparamFilters: any
  filtersPanel!: string | null
  selectedTab = 1
  tabs = ['All', 'Learn', 'Network', 'Discuss', 'Careers']
  compentencyKey!: NsContent.ICompentencyKeys

  constructor(private activated: ActivatedRoute, private translate: TranslateService, private configService: ConfigurationsService) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }

  ngOnInit() {
    this.compentencyKey = this.configService.compentency[environment.compentencyVersionKey]
    this.activated.queryParamMap.subscribe(queryParams => {
      this.searchParam = ''
      this.userValue = ''
      if (queryParams.has('tab')) {
        const tabn = queryParams.get('tab')
        this.tabs.forEach((t: any, index: number) => {
          if (t === tabn) {
            this.selectedTab = index
          }
        })
      }
      if (queryParams.has('q')) {
        this.searchParam = queryParams.get('q') || ''
      }
      if (queryParams.has('t')) {
        this.searchParam = 'moderatedCourses' || ''
        this.userValue = 'moderatedCourses'
      }
      if (queryParams.has('f')) {
        const sfilters = JSON.parse(queryParams.get('f') || '{}')
        const paramfilter = [{
          mainType: 'primaryCategory',
          name: sfilters.contentType[0].toLowerCase(),
          count: '',
          ischecked: true,
        }, {
          mainType: 'competencies_v3.name',
          name: 'competencies_v3.name',
          count: '',
          values: sfilters['competencies_v3.name'],
          ischecked: true,
        },
        {
          mainType: 'topics',
          name: 'topics',
          count: '',
          values: sfilters['topics'],
          ischecked: true,
        }]
        this.searchparamFilters = paramfilter
      }

      if (queryParams.has('filtersPanel')) {
        this.filtersPanel = queryParams.get('filtersPanel')
      }
    })
  }

  translateTo(menuName: string): string {
    // tslint:disable-next-line: prefer-template
    const translationKey = 'globalsearch.' + menuName.replace(/\s/g, '')
    return this.translate.instant(translationKey)
  }

}
