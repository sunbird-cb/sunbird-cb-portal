import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'ws-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss'],
})
export class NoDataComponent implements OnInit {
  @Input() noDataValue: any
  noData: any
  constructor() { }

  ngOnInit() {
    this.noData = this.noDataValue
  }

}
