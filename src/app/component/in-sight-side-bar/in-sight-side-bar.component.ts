import { AUTO_STYLE, animate, state, transition, trigger,style } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

const DEFAULT_DURATION = 500;

const noData = {
  "desc" : "Do you have any questions, suggestions or, ideas in your mind? Post it.",
  "linkUrl" : "https://portal.karmayogibm.nic.in/page/learn",
  "linkText" : "Start discussion",
  "iconImg" : "/assets/icons/edit.svg",
}

@Component({
  selector: 'ws-in-sight-side-bar',
  templateUrl: './in-sight-side-bar.component.html',
  styleUrls: ['./in-sight-side-bar.component.scss'],
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ]
})
export class InsightSideBarComponent implements OnInit {
  profileDataLoading: boolean = false
  enableDiscussion: boolean = false
  loadSkeleton: boolean = false
  noDataValue : {} | undefined
  clapsDataLoading: boolean = false
  collapsed = false
  constructor() { }

  ngOnInit() {
    this.profileDataLoading = true
    this.clapsDataLoading = true
    this.noDataValue = noData
  }

  handleButtonClick(): void {
    this.loadSkeleton = true
    setTimeout(() => {
      this.loadSkeleton = false
      this.enableDiscussion = true
    }, 1500)
    
  }
  expandCollapse(event:any) {
    this.collapsed = event
  }
}
