import { Component, Input, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChildren, Inject } from '@angular/core'
import { MAT_BOTTOM_SHEET_DATA, MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, MatBottomSheetRef} from '@angular/material/bottom-sheet'
import { FormControl } from '@angular/forms';
import { AppCbpPlansService } from 'src/app/services/app-cbp-plans.service';
import _ from 'lodash';
@Component({
  selector: 'ws-app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  providers: [
    { provide: MatBottomSheetRef, useValue: {} },
    {provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} }
  ],
})
export class FilterComponent implements OnInit {
  @Output() toggleFilter = new EventEmitter()
  @Output() getFilterData = new EventEmitter();
  @Output() clearFilterObj = new EventEmitter();
  @Input() clearFilterFlag:any;
  @Input() from:any;
  @Input() designationList:any;
  @Input() filterObj:any;
  @Input() showAdditionalFilters: boolean = true;

  timeDuration: any = [{ "id": '1w', name: 'Last week', checked: false }, { "id": 1, name: 'Last month', checked: false }, { "id": 3, name: 'Last 3 months', checked: false }, { "id": 6, name: 'Last 6 months', checked: false }, { "id": 12, name: 'Last year', checked: false }];
  contentStatus: any = [{ "id": '1', name: 'In progress', checked: false }, { "id": '0', name: 'Not started', checked: false }, { "id": '2', name: 'Completed', checked: false }];
  primaryCategoryList: any = [{ "id": "Course", name: 'Course',checked: false }, { "id": 'Program', name: 'Program',checked: false }];
  providersList: any[] = [];
  selectedProviders: any[] = [];
  competencyTypeList: any = [];  
  competencyList: any = [];
  competencyThemeList: any[] = [];
  competencySubThemeList: any[] = [];
  filterObjEmpty: any = {
    "primaryCategory":[],
    "status":[],
    "timeDuration":[], 
    "competencyArea": [], 
    "competencyTheme": [], 
    "competencySubTheme": [], 
    "providers": [] 
  };
  searchThemeControl = new FormControl();
  @ViewChildren("checkboxes") checkboxes!: QueryList<ElementRef>;
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<FilterComponent>, private appCbpPlansService : AppCbpPlansService) {
      if(this.data) {
        this.filterObj = this.data.filterObj

      }
     }


  openLink(): void {
    if( this.bottomSheetRef)
      this.bottomSheetRef.dismiss(); 
  } 
  ngOnInit() {
      this.getFilterEntity();
      this.getProviders();
      this.bindFilter()
  }

  getFilterEntity() {
    let filterObj = {
      "search": {
        "type": "Competency Area"
      },
      "filter": {
        "isDetail": true
      }
    }
    this.appCbpPlansService.getFilterEntity(filterObj).subscribe((res: any) => {
      this.competencyList = res;
      this.manageCompetency();

    })
  }
  manageCompetency() {
    this.competencyList.forEach((competency : any) => {
      let data: any = {
        id: competency.name,
        name:competency.name,
        checked: false,
        children: competency.children
      }
      this.competencyTypeList.push(data)
    });
    this.competencyTypeList =  _.orderBy(this.competencyTypeList, ['id'],['asc'])

    this.bindFilter()
  }
  getProviders() {
    this.appCbpPlansService.getProviders().subscribe((res: any) => {
      this.providersList = res
      this.bindProviders()
    })
  }

  hideFilter() {
    this.toggleFilter.emit(false)
  }

  checkedProviders(event: any, item: any) {
    if (event) {
      this.selectedProviders.push(item);
      this.filterObj['providers'].push(item.name);
    } else {
      if (this.filterObj['provider'].indexOf(item.name) > -1) {
        const index = this.filterObj['providers'].findIndex((x: any) => x === item.name)
        this.filterObj['providers'].splice(index, 1)
      }
    }
  }

  getCompetencyTheme(event: any, ctype: any, pushValue: boolean = true) {
    if (event.checked) {
      this.competencyList.map((citem: any) => {
        if (citem.name === ctype.id) {
          citem.children.map((themechild: any) => {
            themechild['parent'] = ctype.id;
          })
          if(this.filterObj['competencyArea'] && pushValue) {
            this.filterObj['competencyArea'].push(citem.name);
          }          
          this.competencyThemeList = this.competencyThemeList.concat(citem.children);
        }
      })
    } else {     
      this.competencyThemeList = this.competencyThemeList.filter((sitem) => {
        return sitem.parent != ctype.id
      })
      if (this.filterObj['competencyArea'].indexOf(ctype.id) > -1) {
        const index = this.filterObj['competencyArea'].findIndex((x: any) => x === ctype.id)
        this.filterObj['competencyArea'].splice(index, 1);
      }
    }
    this.bindCompetencyTheme()
  }

  getCompetencySubTheme(event: any, cstype: any, pushValue: boolean = true) {
    if (event.checked) {
      this.competencyThemeList.map((csitem: any) => {
        if (csitem.name === cstype.name) {
          csitem.children.map((subthemechild: any) => {
            subthemechild['parentType'] = csitem.parent;
            subthemechild['parent'] = csitem.name;
          })
          this.competencySubThemeList = this.competencySubThemeList.concat(csitem.children);
          if(pushValue) {
            this.filterObj['competencyTheme'].push(cstype.name)
          }
        }
      })
    } else {
      this.competencySubThemeList = this.competencySubThemeList.filter((sitem) => {
        return sitem.parent != cstype.name
      })
      if (this.filterObj['competencyTheme'].indexOf(cstype.name) > -1) {
        const index = this.filterObj['competencyTheme'].findIndex((x: any) => x === cstype.name)
        this.filterObj['competencyTheme'].splice(index, 1)
      }
    }
    this.bindCompetencySubTheme()
  }



  manageCompetencySubTheme(event: any, csttype: any) {
    if (event.checked) {
      this.filterObj['competencySubTheme'].push(csttype.name);
    } else {
      if (this.filterObj['competencySubTheme'].indexOf(csttype.name) > -1) {
        const index = this.filterObj['competencySubTheme'].findIndex((x: any) => x === csttype.name)
        this.filterObj['competencySubTheme'].splice(index, 1)
      }
    }

  }

  applyFilter() {
    this.getFilterData.emit(this.filterObj)
  }

  clearFilter() {
    this.getFilterData.emit(this.filterObjEmpty)
    
  }

  clearFilterWhileSearch() {
    if(this.checkboxes) {
      this.checkboxes.forEach((element: any) => {
        element['checked'] = false;
      });
    }
  }
  getFilterType(event: any, ctype: any,filterType: any) {
      if(event.checked && !this.filterObj[filterType].includes(ctype.id || ctype)) {
        let data = ctype.id ?ctype.id : ctype
        this.filterObj[filterType].push(data)
      } else {
        const index = this.filterObj[filterType].indexOf(ctype.id  || ctype);
        if (index > -1) { // only splice array when item is found
          this.filterObj[filterType].splice(index, 1); // 2nd parameter means remove one item only
        }
      }
      if(ctype.id === 'all' && filterType === 'status'){
        if(event.checked) {
          this.filterObj[filterType] = []
          this.filterObj[filterType] = ['all']
        } else {
          this.filterObj[filterType] = []
        }
      }
  }

  bindFilter() {
    if(this.filterObj['primaryCategory'].length) {
      this.primaryCategoryList.forEach((content: any) => {
        content.checked = this.filterObj['primaryCategory'].includes(content.id)
      })
    }
    if(this.filterObj['timeDuration'].length) {
      this.timeDuration.forEach((content: any) => {
        content.checked = this.filterObj['timeDuration'].includes(content.id)
      })
    }

    if(this.filterObj['status'].length) {
      this.contentStatus.forEach((content: any) => {
        content.checked = this.filterObj['status'].includes(content.id)
      })
    }
    
    if(this.filterObj['competencyArea'].length) {
      this.competencyTypeList.forEach((content: any) => {
        content.checked = this.filterObj['competencyArea'].includes(content.id)
        if(this.filterObj['competencyArea'].includes(content.id)) {
          this.getCompetencyTheme({checked: true}, content, false)
        }
      })
    }
  }
  bindCompetencyTheme() {
    if(this.filterObj['competencyTheme'].length) {
      this.competencyThemeList.forEach((content: any) => {
        content.checked = this.filterObj['competencyTheme'].includes(content.name)
        if(this.filterObj['competencyTheme'].includes(content.name)) {
          this.getCompetencySubTheme({checked: true}, content , false)
        }
      })
    }
  }

  bindCompetencySubTheme() {
    if(this.filterObj['competencySubTheme'].length) {
      this.competencySubThemeList.forEach((content: any) => {
        content.checked = this.filterObj['competencySubTheme'].includes(content.name)
      })
    }
  }

  bindProviders() {
    if(this.filterObj['providers'].length) {
      this.providersList.forEach((content: any) => {
        content.checked = this.filterObj['providers'].includes(content.name)
      })
    }
  }
  timeDurationFilter(ctype: any,filterType: any){
    this.filterObj[filterType] = [ctype.id]
  }
}
