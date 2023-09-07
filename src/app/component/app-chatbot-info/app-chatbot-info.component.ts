import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ws-app-chatbot-info',
  templateUrl: './app-chatbot-info.component.html',
  styleUrls: ['./app-chatbot-info.component.scss']
})
export class AppChatbotInfoComponent implements OnInit {
  level1Questions: any [] = [
    'What is Mission Karmayogi?',
    'What is iGOT?', 'How to register?',
    'I am unable to login?',
    'Why I am unable to get OTP?',
    'Why cannot I find my MDO?']
    showLevel1ItemCount = 3;
    showLevel2ItemCount = 3;
    clickedL1ButtonIndex: number | null = null
    clickedL2ButtonIndex: number | null = null

    level2Questions: any [] = [
      'What is Learn hub?',
      'What are hubs?', 'How is CBP?',
      'How can I start learning?',
      'Why I am unable to get OTP?',
      'Why cannot I find my MDO?']
   constructor() { }

  ngOnInit() {
  }

  getQuestion(count: number){
    return this.level1Questions.slice(0, count)
  }

  onButtonClick(index: number) {
    this.clickedL1ButtonIndex = index;
  }


}
