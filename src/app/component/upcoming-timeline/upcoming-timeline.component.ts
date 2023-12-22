import { Component, OnInit } from '@angular/core';
import {
  NsContent,
} from '@sunbird-cb/collection/src/lib/_services/widget-content.model'
import {
  NsContentStripWithTabs,
} from '@sunbird-cb/collection/src/lib/content-strip-with-tabs/content-strip-with-tabs.model'
// tslint:disable-next-line
import _ from 'lodash'
import { WidgetUserService } from '@sunbird-cb/collection/src/public-api';
import { ConfigurationsService } from '@sunbird-cb/utils/src/public-api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ws-upcoming-timeline',
  templateUrl: './upcoming-timeline.component.html',
  styleUrls: ['./upcoming-timeline.component.scss']
})
export class UpcomingTimelineComponent implements OnInit {

  tabResults: any[] = []
  tabSelected: any
  dynamicTabIndex = 0
  cbpConfig: any
  seeAllPageConfig: any
  contentDataList : any = [
    {
        "widgetType": "card",
        "widgetSubType": "cardContent",
        "widgetHostClass": "mb-2 width-unset",
        "widgetData": {
            "content": {
                "trackable": {
                    "enabled": "Yes",
                    "autoBatch": "No"
                },
                "instructions": "<p>Advanced NLP</p>\n",
                "identifier": "do_113945118526799872147",
                "programDuration": 1,
                "purpose": "Advanced NLP",
                "channel": "0133783095823810560",
                "organisation": [
                    "Dept of Project management"
                ],
                "description": "Advanced NLP",
                "mimeType": "application/vnd.ekstep.content-collection",
                "posterImage": "https://portal.karmayogibm.nic.in/content-store/content/do_113926668087255040159/artifact/do_113926668087255040159_1700032725663_capture141700032725640.png",
                "idealScreenSize": "normal",
                "version": 2,
                "pkgVersion": 1,
                "objectType": "Content",
                "duration": "0",
                "license": "CC BY 4.0",
                "appIcon": "https://static.karmayogiprod.nic.in/igotbm/collection/do_113945118526799872147/artifact/do_113926668087255040159_1700032725663_capture141700032725640.thumb.png",
                "primaryCategory": "Blended Program",
                "name": "Advanced NLP",
                "contentType": "Course"
            },
            "cardCustomeClass":"width-unset",
            "cardSubType": "card-portrait-click",
            "context": {
                "pageSection": "blendedPrograms",
                "position": 0
            }
        }
    },
    {
        "widgetType": "card",
        "widgetSubType": "cardContent",
        "widgetHostClass": "mb-2",
        "widgetData": {
            "content": {
                "trackable": {
                    "enabled": "Yes",
                    "autoBatch": "No"
                },
                "instructions": "<p>Project management PMP BP</p>\n",
                "identifier": "do_113913337446875136123",
                "programDuration": 2,
                "purpose": "Project management PMP BP",
                "channel": "0133783095823810560",
                "organisation": [
                    "test"
                ],
                "description": "Project management PMP BP",
                "mimeType": "application/vnd.ekstep.content-collection",
                "posterImage": "https://portal.karmayogibm.nic.in/content-store/content/do_1138431455174656001138/artifact/do_1138431455174656001138_1689837099517_capture61689837100255.png",
                "idealScreenSize": "normal",
                "version": 2,
                "pkgVersion": 1,
                "objectType": "Content",
                "duration": "0",
                "license": "CC BY 4.0",
                "appIcon": "https://static.karmayogiprod.nic.in/igotbm/collection/do_113913337446875136123/artifact/do_1138431455174656001138_1689837099517_capture61689837100255.thumb.png",
                "primaryCategory": "Blended Program",
                "name": "Project management PMP BP",
                "contentType": "Course"
            },
            "cardCustomeClass":"width-unset",
            "cardSubType": "card-portrait-click",
            "context": {
                "pageSection": "blendedPrograms",
                "position": 1
            }
        }
    }
]
  constructor(
    private activatedRoute:ActivatedRoute,
    private configSvc: ConfigurationsService,
    private userSvc: WidgetUserService,
  ) { }

