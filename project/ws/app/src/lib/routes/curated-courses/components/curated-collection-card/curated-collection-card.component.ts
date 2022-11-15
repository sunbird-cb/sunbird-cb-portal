import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'ws-app-curated-collection-card',
  templateUrl: './curated-collection-card.component.html',
  styleUrls: ['./curated-collection-card.component.scss'],
})
export class CuratedCollectionCardComponent implements OnInit {
  @Input() collection!: any
  constructor() { }

  ngOnInit() {

  }
}
