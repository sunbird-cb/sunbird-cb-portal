import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core'
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material'
import { TranslateService } from '@ngx-translate/core'
import { gyaanConstants } from '../../models/gyaan-contants.model'

@Component({
  selector: 'ws-app-gyaan-filter',
  templateUrl: './gyaan-filter.component.html',
  styleUrls: ['./gyaan-filter.component.scss'],
})
export class GyaanFilterComponent implements OnInit {

  categoryValue = ''
  mobileSelectedFilter: any = {}
  @Input()  filterDataLoading = false
  localFilterData: any
  @Input() facetsData: any
  @Input() private facetsDataCopy: any
  @Output() filterChange = new EventEmitter<any>()
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    public translate: TranslateService,
    private bottomSheetRef: MatBottomSheetRef<any>) {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
     }

  ngOnInit() {

    if (this.data && this.data.facetsDataCopy) {
      this.facetsData = this.data.facetsData
      this.facetsDataCopy = this.data.facetsDataCopy
      this.filterDataLoading = this.data.filterDataLoading
      this.localFilterData = JSON.parse(JSON.stringify(Object.keys(this.data.selectedFilter).length ?
      this.data.facetsDataCopy : {}))
      this.mobileSelectedFilter = JSON.parse(JSON.stringify(
        Object.keys(this.data.selectedFilter).length ? this.data.selectedFilter : {}))
      this.bindSelectedValue()
    } else {
      this.localFilterData = JSON.parse(JSON.stringify(this.facetsDataCopy))
    }
  }

  bindSelectedValue() {
    if (this.mobileSelectedFilter) {
      Object.keys(this.mobileSelectedFilter).forEach((ele: any) => {
        this.localFilterData[ele].values.forEach((subEle: any) => {
          if (this.mobileSelectedFilter[ele].includes(subEle.name)) {

            subEle['checked'] = true
          }

        })
      })

    }
  }

  // this openLink method is used to close the bottomsheet
  openLink(type: any): void {
    if (type === 'apply') {
      this.bottomSheetRef.dismiss({
        filter: this.mobileSelectedFilter,
        facetData: this.facetsData,
      })
    } else {
      this.bottomSheetRef.dismiss({
        filter: this.data.selectedFilter,
        facetData: this.facetsData,
      })
    }
  }

  clearFilter() {
    Object.keys(this.mobileSelectedFilter).forEach((ele: any) => {
      if (ele !== 'resourceCategory') {
        this.facetsData[ele].values.forEach((subEle: any) => {
          if (this.mobileSelectedFilter[ele].includes(subEle.name)) {
            subEle['checked'] = false
          }
          const index = this.mobileSelectedFilter[ele].findIndex((x: any) => x === subEle.name)
          this.mobileSelectedFilter[ele].splice(index, 1)
        })
        if (Object.keys(this.facetsData).length) {
          this.localFilterData = JSON.parse(JSON.stringify(this.facetsData))
        }
      } else {
        this.mobileSelectedFilter[gyaanConstants.resourceCategory] = ''
      }
    })
    // this.bottomSheetRef.dismiss(this.mobileSelectedFilter)
  }

  // to remove object sorting
  returnZero() {
    return 0
  }
  // changeSelection method will trigger on
  // selection of sectors and subsectors
  changeSelection(event: any, key: any, keyData: any) {
    if (window.innerWidth < 768) {
      if (key === 'resourceCategory') {
        this.mobileSelectedFilter[key] = keyData.name
      } else {
        if (this.mobileSelectedFilter && this.mobileSelectedFilter[key] && this.mobileSelectedFilter[key].includes(keyData.name)) {
          const index = this.mobileSelectedFilter[key].findIndex((x: any) => x === keyData.name)
          this.mobileSelectedFilter[key].splice(index, 1)
        } else {
          if (this.mobileSelectedFilter[key] && this.mobileSelectedFilter[key].length) {
            this.mobileSelectedFilter[key].push(keyData.name)
          } else {
            this.mobileSelectedFilter[key] = [keyData.name]
          }
        }
        keyData['checked'] = event
    }
  } else {
      keyData['checked'] = event
      this.filterChange.emit({ event, key, keyData })

    }
    }

    getSearch(searchValue: any, keyData: any) {
      const facetCopy: any = { ...this.facetsDataCopy }
      const itemData = facetCopy[keyData]
      const filteredValue =  itemData.values.filter((ele: any) => {
        return ele.name.toLowerCase().includes(searchValue.toLowerCase())
      })
      this.localFilterData[keyData].values = filteredValue
    }
}
