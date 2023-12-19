import { Component, OnInit, ViewChild } from '@angular/core';
// import { HTMLInputElement }

@Component({
  selector: 'ws-competency-passbook',
  templateUrl: './competency-passbook.component.html',
  styleUrls: ['./competency-passbook.component.scss']
})

export class CompetencyPassbookComponent implements OnInit {

  @ViewChild('searchInput') searchInput: any
  constructor() { }

  ngOnInit() {
  }

  handleFocus(): void {
    this.searchInput.nativeElement.focus();
  }

}
