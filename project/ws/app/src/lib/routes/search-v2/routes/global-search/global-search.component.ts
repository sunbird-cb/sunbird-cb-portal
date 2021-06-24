import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'ws-app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
})
export class GlobalSearchComponent implements OnInit {
  searchParam: any

  constructor(private activated: ActivatedRoute) {
    this.activated.queryParamMap.subscribe(queryParams => {
      if (queryParams.has('q')) {
        this.searchParam = queryParams.get('q')
      }
    })
  }

  ngOnInit() {
  }

}
