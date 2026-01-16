import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { TranslateService } from '@ngx-translate/core';
import { MultilingualTranslationsService } from '@sunbird-cb/utils-v2';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
}
@Component({
  selector: 'ws-app-mobile-filters',
  templateUrl: './mobile-filters.component.html',
  styleUrls: ['./mobile-filters.component.scss'],
  providers: [DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class MobileFiltersComponent {

  facetsData: any
  selectedFilters: any = []
  clonedFilters: any = []
  startDate: any = ''
  endDate: any = ''
  @Output() filterChange = new EventEmitter<any>()
  selectedValue: any
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private snackbar: MatSnackBar,
    private datePipe: DatePipe,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
    private bottomSheetRef: MatBottomSheetRef<any>
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }
  ngOnInit() {
    if (this.data) {
      this.facetsData = this.data.facetsData
      this.selectedFilters = JSON.parse(JSON.stringify(this.data.selectedFilters))
      this.clonedFilters = JSON.parse(JSON.stringify(this.data.clonedFilters))
      if (this.selectedFilters.dateRange) {
        this.startDate = this.datePipe.transform(this.selectedFilters.dateRange.fromDate, 'yyyy-MM-dd')
        this.endDate = this.datePipe.transform(this.selectedFilters.dateRange.toDate, 'yyyy-MM-dd')
      }
      if (this.selectedFilters.eventStatus && this.selectedFilters.eventStatus.length) {
        this.selectedValue = { name: this.selectedFilters.eventStatus[0] }
      }
    }
    console.log("data ", this.datePipe)
  }

  returnZero() {
    return 0
  }

  canCheck(key: any, keyData: any) {
    if (this.selectedFilters[key]) {
      return this.selectedFilters[key].includes(keyData.name)
    }
  }

  changeSelection(event: any, key: any, keyData: any, allKeyData: any) {
    console.log('changeSelection', event, key, keyData, allKeyData)
    if (event) {
      if (['resourceType', 'eventDate'].includes(key)) {
        if (this.selectedFilters[key]) {
          let slected = this.selectedFilters[key]
          slected.push(keyData.name)
          this.selectedFilters[key] = slected
        } else {
          this.selectedFilters[key] = [keyData.name]
        }
        if (key === 'eventDate') {
          delete this.selectedFilters.eventStatus
          delete this.selectedFilters.dateRange
          this.startDate = ''
          this.endDate = ''
          this.selectedValue = {}
        }
        if (key === 'eventStatus') {
          delete this.selectedFilters.dateRange
          delete this.selectedFilters.eventDate
          this.startDate = ''
          this.endDate = ''
        }
        delete this.selectedFilters.key
      }
    } else {
      if (['resourceType', 'eventDate'].includes(key)) {
        let filtered = this.selectedFilters[key].filter((item: any) => item !== keyData.name)
        if (filtered.length === 0) {
          delete this.selectedFilters[key]
        } else {
          this.selectedFilters[key] = filtered
        }
      }
    }
  }

  onDateChange(event: any, eType: any, facet: any) {
    console.log(facet, eType, event)
    if (eType.key === 'fromDate') {
      this.startDate = this.datePipe.transform(event.value, 'yyyy-MM-dd')
      this.selectedFilters['dateRange'] = { fromDate: this.startDate }
    }
    if (eType.key === 'toDate') {
      this.endDate = this.datePipe.transform(event.value, 'yyyy-MM-dd')
      this.selectedFilters['dateRange'] = { toDate: this.endDate }
    }
    this.selectedValue = {}
    if (this.selectedFilters.eventDate) {
      delete this.selectedFilters.eventDate
    }
  }

  clearAll() {
    this.selectedFilters = {}
    this.startDate = ''
    this.endDate = ''
    this.selectedValue = {}
  }

  changeStatus(value: any, key: any) {
    this.selectedValue = value
    this.selectedFilters[key] = [value.name]
    delete this.selectedFilters.dateRange
    delete this.selectedFilters.eventDate
    this.startDate = ''
    this.endDate = ''
  }

  applyFilter(type: any): void {
    if (type === 'apply') {
      if (this.selectedFilters.dateRange) {
        if (this.startDate && this.endDate) {
          const date1 = new Date(this.startDate)
          const date2 = new Date(this.endDate)
          if (date1 > date2) {
            this.snackbar.open('Start date should not greater than end date.')
          } else {
            delete this.selectedFilters.eventDate
            delete this.selectedFilters.eventStatus
            this.selectedFilters['dateRange'] = { fromDate: date1, toDate: date2 }
            this.bottomSheetRef.dismiss({
              selectedFilters: this.selectedFilters,
              action: type,
            })
          }
        } else {
          this.snackbar.open('Choose a valid date range.')
        }
      } else {
        this.bottomSheetRef.dismiss({
          selectedFilters: this.selectedFilters,
          action: type,
        })
      }
    } else {
      this.bottomSheetRef.dismiss({
        selectedFilters: this.clonedFilters,
        action: type,
      })
    }
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateActualLabel(label, type, '')
  }

}
