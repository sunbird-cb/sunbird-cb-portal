import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WidgetUserService } from '@sunbird-cb/collection/src/public-api';
import {
  NsContent,
} from '@sunbird-cb/collection/src/lib/_services/widget-content.model'
import _ from 'lodash';
@Component({
  selector: 'ws-cbp-plan',
  templateUrl: './cbp-plan.component.html',
  styleUrls: ['./cbp-plan.component.scss']
})
export class CbpPlanComponent implements OnInit {
  cbpConfig: any
  cbpAllConfig: any
  usersCbpCount: any;
  upcommingList: any = []
  overDueList: any = []
  toggleFilter: boolean = false
  cbpOriginalData: any
  filteredData: any
  contentFeedListCopy: any
  contentFeedList: any
  mobileTopHeaderVisibilityStatus = true;
  constructor(
    private activatedRoute:ActivatedRoute,
    private widgetSvc: WidgetUserService
    ) { }

  ngOnInit() {
    if(this.activatedRoute.snapshot.data.pageData) {
      this.cbpConfig = this.activatedRoute.snapshot.data.pageData.data.cbpConfig
     this.cbpAllConfig = this.activatedRoute.snapshot.data.pageData.data
    }
    this.upcommingList = this.transformSkeletonToWidgets(this.cbpAllConfig.cbpUpcomingStrips)
    this.overDueList = this.transformSkeletonToWidgets(this.cbpAllConfig.cbpUpcomingStrips)
    this.contentFeedList = this.transformSkeletonToWidgets(this.cbpAllConfig.cbpFeedStrip)
    this.getCbPlans()
  }

  async getCbPlans() {
    this.widgetSvc.fetchCbpPlanList().subscribe(async (res: any) => {
      if(res.length) {
        this.cbpOriginalData = res
        this.upcommingList = []
        this.contentFeedList = []
        this.overDueList = []
        await res.forEach((ele: any) => {
          if (ele.planDuration === 'overdue') {
            this.overDueList.push(ele);
          } else {
            this.upcommingList.push(ele);
          }
        })
        this.contentFeedListCopy = res
        this.contentFeedList = this.transformContentsToWidgets(res, this.cbpAllConfig.cbpFeedStrip);
        this.upcommingList = this.transformContentsToWidgets(this.upcommingList, this.cbpAllConfig.cbpUpcomingStrips);
        this.overDueList = this.transformContentsToWidgets(this.overDueList, this.cbpAllConfig.cbpUpcomingStrips);
        const all = this.overDueList.length + this.upcommingList.length;
        this.usersCbpCount = {
          upcoming: this.upcommingList.length,
          overdue: this.overDueList.length,
          all: all
        }
      }
    })
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
  private transformSkeletonToWidgets(
    strip: any
  ) {
    return [1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10].map(_content => ({
      widgetType: 'card',
      widgetSubType: 'cardContent',
      widgetHostClass: 'mb-2',
      cardCustomeClass: strip.customeClass ? strip.customeClass : '',
      widgetData: {
        cardSubType: strip.viewMoreUrl &&  strip.viewMoreUrl.loaderConfig
        && strip.viewMoreUrl.loaderConfig.cardSubType || 'card-portrait-skeleton',
      },
    }))
  }

  toggleFilterEvent(event: any) {
    this.toggleFilter = event
  }
  applyFilter(event: any){
    this.toggleFilter = false
    this.filterData(event)
  }
  filterData(filterValue: any) {
    this.filteredData = this.cbpOriginalData
    let finalFilterValue: any = []
    this.filteredData.forEach((data: any)=> {
    if((filterValue['primaryCategory'].length > 0 && filterValue['primaryCategory'].includes(data.primaryCategory))){
        finalFilterValue.push(data)
      }
      //   Object.keys(filterValue).forEach((ele: any) => {
      //       if(filterValue[ele].length > 0) {
      //         if(filterValue[ele].includes(data.primaryCategory))  {
      //           finalFilterValue.push(data)
      //         }
      //       }
      // })
    })

    this.contentFeedListCopy = finalFilterValue
   
    this.contentFeedList = this.transformContentsToWidgets(finalFilterValue, this.cbpAllConfig.cbpFeedStrip);

  }

  searchData(event: any) {
    debugger
    let searchData = this.contentFeedListCopy
    let searchFilterData = []
    if (event.query) {
      searchFilterData = searchData.filter((ele :any) => ele.name.toLowerCase().includes(event.query.toLowerCase()))
    } else {
      searchFilterData = this.contentFeedListCopy
    }


    this.contentFeedList = this.transformContentsToWidgets(searchFilterData, this.cbpAllConfig.cbpFeedStrip)
  }
}
