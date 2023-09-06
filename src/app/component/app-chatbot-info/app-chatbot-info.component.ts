import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ws-app-chatbot-info',
  templateUrl: './app-chatbot-info.component.html',
  styleUrls: ['./app-chatbot-info.component.scss']
})
export class AppChatbotInfoComponent implements OnInit {
  defaultQuestions: any [] = ['What is Mission Karmayogi?', 'What is iGOT?', 'How to register?']
   constructor() { }

  ngOnInit() {
  }

}
