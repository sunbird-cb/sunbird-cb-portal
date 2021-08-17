import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core'
import { ConfigurationsService, EventService } from '@sunbird-cb/utils'
import { FormGroup, FormControl } from '@angular/forms'
import { BrowseCompetencyService } from '../../services/browse-competency.service'
import { NSBrowseCompetency } from '../../models/competencies.model'
@Component({
  selector: 'ws-app-all-competencies',
  templateUrl: './all-competencies.component.html',
  styleUrls: ['./all-competencies.component.scss'],
})
export class AllCompetenciesComponent implements OnInit, OnChanges {
  defaultThumbnail = ''
  allCompetencies!: NSBrowseCompetency.ICompetencie[]
  filterForm: FormGroup | undefined
  searchForm: FormGroup | undefined
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school' },
    { title: 'All Competencies' , url: 'none', icon: '' },
  ]

  compentency = 'some-competency'

  constructor(
    private configSvc: ConfigurationsService,
    private events: EventService,
    private browseCompServ: BrowseCompetencyService
  ) { }

  ngOnInit() {
    this.filterForm = new FormGroup({
      filters: new FormControl(''),
    })
    this.searchForm = new FormGroup({
      orgName: new FormControl(''),
      searchKey: new FormControl(''),
    })
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || ''
    }
    this.searchCompetency('')
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.param.currentValue) {
      // this.getSearchedData()
    }
  }

  searchCompetency(searchQuery: any) {
    const searchJson = [
      { type: 'COMPETENCY', field: 'name', keyword: searchQuery? searchQuery:'' },
      { type: 'COMPETENCY', field: 'status', keyword: 'VERIFIED' },
    ]

    const req = {
      searches: searchJson,
    }
    this.browseCompServ
      .fetchCompetency(req)
      .subscribe((reponse: NSBrowseCompetency.ICompetencieResponse) => {
        if (reponse.statusInfo && reponse.statusInfo.statusCode === 200) {
          this.allCompetencies = reponse.responseData
        }
      })
  }

  updateQuery(key: string) {
    this.searchCompetency(key)
  }

  reset() {
    // this.searchForm.setValue('searchKey') = ''
    this.searchCompetency('')
  }

  raiseTelemetry(content: any) {
    if (content) {
      this.events.raiseInteractTelemetry('click', `card-learnSearch`, {
        contentId: content.identifier || '',
        contentType: content.contentType,
        rollup: {},
        ver: content.version,
      })
    }
  }

}
