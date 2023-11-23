import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ws-discussions',
  templateUrl: './discussions.component.html',
  styleUrls: ['./discussions.component.scss'],
})

export class DiscussionsComponent implements OnInit{

  @Input("discussionObj") discussion: any;
  @Input("count") count: any;
  @Input("trend") trend: boolean = false;
  countArr: any[] = [];
  dataToBind: any;

  constructor() { }

  ngOnInit() {
    this.countArr =  this.count === 2 ? [1, 2] : [1, 2, 3]; 
    console.log("discussion - ", this.discussion);
    
  }

}
