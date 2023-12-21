import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'ws-competency-search',
  templateUrl: './competency-search.component.html',
  styleUrls: ['./competency-search.component.scss']
})
export class CompetencySearchComponent implements OnInit {

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;
  constructor() { }

  ngOnInit() {
  }

  handleFocus(): void {
    this.searchInput.nativeElement.focus();
  }

}
