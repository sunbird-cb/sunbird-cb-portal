import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ws-app-chatbot',
  templateUrl: './app-chatbot.component.html',
  styleUrls: ['./app-chatbot.component.scss']
})
export class AppChatbotComponent implements OnInit {

  showIcon :boolean = true
  categories: any[] = ["Karmayogi", "Registration", "Login", "Profile", "Hubs", "Learning Assessment and Certifications"]
  language: any[] = [
    {value: 'english', viewValue: 'English'},
    {value: 'hindi', viewValue: 'Hindi'},
    {value: 'kannada', viewValue: 'Kannada'},
  ];
  currentFilter: string = 'info'

  constructor() { }

  ngOnInit() {

  }

  iconClick() {
    this.showIcon = !this.showIcon
    this.currentFilter = 'info'
  }

  toggleFilter(tab: string) {
    tab === 'info' ? this.currentFilter = 'info' : this.currentFilter = 'issue'
  }

}
