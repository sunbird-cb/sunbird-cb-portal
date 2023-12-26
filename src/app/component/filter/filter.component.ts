import { Component, Input, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChildren } from '@angular/core'
import { MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, MatBottomSheetRef} from '@angular/material/bottom-sheet'
import { FormControl } from '@angular/forms';
import { AppCbpPlansService } from 'src/app/services/app-cbp-plans.service';
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
  @Output() getFilterData = new EventEmitter();
  @Input() clearFilterFlag:any;
  @Input() from:any;
  @Input() designationList:any;
  providersList: any[] = [];
  selectedProviders: any[] = [];
  competencyTypeList = [{ "id": "Behavioral", name: 'Behavioural' }, { "id": 'Functional', name: 'Functional' }, { "id": 'Domain', name: 'Domain' }];  
  competencyList: any = [];
  competencyThemeList: any[] = [];
  competencySubThemeList: any[] = [];
  filterObj: any = { "competencyArea": [], "competencyTheme": [], "competencySubTheme": [], "providers": [] };
  searchThemeControl = new FormControl();
  @ViewChildren("checkboxes") checkboxes!: QueryList<ElementRef>;
  constructor(
    private bottomSheetRef: MatBottomSheetRef<FilterComponent>, private appCbpPlansService : AppCbpPlansService) { }


  openLink(): void {
    if( this.bottomSheetRef)
      this.bottomSheetRef.dismiss(); 
  } 
  ngOnInit() {
      this.getFilterEntity();
      this.getProviders();
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
    console.log(filterObj)
    this.appCbpPlansService.getFilterEntity(filterObj).subscribe((res: any) => {
      console.log('entity,', res);
      this.competencyList = res;

    })
  }
  getProviders() {
    this.appCbpPlansService.getProviders().subscribe((res: any) => {
      console.log('providers,', res);
      this.providersList = res;
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

  getCompetencyTheme(event: any, ctype: any) {
    console.log('ctype', ctype, this.competencyList, event);
    if (event.checked) {
      this.competencyList.map((citem: any) => {
        if (citem.name === ctype.id) {
          console.log(citem.name, ctype.name, citem.children)
          citem.children.map((themechild: any) => {
            themechild['parent'] = ctype.id;
          })
          if(this.filterObj['competencyArea']) {
            this.filterObj['competencyArea'].push(citem.name);
          }          
          this.competencyThemeList = this.competencyThemeList.concat(citem.children);
          console.log('competencyThemeList', this.competencyThemeList)
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
    console.log('competencyThemeList', this.competencyThemeList)
  }

  getCompetencySubTheme(event: any, cstype: any) {
    console.log('cstype.parent', cstype.name)
    if (event.checked) {
      this.competencyThemeList.map((csitem: any) => {
        if (csitem.name === cstype.name) {
          csitem.children.map((subthemechild: any) => {
            subthemechild['parentType'] = csitem.parent;
            subthemechild['parent'] = csitem.name;
          })
          this.competencySubThemeList = this.competencySubThemeList.concat(csitem.children);
          this.filterObj['competencyTheme'].push(cstype.name);
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
    console.log('this.competencySubThemeList', this.competencySubThemeList);
  }



  manageCompetencySubTheme(event: any, csttype: any) {
    console.log('cstype, event --', event, csttype);
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
   
    console.log(this.filterObj);
  }

  clearFilter() {
    if(this.checkboxes) {
      this.checkboxes.forEach((element: any) => {
        element['checked'] = false;
      });
    }
    
  }

  clearFilterWhileSearch() {
    if(this.checkboxes) {
      this.checkboxes.forEach((element: any) => {
        element['checked'] = false;
      });
    }
  }
}
