import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, MatBottomSheetRef} from '@angular/material/bottom-sheet'

@Component({
  selector: 'ws-app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  providers: [
    { provide: MatBottomSheetRef, useValue: {} },
    {provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ],
})
export class FilterComponent implements OnInit {
  @Output() toggleFilter = new EventEmitter()
  constructor(private bottomSheetRef: MatBottomSheetRef<FilterComponent>) { }

  ngOnInit() {
  }

  hideFilter() {
    this.toggleFilter.emit(false)
  }
  openLink(): void {
    if( this.bottomSheetRef)
      this.bottomSheetRef.dismiss(); 
  } 
}
