import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-all-providers',
  templateUrl: './all-providers.component.html',
  styleUrls: ['./all-providers.component.scss'],
})
export class AllProvidersComponent implements OnInit {
  provider = 'JPAL'
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school' },
    { title: 'All Providers' , url: 'none', icon: '' },
  ]
  constructor() { }

  ngOnInit() {
  }

}
