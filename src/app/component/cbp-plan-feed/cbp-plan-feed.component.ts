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
  @Input()
  filterObject: any
  @Input() filterApplied:boolean = false
  @Output() toggleFilterEvent = new EventEmitter()
  @Output() searchRequest = new EventEmitter()
  @Output() closeFilterKey = new EventEmitter()

  filterValuesBinding: any ={
    'status':{
      '0': 'Not started',
      '1':'In progress',
      '2': 'Completed'
    },
    'timeDuration': {
      '7ad': 'Upcoming 7 Days',
      '30ad': 'Upcoming 30 Days',
      '90ad': 'Upcoming 3 Months',
      '182ad': 'Upcoming 6 Months',
      '1sw': 'Last week',
      '1sm': 'Last month',
      '3sm': 'Last 3 month',
      '6sm': 'Last 6 month',
      '12sm': 'Last year'
    }
  }

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
    const bottomSheetRef = this.bottomSheet.open(FilterComponent,{
      panelClass: 'filter-cbp',
      ariaLabel: 'Share on social media',
      data: {
        filterObj: this.filterObject
      }
    });
    bottomSheetRef.afterDismissed().subscribe((dataFromChild) => {
      console.log(dataFromChild,'datadfghjkjhgfghj');
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
  CloseFilter(value: any,key: any){
    this.closeFilterKey.emit({value, key})
  }

}
