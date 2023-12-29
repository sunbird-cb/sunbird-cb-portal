import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatBottomSheet } from '@angular/material/bottom-sheet'
import { FilterComponent } from './../filter/filter.component'
import { ActivatedRoute } from '@angular/router'
import { distinctUntilChanged } from 'rxjs/operators'

@Component({
  selector: 'ws-cbp-plan-feed',
  templateUrl: './cbp-plan-feed.component.html',
  styleUrls: ['./cbp-plan-feed.component.scss']
})
export class CbpPlanFeedComponent implements OnInit {

  searchControl = new FormControl('')
  toggleFilter: boolean = false
  contentDataList : any = []
  cbpConfig: any
  @Input()
  contenFeedList: any
  @Output() toggleFilterEvent = new EventEmitter()
  @Output() searchRequest = new EventEmitter()

  constructor(
    private bottomSheet: MatBottomSheet,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    if(this.activatedRoute.snapshot.data.pageData) {
      this.cbpConfig = this.activatedRoute.snapshot.data.pageData.data
    }
    this.searchControl.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(() => {
      this.emitSearchEvent()
    })
  }

  emitSearchEvent() {
    this.searchRequest.emit({ query: this.searchControl.value })
  }

  showBottomSheet(): void {
    this.bottomSheet.open(FilterComponent,{
      panelClass: 'filter-cbp',
      ariaLabel: 'Share on social media'
    });
  }
  
  openFilter() {
    if(window.screen.width < 768) {
      this.showBottomSheet()
    } else {
      this.toggleFilter = true
      this.toggleFilterEvent.emit(this.toggleFilter)
    }
  }

}