  ngOnInit() {
    if(this.activatedRoute.snapshot.data.pageData) {
      this.cbpConfig = this.activatedRoute.snapshot.data.pageData.data
     // this.cbpConfig = this.activatedRoute.snapshot.data.pageData.data.cbpConfig; 
    }
    let keyData = 'continueLearning'
    
    this.cbpConfig.cbpStrips.forEach((ele: any) => {
      if (ele && ele.strips.length > 0) {
        ele.strips.forEach((subEle: any) => {
          if (subEle.key === keyData) {
            this.seeAllPageConfig = subEle
          }
        })
      }
    })
    this.fetchFromEnrollmentList(this.seeAllPageConfig)
  }


  splitEnrollmentTabsData(contentNew: NsContent.IContent[], strip: NsContentStripWithTabs.IContentStripUnit) {
    const tabResults: any[] = []
    const splitData = this.getInprogressAndCompleted(
      contentNew,
      (e: any) => e.completionStatus === 1 || e.completionPercentage < 100,
      strip,
    )

    if (strip.tabs && strip.tabs.length) {
      for (let i = 0; i < strip.tabs.length; i += 1) {
        if (strip.tabs[i]) {
          tabResults.push(
            {
              ...strip.tabs[i],
              ...(splitData.find(itmInner => {
                if (strip.tabs && strip.tabs[i] && itmInner.value === strip.tabs[i].value) {
                  return itmInner
                }
                return undefined
              })),
            }
          )
        }
      }
    }
    return tabResults
  }
  getInprogressAndCompleted(array: NsContent.IContent[],
    customFilter: any,
    strip: NsContentStripWithTabs.IContentStripUnit) {
const inprogress: any[] = []
const completed: any[] = []
array.forEach((e: any, idx: number, arr: any[]) => (customFilter(e, idx, arr) ? inprogress : completed).push(e))
return [
{ value: 'inprogress', widgets: this.transformContentsToWidgets(inprogress, strip) },
{ value: 'completed', widgets: this.transformContentsToWidgets(completed, strip) }]
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
fetchFromEnrollmentList(strip: NsContentStripWithTabs.IContentStripUnit, _calculateParentStatus = true) {
  if (strip.request && strip.request.enrollmentList && Object.keys(strip.request.enrollmentList).length) {
    let userId = ''
    let content: NsContent.IContent[]
    let contentNew: NsContent.IContent[]
    this.tabResults = []
    const queryParams = _.get(strip.request.enrollmentList, 'queryParams')
    if (this.configSvc.userProfile) {
      userId = this.configSvc.userProfile.userId
    }
    // tslint:disable-next-line: deprecation
    this.userSvc.fetchUserBatchList(userId, queryParams).subscribe(
      (result: any) => {
        const courses = result && result.courses
        if (courses && courses.length) {
          content = courses.map((c: any) => {
            const contentTemp: NsContent.IContent = c.content
            contentTemp.completionPercentage = c.completionPercentage || c.progress || 0
            contentTemp.completionStatus = c.completionStatus || c.status || 0
            contentTemp.enrolledDate = c.enrolledDate || ''
            contentTemp.lastContentAccessTime = c.lastContentAccessTime || ''
            contentTemp.issuedCertificates = c.issuedCertificates || []
            return contentTemp
          })
        }

        // To sort in descending order of the enrolled date
        contentNew = (content || []).sort((a: any, b: any) => {
          const dateA: any = new Date(a.lastContentAccessTime || 0)
          const dateB: any = new Date(b.lastContentAccessTime || 0)
          return dateB - dateA
        })
        if (strip.tabs && strip.tabs.length) {
          this.tabResults = this.splitEnrollmentTabsData(contentNew, strip)
          this.dynamicTabIndex = _.findIndex(this.tabResults, (v: any) => v.label === this.tabSelected)
        } else {
        }
      },
      () => {
      }
    )
  }
}

}
