import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'ws-app-popular-provider-card',
  templateUrl: './popular-provider-card.component.html',
  styleUrls: ['./popular-provider-card.component.scss'],
})
export class PopularProviderCardComponent implements OnInit {
  @Input() provider!: any
  constructor() { }

  ngOnInit() {
  }

}
