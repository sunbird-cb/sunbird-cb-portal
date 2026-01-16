import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core'
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet'
import { TranslateService } from '@ngx-translate/core'
import { gyaanConstants } from '../../models/gyaan-contants.model'
import { ActivatedRoute } from '@angular/router'
import { Options } from '@angular-slider/ngx-slider'

@Component({
  selector: 'ws-app-gyaan-filter',
  templateUrl: './gyaan-filter.component.html',
  styleUrls: ['./gyaan-filter.component.scss'],
})
export class GyaanFilterComponent implements OnInit {
  minValue = 2000
  maxValue = 2001
  options: Options = {
    floor: 2000,
    ceil: 2012,
    step: 1,
    showTicks: false,
    draggableRange: true,
    onlyBindHandles: true,
  }
  categoryValue = ''
  mobileSelectedFilter: any = {}
  @Input() filterDataLoading = false
  localFilterData: any
  @Input() facetsData: any
  @Input() private facetsDataCopy: any
  @Output() filterChange = new EventEmitter<any>()
  @Input() selectedFilter: any
  selectedContent = 'all'
  gConstants: any
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private bottomSheetRef: MatBottomSheetRef<any>) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }

  ngOnInit() {

    this.gConstants = gyaanConstants
    let yearsData: any = {}
    this.route.queryParams.subscribe((res: any) => {
      this.selectedContent = res.content || 'otherResources'
    })

    if (this.data && this.data.facetsDataCopy) {
      this.facetsData = this.data.facetsData
      this.facetsDataCopy = this.data.facetsDataCopy
      this.filterDataLoading = this.data.filterDataLoading
      this.localFilterData = JSON.parse(JSON.stringify(Object.keys(this.data.selectedFilter).length ?
        this.data.facetsDataCopy : {}))
      // Sanitize localFilterData to ensure all values are objects with values array
      this.sanitizeFacetsData()
      yearsData = this.localFilterData[gyaanConstants.contextYear]
      this.mobileSelectedFilter = JSON.parse(JSON.stringify(
        Object.keys(this.data.selectedFilter).length ? this.data.selectedFilter : {}))
      this.bindSelectedValue()
    } else {
      this.localFilterData = JSON.parse(JSON.stringify(this.facetsDataCopy))
      // Sanitize localFilterData to ensure all values are objects with values array
      this.sanitizeFacetsData()
      yearsData = this.localFilterData[gyaanConstants.contextYear]
    }

    if (yearsData && yearsData.values && yearsData.values.length) {
      this.minValue = Number(yearsData.values[0].name)
      this.maxValue = Number(yearsData.values[yearsData.values.length - 1].name)
      this.options = {
        floor: Number(yearsData.values[0].name),
        ceil: Number(yearsData.values[yearsData.values.length - 1].name),
        step: 1,
        showTicks: false,
      }
    }
  }

  sanitizeFacetsData() {
    // Remove any facet entries that don't have the expected structure
    if (this.localFilterData) {
      Object.keys(this.localFilterData).forEach((key: string) => {
        const facet = this.localFilterData[key]
        // Check if facet value is not an object or doesn't have values array
        if (!facet || typeof facet !== 'object' || !Array.isArray(facet.values)) {
          console.warn(`Invalid facet data for key "${key}":`, facet)
          delete this.localFilterData[key]
        }
      })
    }
  }

  bindSelectedValue() {
    if (this.mobileSelectedFilter) {
      this.selectedFilter = this.mobileSelectedFilter
      Object.keys(this.mobileSelectedFilter).forEach((ele: any) => {
        if (this.localFilterData[ele] && this.localFilterData[ele].values.length) {
          this.localFilterData[ele].values.forEach((subEle: any) => {
            if (this.mobileSelectedFilter[ele].includes(subEle.name)) {
              subEle['checked'] = true
            }
          })
        }
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
  changeSelection(event: any, key: any, keyData: any, allKeyData: any) {
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
      if (key === gyaanConstants.requestSectorName || key === gyaanConstants.requestSubSectorName
        || key === gyaanConstants.contextStateOrUTs || key === gyaanConstants.contextSDGs
      ) {
        if (keyData.name === 'All' && keyData.checked) {
          allKeyData.forEach((filter: any) => {
            filter['checked'] = true
          })
        }
        if (keyData.name === 'All' && !keyData.checked) {
          allKeyData.forEach((filter: any) => {
            filter['checked'] = false
          })
        }
        if (keyData.name !== 'All') {
          const allKey = allKeyData.filter((_filter: any) => _filter.name === 'All')
          if (allKey.length) {
            allKey[0]['checked'] = false
          }
        }
      }

      this.filterChange.emit({ event, key, keyData })
    }
  }

  getSearch(searchValue: any, keyData: any) {
    const facetCopy: any = { ...this.facetsDataCopy }
    const itemData = facetCopy[keyData]

    // Add safety check to ensure itemData and values exist
    if (!itemData || !Array.isArray(itemData.values)) {
      console.warn(`Invalid facet data for search on key "${keyData}":`, itemData)
      return
    }

    const filteredValue = itemData.values.filter((ele: any) => {
      return ele.name && ele.name.toLowerCase().includes(searchValue.toLowerCase())
    })

    if (this.localFilterData[keyData]) {
      this.localFilterData[keyData].values = filteredValue
    }
  }

  onContentChange(event: any) {

    this.selectedContent = event.value
    this.filterChange.emit({ event: true, key: 'content', keyData: event.value })
  }

  formatLabel(value: number): string {
    return `${value}`
  }

  changeSlider(sliderData: any) {
    const yearsList = []
    for (let i = sliderData.value; i <= sliderData.highValue; i = i + 1) {
      yearsList.push(i)
    }
    this.minValue = sliderData.value
    this.maxValue = sliderData.highValue
    this.filterChange.emit({ event: true, key: gyaanConstants.contextYear, keyData: yearsList })
  }
}
