import { Component, OnInit } from '@angular/core';


const noData = {
  "desc" : "Do you have any questions, suggestions or, ideas in your mind? Post it.",
  "linkUrl" : "https://portal.karmayogibm.nic.in/page/learn",
  "linkText" : "Start discussion",
  "iconImg" : "/assets/icons/edit.svg",
}

@Component({
  selector: 'ws-in-sight-side-bar',
  templateUrl: './in-sight-side-bar.component.html',
  styleUrls: ['./in-sight-side-bar.component.scss']
})
export class InsightSideBarComponent implements OnInit {
  profileDataLoading: boolean = false
  enableDiscussion: boolean = false;
  loadSkeleton: boolean = false;
  noDataValue : {} | undefined
  constructor() { }

  ngOnInit() {
    this.profileDataLoading = true;
    this.noDataValue = noData
  }

  handleButtonClick(): void {
    this.loadSkeleton = true;
    setTimeout(() => {
      this.loadSkeleton = false;
      this.enableDiscussion = true;
    }, 1500)
    
  }

}
