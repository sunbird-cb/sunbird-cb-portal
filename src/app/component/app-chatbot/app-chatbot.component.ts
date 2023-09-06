import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ws-app-chatbot',
  templateUrl: './app-chatbot.component.html',
  styleUrls: ['./app-chatbot.component.scss']
})
export class AppChatbotComponent implements OnInit {

  showIcon :boolean = true
  categories: any[] = ["Karmayogi", "Registration", "Login", "Profile", "Hubs", "Learning, Assessment and Certifications"]

  constructor() { }

  ngOnInit() {

  }

  iconClick() {
    this.showIcon = !this.showIcon
  }

}
