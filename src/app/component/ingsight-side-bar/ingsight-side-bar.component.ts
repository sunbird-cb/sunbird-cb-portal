import { Component, OnInit } from '@angular/core';


const noData = {
  "desc" : "Do you have any questions, suggestions or, ideas in your mind? Post it.",
  "linkUrl" : "https://portal.karmayogibm.nic.in/page/learn",
  "linkText" : "Start discussion",
  "iconImg" : "/assets/icons/edit.svg",
}
@Component({
  selector: 'ws-ingsight-side-bar',
  templateUrl: './ingsight-side-bar.component.html',
  styleUrls: ['./ingsight-side-bar.component.scss']
})
export class IngsightSideBarComponent implements OnInit {


  noDataValue : {} | undefined

  constructor() { }

  ngOnInit() {
    this.noDataValue = noData
  }

}
