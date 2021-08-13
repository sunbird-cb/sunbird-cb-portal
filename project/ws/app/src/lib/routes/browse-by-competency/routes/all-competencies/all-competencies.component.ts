import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core'
import { ConfigurationsService, EventService } from '@sunbird-cb/utils'
import { BrowseCompetencyService } from '../../services/browse-competency';


@Component({
  selector: 'ws-app-all-competencies',
  templateUrl: './all-competencies.component.html',
  styleUrls: ['./all-competencies.component.scss'],
})
export class AllCompetenciesComponent implements OnInit, OnChanges {
  defaultThumbnail = ''
  facets: any = []
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
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || ''
    }
    this.getFacets()
    // this.getSearchedData()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.param.currentValue) {
      // this.getSearchedData()
    }
  }

  getFacets() {
    const queryparam = {
      request: {
        filters: {
          visibility: ['Default'],
          contentType: [
            'Course',
            'Resource',
          ],
        },
        sort_by: { lastUpdatedOn: '' },
        fields: [],
        facets: ['contentType', 'mimeType', 'source'],
      },
    }
    this.browseCompServ.fetchSearchData(queryparam).subscribe((response: any) => {
      this.facets = response.result.facets
    })
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
