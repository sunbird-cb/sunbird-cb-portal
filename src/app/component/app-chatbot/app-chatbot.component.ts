import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ws-app-chatbot',
  templateUrl: './app-chatbot.component.html',
  styleUrls: ['./app-chatbot.component.scss']
})
export class AppChatbotComponent implements OnInit {

  showIcon :boolean = true

  constructor() { }

  ngOnInit() {
  }

  iconClick() {
    this.showIcon = !this.showIcon
  }

}
