import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ws-in-sight-side-bar',
  templateUrl: './in-sight-side-bar.component.html',
  styleUrls: ['./in-sight-side-bar.component.scss']
})
export class InsightSideBarComponent implements OnInit {

  enableDiscussion: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  handleButtonClick(): void {
    this.enableDiscussion = true;
  }

}
