import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'ws-app-karmapoints-panel',
  templateUrl: './karmapoints-panel.component.html',
  styleUrls: ['./karmapoints-panel.component.scss'],
})
export class KarmaPointsPanelComponent implements OnInit {
    @Input() btntype: any
    @Input() data: any = []
    @Input() btnCategory = ''
    @Output() newItemEvent = new EventEmitter<string>();
    kpData: any

  constructor() { }

  ngOnInit() {
    this.data.forEach((item: any) => {
        if (item.displayButton === this.btntype) {
            this.kpData = item
        }
    })
  }

  onClickOfClaim() {
    this.newItemEvent.emit('claim')
  }

}
