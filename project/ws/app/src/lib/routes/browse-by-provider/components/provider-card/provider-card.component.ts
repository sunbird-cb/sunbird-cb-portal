import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'ws-app-provider-card',
  templateUrl: './provider-card.component.html',
  styleUrls: ['./provider-card.component.scss'],
})
export class ProviderCardComponent implements OnInit {
  @Input() provider!: any

  constructor() { }

  ngOnInit() {
  }

}
