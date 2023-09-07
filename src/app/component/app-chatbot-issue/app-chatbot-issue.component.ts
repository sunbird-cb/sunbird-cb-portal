import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ws-app-chatbot-issue',
  templateUrl: './app-chatbot-issue.component.html',
  styleUrls: ['./app-chatbot-issue.component.scss']
})
export class AppChatbotIssueComponent implements OnInit {

  level1Questions: any [] = [
    'What is Mission Karmayogi?',
    'What is iGOT?', 'How to register?',
    'I am unable to login?',
    'Why I am unable to get OTP?',
    'Why cannot I find my MDO?']
    showLevel1ItemCount = 3;
    showLevel2ItemCount = 3;
    clickedL1ButtonIndex: number | null = null

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
