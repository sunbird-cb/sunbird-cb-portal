import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ws-discuss-hub',
  templateUrl: './discuss-hub.component.html',
  styleUrls: ['./discuss-hub.component.scss']
})

export class DiscussHubComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.fetchDiscussions();
  }

  fetchDiscussions(): void {
    console.log("Fetching discussions!");
  }

}
