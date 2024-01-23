import { Component, OnInit } from '@angular/core'
import { MatTabChangeEvent } from '@angular/material'

@Component({
  selector: 'ws-widget-content-toc',
  templateUrl: './content-toc.component.html',
  styleUrls: ['./content-toc.component.scss'],
})

export class ContentTocComponent implements OnInit {

  tabChangeValue: any = ''
  constructor() { }

  ngOnInit() {
  }

  handleTabChange(event: MatTabChangeEvent): void {
    this.tabChangeValue = event.tab
  }

}
