import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
/* tslint:disable */
import _ from 'lodash'
/* tslint:enable */
import { TranslateService } from '@ngx-translate/core'
import { MultilingualTranslationsService, NsContent, WidgetEnrollService } from '@sunbird-cb/utils-v2'
import { SeeAllService } from '@ws/app/src/lib/routes/see-all/services/see-all.service'
import { WidgetUserServiceLib } from '@sunbird-cb/consumption'

@Component({
  selector: 'ws-recommende-learnings',
  templateUrl: './recommende-learnings.component.html',
  styleUrls: ['./recommende-learnings.component.scss'],
})
export class RecommendeLearningsComponent implements OnInit {
  recommendedConfig: any
  slectedPill: string = ''
  available: any = []
  inprogress: any = []
  completed: any = []
  results: any = []
  content: any = []
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private widgetSvc: WidgetUserServiceLib,
    private translate: TranslateService,
    //private configSvc: ConfigurationsService,
    private langtranslations: MultilingualTranslationsService,
    private seeAllSvc: SeeAllService,
    private enrollSvc: WidgetEnrollService

    ) {
      this.langtranslations.languageSelectedObservable.subscribe(() => {
        if (localStorage.getItem('websiteLanguage')) {
          this.translate.setDefaultLang('en')
          const lang = localStorage.getItem('websiteLanguage')!
          this.translate.use(lang)
        }
      })
    }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((res: any) => {
      this.slectedPill = (res.pillSelected) ? res.pillSelected : ''
    })
    if (this.activatedRoute.snapshot.data.pageData) {
      this.recommendedConfig = this.activatedRoute.snapshot.data.pageData.data.recommendedConfig
    }
    this.getRecommendeLeanings()
  }

  pillClicked(pill: any) {
    this.slectedPill = pill.value
    const _courses = this.results.find((key: any) => key.name === this.slectedPill)
    this.content = _courses ? _courses.courses : []
  }

  async getRecommendeLeanings() {
    let response = await this.seeAllSvc.fetchDesigantionsData(this.recommendedConfig.strip.request.designationsList.path).toPromise()
    if(response) {
      let request = {
        "request": {
            "courseId": response
        }
      }
      let enollData =  await this.enrollSvc.fetchEnrollContentData(request).toPromise().then(async (res: any) => {
        if (res && res.result && res.result.courses && res.result.courses.length) {
          return res.result.courses
        } else {
          return []
        }
      }).catch((_err: any) => {
        return []
      })
      const sRequest: any = {
        "request": {
          "filters": {
            "identifier": response
          },
          "offset": 0,
          "query": "",
          "sort_by": {
              "lastUpdatedOn": "desc"
          },
        }
      }
      this.seeAllSvc.fetchSearchData(sRequest).subscribe((res: any) => {
        if (res && res.result && res.result.content) {
          let courses = res.result.content
          this.getPilldata(courses, enollData, response)
        }
      })
    }
  }

  getPilldata(courses: any, enollData: any, coursesArray: any){
    let avaialable: any[] = []
    let inprogress: any[] = []
    let completed: any[] = []
    let cbpData: any
    this.widgetSvc.getData('cbpData').subscribe((result => {
      cbpData = result
    }))
    coursesArray.forEach((courseId: any) => {
      let course = courses.find((item: any) => item.identifier === courseId)
      if (course) {
        if (cbpData) {
          const cbpelem = cbpData.find((_course: any) => _course.identifier === course.identifier)
          if (cbpelem) {
            return
          }
        }
        if (enollData && enollData.length) {
          const elem = enollData.find((eCourse: any) => eCourse.contentId === course.identifier)
          if (elem) {
            if (elem.status === 2) {
              completed.push(course)
            } else {
              inprogress.push(course)
            }
          } else {
            avaialable.push(course)
          }
        } else {
          avaialable.push(course)
        }
      }
    })
    this.results.push({name: 'ravailable', courses: this.transformContentsToWidgets(
      avaialable, this.recommendedConfig.strip)}
    )
    this.results.push({name: 'rinprogress', courses: this.transformContentsToWidgets(
      inprogress, this.recommendedConfig.strip)})
    this.results.push({name: 'rcompleted',  courses: this.transformContentsToWidgets(
      completed, this.recommendedConfig.strip)}
    )
    const _courses = this.results.find((key: any) => key.name === this.slectedPill)
    this.content = _courses ? _courses.courses : []
  }

  private transformContentsToWidgets(
    contents: NsContent.IContent[],
    strip: any,
  ) {
    return (contents || []).map((content, idx) => ({
      widgetType: 'card',
      widgetSubType: 'cardContent',
      widgetHostClass: 'mb-2',
      widgetData: {
        content,
        ...(content.batch && {
          batch: content.batch,
        }),
        cardSubType: strip.viewMoreUrl &&  strip.viewMoreUrl.stripConfig
        && strip.viewMoreUrl.stripConfig.cardSubType,
        context: {
          pageSection: strip.key,
          position: idx,
        },
        intranetMode: strip.stripConfig && strip.stripConfig.intranetMode,
        deletedMode: strip.stripConfig && strip.stripConfig.deletedMode,
        contentTags: strip.stripConfig && strip.stripConfig.contentTags,
      },
    }))
  }
  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label.toLowerCase(), type, '')
  }
  
}
