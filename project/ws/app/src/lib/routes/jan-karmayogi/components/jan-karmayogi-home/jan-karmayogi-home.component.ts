import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { JanKarmayogiService } from '../../service/jan-karmayogi.service'
import { MultilingualTranslationsService, NsContent } from '@sunbird-cb/utils'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-app-jan-karmayogi-home',
  templateUrl: './jan-karmayogi-home.component.html',
  styleUrls: ['./jan-karmayogi-home.component.scss'],
})
export class JanKarmayogiHomeComponent implements OnInit {
  pageData: any
  contentList: any = []

  constructor(private janSvc: JanKarmayogiService,
              private route: ActivatedRoute,
              private translate: TranslateService,
              private langtranslations: MultilingualTranslationsService) {
    this.pageData = this.route.parent && this.route.parent.snapshot.data.pageData.data || {}
    this.contentList = this.transformSkeletonToWidgets(this.pageData.janStip)
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      this.translate.setDefaultLang('hi')
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
  }

  ngOnInit() {
    this.getContentData()
  }

  getContentData() {
    const request = {
      'request': {
          'filters': {
              'identifier': this.pageData.doIdList,
          },
          'query': '',
          'sort_by': {
              'lastUpdatedOn': 'desc',
          },
          'fields': [
              'name',
              'appIcon',
              'instructions',
              'description',
              'purpose',
              'mimeType',
              'gradeLevel',
              'identifier',
              'medium',
              'pkgVersion',
              'board',
              'subject',
              'resourceType',
              'primaryCategory',
              'contentType',
              'channel',
              'organisation',
              'trackable',
              'license',
              'posterImage',
              'idealScreenSize',
              'learningMode',
              'creatorLogo',
              'duration',
              'avgRating',
          ],
      },
      'query': '',
    }
    this.janSvc.getSearchResults(request).subscribe((res: any) => {
      if (res && res.result && res.result.content.length) {
        this.contentList = this.transformContentsToWidgets(res.result.content, this.pageData.janStip)
      } else {
        this.contentList = this.transformContentsToWidgets([], this.pageData.janStip)
      }
    })
  }

  private transformSkeletonToWidgets (
    strip: any
  ) {
    return [1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10].map(_content => ({
      widgetType: 'card',
      widgetSubType: 'cardContent',
      widgetHostClass: 'mb-2',
      cardCustomeClass: strip.customeClass ? strip.customeClass : 'mr-8',
      widgetData: {
        cardSubType: strip.viewMoreUrl &&  strip.viewMoreUrl.loaderConfig
        && strip.viewMoreUrl.loaderConfig.cardSubType || 'card-portrait-skeleton',
      },
    }))
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
        cardCustomeClass: strip.customeClass ? strip.customeClass : '',
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

}
