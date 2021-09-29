import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  showSideMenu: Boolean = true;

  showMenuButton() {
    this.showSideMenu = this.showSideMenu ? false : true;
  }

  closeNav() {
    this.showSideMenu = this.showSideMenu ? false : true;
  }

}
