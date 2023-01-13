import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'ws-app-curated-popular-card',
  templateUrl: './curated-popular-card.component.html',
  styleUrls: ['./curated-popular-card.component.scss'],
})
export class CuratedPopularCardComponent implements OnInit {
  @Input() collection!: any
  constructor() { }

  ngOnInit() {
    console.log(this.collection, 'collection value single page======')
    if(this.collection.name) {
      
    }
  }

}
