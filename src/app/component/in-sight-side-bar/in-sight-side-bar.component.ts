import { AUTO_STYLE, animate, state, transition, trigger,style } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

const DEFAULT_DURATION = 500;
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
  clapsDataLoading: boolean = false
  enableDiscussion: boolean = false
  loadSkeleton: boolean = false
  collapsed = false
  constructor() { }

  ngOnInit() {
    setTimeout(()=>{
      this.profileDataLoading = true
      this.clapsDataLoading = true
    },1000)
  }

  handleButtonClick(): void {
    this.loadSkeleton = true;
    setTimeout(() => {
      this.loadSkeleton = false;
      this.enableDiscussion = true;
    }, 1500)
    
  }
  expandCollapse(event:any) {
    this.collapsed = event;
  }
}
