import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'ws-app-karmapoints-panel',
  templateUrl: './karmapoints-panel.component.html',
  styleUrls: ['./karmapoints-panel.component.scss'],
})
export class KarmaPointsPanelComponent implements OnInit {
    @Input() btntype: any
    @Input() data: any = []
    @Input() btnCategory = ''
    kpData: any

  constructor() { }

  ngOnInit() {
    this.data.forEach((item: any) => {
        if (item.displayButton === this.btntype) {
            this.kpData = item
        }
    })
  }

}
