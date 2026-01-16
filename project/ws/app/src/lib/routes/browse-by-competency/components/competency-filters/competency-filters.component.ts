import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core'
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms'
import { Subscription } from 'rxjs'
import { BrowseCompetencyService } from '../../services/browse-competency.service'
import { NSBrowseCompetency } from '../../models/competencies.model'
// tslint:disable
import _ from 'lodash'
// tslint:enable
import { LocalDataService } from '../../services/localService'
import { MultilingualTranslationsService } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'ws-app-competency-filters',
  templateUrl: './competency-filters.component.html',
  styleUrls: ['./competency-filters.component.scss'],
})
export class CompetencyFiltersComponent implements OnInit, OnDestroy {
  @Output() appliedFilter = new EventEmitter<any>()
  filterForm: UntypedFormGroup | undefined
  private subscription: Subscription = new Subscription
  userFilters: any = []
  myFilterArray: any = []
  filters = [
    {
      name: 'competencyType',
      values: [
        {
          name: 'Behavioural',
        },
        {
          name: 'Domain',
        },
        {
          name: 'Functional',
        },
      ],
    },
    {
      name: 'competencyArea',
      values: [],
    },
  ]
  constructor(
    private browseCompServ: BrowseCompetencyService,
    private langtranslations: MultilingualTranslationsService,
    private localDataService: LocalDataService,
  ) { }

  ngOnInit() {
    this.filterForm = new UntypedFormGroup({
      filterControl: new UntypedFormControl(''),
      // competencyAreas: new FormControl(''),
      searchCompArea: new UntypedFormControl(''),
    })
    this.getAllCompetencyAreas()

    this.subscription = this.browseCompServ.notifyObservable$.subscribe((res: any) => {
      const fil = {
        name: res.name,
        count: res.count,
        ischecked: false,
      }
      if (this.userFilters.length === 0) {
        this.userFilters.push(fil)
      }
      this.updateUserFilters(fil, res.mainType)
    })
  }

  getFilterName(fil: any) {
    return this.userFilters.filter((x: any) => x.name === fil.name)
  }

  updateUserFilters(fil: any, mainparentType: any) {
    const indx = this.getFilterName(fil)
    if (indx.length > 0) {
      this.userFilters.forEach((fs: any, index: number) => {
        if (fs.name === fil.name) {
          this.userFilters.splice(index, 1)
        }
      })
      this.myFilterArray.forEach((fs: any, index: number) => {
        if (fs.name === fil.name) {
          this.myFilterArray.splice(index, 1)
        }
      })
      this.filters.forEach((fas: any) => {
        if (fas.name === mainparentType) {
          fas.values.forEach((fasv: any) => {
            if (fasv.name === fil.name) {
              fasv.ischecked = false
            }
          })
        }
      })
      this.appliedFilter.emit(this.myFilterArray)
    } else {
      this.userFilters.push(fil)

      const reqfilter = {
        mainType: mainparentType,
        name: fil.name,
        count: fil.count,
        ischecked: true,
      }
      this.filters.forEach((fas: any) => {
        if (fas.name === mainparentType) {
          fas.values.forEach((fasv: any) => {
            if (fasv.name === fil.name) {
              fasv.ischecked = true
            }
          })
        }
      })
      this.myFilterArray.push(reqfilter)
      this.appliedFilter.emit(this.myFilterArray)
    }
  }

  getAllCompetencyAreas() {
    // this.browseCompServ
    //   .fetchCompetencyAreas()
    //   .subscribe((reponse: NSBrowseCompetency.ICompetencieResponse) => {
    //     if (reponse.statusInfo && reponse.statusInfo.statusCode === 200) {
    //       // this.filters.name.values = reponse.responseData
    //       const foundIndex = this.filters.findIndex(x => x.name === 'competencyArea')
    //       console.log('foundIndex: ', foundIndex)
    //       this.filters[foundIndex].values = reponse.responseData
    //       console.log('this.filters: ', this.filters)
    //     }
    //   })
    this.localDataService.compentecies.subscribe((data: NSBrowseCompetency.ICompetencie[]) => {
      // this.filters[0].values=[] // not needed
      _.each(data, (d: NSBrowseCompetency.ICompetencie) => {
        if (d.competencyArea) {
          this.filters[1].values.push({ name: d.competencyArea })
        }
      })
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }
}
