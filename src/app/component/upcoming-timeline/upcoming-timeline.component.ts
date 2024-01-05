import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'ws-upcoming-timeline',
  templateUrl: './upcoming-timeline.component.html',
  styleUrls: ['./upcoming-timeline.component.scss']
})
export class UpcomingTimelineComponent implements OnInit {

  @Output()
  filterValueEmit = new EventEmitter()
  @Input() upcommingList: any
  @Input() overDueList: any

  tabResults: any[] = []
  tabSelected: any
  dynamicTabIndex = 0
  cbpConfig: any
  seeAllPageConfig: any
  contentDataList : any 
  constructor(
    private activatedRoute:ActivatedRoute
  ) { }

  ngOnInit() {
    if(this.activatedRoute.snapshot.data.pageData) {
      this.cbpConfig = this.activatedRoute.snapshot.data.pageData.Data
    }
  }

  upComingMethod(event: any){
    let upcomingData: any = {
      "primaryCategory":[],
      "status":['0','1','2'],
      "timeDuration":['30ad'], 
      "competencyArea": [], 
      "competencyTheme": [], 
      "competencySubTheme": [], 
      "providers": [] 
    }
    let overDue: any = {
      "primaryCategory":[],
      "status":['0','1'],
      "timeDuration":['3sm'], 
      "competencyArea": [], 
      "competencyTheme": [], 
      "competencySubTheme": [], 
      "providers": [] 
    }
    this.filterValueEmit.emit(event === 'upcoming'? upcomingData: overDue)
  }
  scroll(el: any) {
    let element = el
    let topOfElement: any = document.getElementById(element)
    topOfElement = topOfElement.offsetTop - 140
    window.scroll({ top: topOfElement, behavior: "smooth" });
  }
}
