import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'ws-widget-discussions',
  templateUrl: './discussions.component.html',
  styleUrls: ['./discussions.component.scss'],
})

export class DiscussionsComponent implements OnInit {

  @Input() discussion: any
  @Input() count: any
  @Input() trend = false
  countArr: any[] = []
  dataToBind: any

  constructor() { }

  ngOnInit() {
    this.countArr =  this.count === 2 ? [1, 2] : [1, 2, 3]
  }

}
