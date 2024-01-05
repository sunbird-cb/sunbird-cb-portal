import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WidgetUserService } from '@sunbird-cb/collection/src/public-api';
import {
  NsContent,
} from '@sunbird-cb/collection/src/lib/_services/widget-content.model'
import _ from 'lodash';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { NsCardContent } from '@sunbird-cb/collection/src/lib/card-content-v2/card-content-v2.model';
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(isBetween)
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
  cbpLoader:boolean = false
  filterApplied: boolean = false
  filterCheckOnFilter: boolean= false
  filterObjData: any = {
    "primaryCategory":[],
    "status":[],
    "timeDuration":[], 
    "competencyArea": [], 
    "competencyTheme": [], 
    "competencySubTheme": [], 
    "providers": [] 
  }
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
    this.contentFeedList = this.transformSkeletonToWidgets(this.getFeedStrip())
    this.getCbPlans()
  }

  async getCbPlans() {
    this.cbpLoader = true
    this.widgetSvc.fetchCbpPlanList().subscribe(async (res: any) => {
      if(res.length) {
        this.cbpOriginalData = res
        this.upcommingList = []
        this.contentFeedList = []
        this.overDueList = []
        res = res.sort((a: any, b: any): any => {
          if(a.planDuration === NsCardContent.ACBPConst.OVERDUE && b.planDuration === NsCardContent.ACBPConst.OVERDUE) {
            const firstDate: any = new Date(a.endDate)
            const secondDate: any = new Date(b.endDate)
            return  firstDate > secondDate  ? -1 : 1
          }
        })
        await res.forEach((ele: any) => {
          if (ele.planDuration === 'overdue') {
            this.overDueList.push(ele);
          } else {
            this.upcommingList.push(ele);
          }
        })

        this.contentFeedListCopy = res
        this.contentFeedList = this.transformContentsToWidgets(res, this.getFeedStrip());
        this.upcommingList = this.transformContentsToWidgets(this.upcommingList, this.cbpAllConfig.cbpUpcomingStrips);
        this.overDueList = this.transformContentsToWidgets(this.overDueList, this.cbpAllConfig.cbpUpcomingStrips);
        const all = this.overDueList.length + this.upcommingList.length;
        this.usersCbpCount = {
          upcoming: this.upcommingList.length,
          overdue: this.overDueList.length,
          all: all
        }
      } else {
        this.upcommingList = []
        this.overDueList = []
        this.contentFeedList = []
      }
      this.cbpLoader =false
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
  getFeedStrip(){
    return window.screen.width < 768 ? this.cbpAllConfig.cbpFeedMobileStrip : this.cbpAllConfig.cbpFeedStrip
  }

  toggleFilterEvent(event: any) {
    this.toggleFilter = event
  }
  applyFilter(event: any){
    this.toggleFilter = false
    this.filterObjData = event
    this.filterData(event)
  }
  clearFilterObj(event: any){
    this.filterObjData = event
    this.filterData(event)

  }
  filterData(filterValue: any) {
    let finalFilterValue: any = []
    if(filterValue['primaryCategory'].length ||
    filterValue['status'].length ||
    filterValue['timeDuration'].length ||
    filterValue['competencyArea'].length ||
    filterValue['competencyTheme'].length ||
    filterValue['competencySubTheme'].length ||
    filterValue['providers'].length
    ) {
      let filterAppliedonLocal = false
      this.filteredData = this.cbpOriginalData
      this.filterApplied = true
        if(filterValue['primaryCategory'].length){
          filterAppliedonLocal = filterAppliedonLocal? true : false
          finalFilterValue = (filterAppliedonLocal ? finalFilterValue : this.filteredData).filter((data: any)=> {
            if(filterValue['primaryCategory'].includes(data.primaryCategory)) {
              if(filterValue['primaryCategory'].includes('Moderated Courses') && data.secureSettings){
                return data
              }
              return data 
            }
          })
          filterAppliedonLocal = true
        }

        if(filterValue['status'].length){
          filterAppliedonLocal = filterAppliedonLocal? true : false
          finalFilterValue = (filterAppliedonLocal ? finalFilterValue : this.filteredData).filter((data: any)=> {
            let statusData = filterValue['status'].includes('all')? ['0','1','2']: filterValue['status']
            if(statusData.includes(String(data.contentStatus))) {
              return data 
            }
          })
          filterAppliedonLocal = true
        }


        if(filterValue['timeDuration'].length){
          filterAppliedonLocal = filterAppliedonLocal? true : false
          finalFilterValue = (filterAppliedonLocal ? finalFilterValue : this.filteredData).filter((data: any)=> {
            if(filterValue['timeDuration'].some((time: any)=> 
            {
              let count = Number(time.slice(0,-2))
              if(time.includes('sw')) {
                return dayjs(data.endDate).isSameOrAfter(dayjs(dayjs().subtract(count, 'week'))) && dayjs(data.endDate).isSameOrBefore(dayjs())
              } else if(time.includes('ad')) {
                return dayjs(data.endDate).isSameOrBefore(dayjs(dayjs().add(count, 'day'))) && dayjs(data.endDate).isSameOrAfter(dayjs())
              }  else if(time.includes('sm')) {
                return dayjs(data.endDate).isSameOrAfter(dayjs(dayjs().subtract(count, 'month'))) && dayjs(data.endDate).isSameOrBefore(dayjs())
              }
              return true
            })
            ) {
              return data 
            }
          })
          filterAppliedonLocal = true
        }

        if(filterValue['competencyArea'].length){
          filterAppliedonLocal = filterAppliedonLocal? true : false
          finalFilterValue = (filterAppliedonLocal ? finalFilterValue : this.filteredData).filter((data: any)=> {
            if(filterValue['competencyArea'].some((r: any)=> data.competencyArea.includes(r))) {
              return data 
            }
          })
          filterAppliedonLocal = true
        }

        if(filterValue['competencyTheme'].length){
          filterAppliedonLocal = filterAppliedonLocal? true : false
          finalFilterValue = (filterAppliedonLocal ? finalFilterValue : this.filteredData).filter((data: any)=> {
            if(filterValue['competencyTheme'].some((r: any)=> data.competencyTheme.includes(r))) {
              return data 
            }
          })
          filterAppliedonLocal = true
        }

        if(filterValue['competencySubTheme'].length){
          filterAppliedonLocal = filterAppliedonLocal? true : false
          finalFilterValue = (filterAppliedonLocal ? finalFilterValue : this.filteredData).filter((data: any)=> {
            if(filterValue['competencySubTheme'].some((r: any)=> data.competencySubTheme.includes(r))) {
              return data 
            }
          })
          filterAppliedonLocal = true
        }

        if(filterValue['providers'].length){
          filterAppliedonLocal = filterAppliedonLocal? true : false
          finalFilterValue = (filterAppliedonLocal ? finalFilterValue : this.filteredData).filter((data: any)=> {
            if(filterValue['providers'].includes(data.organisation[0])) {
              return data 
            }
          })
          filterAppliedonLocal = true
        }
  
    } else {
      this.filterApplied = false
      finalFilterValue= this.cbpOriginalData
    }
    this.contentFeedListCopy = finalFilterValue
   
    this.contentFeedList = this.transformContentsToWidgets(finalFilterValue, this.getFeedStrip());
  }

  searchData(event: any) {
    this.filterObjData = {
      "primaryCategory":[],
      "status":[],
      "timeDuration":[], 
      "competencyArea": [], 
      "competencyTheme": [], 
      "competencySubTheme": [], 
      "providers": [] 
    }
    this.applyFilter(this.filterObjData)
    let searchData = this.cbpOriginalData
    let searchFilterData = []
    if (event.query) {
      searchFilterData = searchData.filter((ele :any) => ele.name.toLowerCase().includes(event.query.toLowerCase()))
    } else {
      searchFilterData = this.cbpOriginalData
    }


    this.contentFeedList = this.transformContentsToWidgets(searchFilterData, this.getFeedStrip())
  }
  closeFilterKey(data:any){
    const index = this.filterObjData[data.key].indexOf(data.value);
    if (index > -1) { // only splice array when item is found
      this.filterObjData[data.key].splice(index, 1); // 2nd parameter means remove one item only
    }
    this.applyFilter(this.filterObjData)
  }
  filterValueEmitMethod(event: any) {
    this.filterObjData = event
    this.applyFilter(event)
  }
}
