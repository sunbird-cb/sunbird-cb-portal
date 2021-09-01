import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-provider-overview',
  templateUrl: './provider-overview.component.html',
  styleUrls: ['./provider-overview.component.scss'],
  // tslint:disable-next-line: no-host-metadata-property
  host: { class: 'flex flex-1' },
})
export class ProviderOverviewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
