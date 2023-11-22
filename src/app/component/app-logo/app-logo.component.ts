import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ws-app-logo',
  templateUrl: './app-logo.component.html',
  styleUrls: ['./app-logo.component.scss']
})
export class AppLogoComponent implements OnInit {
  @Input() classList: string = '';
  @Input() path:string = '';
  @Input() logoSrc: string = '';
  constructor() { }

  ngOnInit() {
  }

}
