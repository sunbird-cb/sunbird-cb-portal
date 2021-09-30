import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit {
  showSideMenu: Boolean = true
  constructor() { }

  ngOnInit() {
  }
  showMenuButton() {
    this.showSideMenu = this.showSideMenu ? false : true
  }
  closeNav() {
    this.showSideMenu = this.showSideMenu ? false : true
  }
}
