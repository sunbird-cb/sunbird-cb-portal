import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ws-app-chatbot',
  templateUrl: './app-chatbot.component.html',
  styleUrls: ['./app-chatbot.component.scss']
})
export class AppChatbotComponent implements OnInit {

  showIcon :boolean = true
  categories: any[] = ["Karmayogi", "Registration", "Login", "Profile", "Hubs", "Learning Assessment and Certifications"]
  foods: any[] = [
    {value: 'english', viewValue: 'English'},
    {value: 'hindi', viewValue: 'Hindi'},
    {value: 'kannada', viewValue: 'Kannada'},
  ];
  constructor() { }

  ngOnInit() {

  }

  iconClick() {
    this.showIcon = !this.showIcon
  }

}
