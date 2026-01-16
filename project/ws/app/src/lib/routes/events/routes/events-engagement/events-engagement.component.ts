import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import * as _ from 'lodash'
import { MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import { Router } from '@angular/router';


@Component({
  selector: 'ws-app-events-engagement',
  templateUrl: './events-engagement.component.html',
  styleUrls: ['./events-engagement.component.scss']
})
export class EventsEngagementComponent implements OnInit {

  @Input() myEngagements: any
  @Input() engagementDetails: any
  bottomSheet = false

  constructor(
    private bottomSheetRef: MatBottomSheetRef<any>,
    @Inject(MAT_BOTTOM_SHEET_DATA) @Optional() public data: any,
    private langtranslations: MultilingualTranslationsService,
    private router: Router,
  ) {
    if (this.data && this.data.engagements) {
      this.myEngagements = this.data.engagements
      this.engagementDetails = this.data.engagementDetails
      this.bottomSheet = true
    }
  }

  ngOnInit(): void {
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateActualLabel(label, type, '')
  }

  getValue(key: string): string {
    let value = ''
    if (key && this.engagementDetails) {
      value = _.get(this.engagementDetails, key, '')
    }
    return value
  }

  closeDiaolg() {
    this.bottomSheetRef.dismiss()
  }

  redirectToEvents() {
    if (this.bottomSheetRef && this.bottomSheet) {
      this.bottomSheetRef.dismiss()
    }
    this.router.navigate([`app/seeAll/new`], {
      queryParams: { key: 'continueLearning', tabSelected: 'Events', pillSelected: 'completed' }
    })
  }

}
