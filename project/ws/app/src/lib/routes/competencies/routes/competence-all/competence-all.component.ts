import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { NSCompetencie } from '../../models/competencies.model'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { ActivatedRoute } from '@angular/router'
import { CompetenceService } from '../../services/competence.service'
/* tslint:disable */
import * as _ from 'lodash'
import { UntypedFormControl } from '@angular/forms';
import { CompetenceViewComponent } from '../../components/competencies-view/competencies-view.component'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { ConfigurationsService, WsEvents, EventService, MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import { ThemePalette } from '@angular/material/core'
import { TranslateService } from '@ngx-translate/core'
@Component({
  selector: 'app-competence-all',
  templateUrl: './competence-all.component.html',
  styleUrls: ['./competence-all.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 margin-top-xl competency_main_block' },
  /* tslint:enable */
})
export class CompetenceAllComponent implements OnInit {
  @ViewChild('stickyMenu', { static: true }) menuElement!: ElementRef
  @ViewChild('successMsg', { static: true }) successMsg!: ElementRef
  @ViewChild('failMsg', { static: true }) failureMsg!: ElementRef
  @ViewChild('successRemoveMsg', { static: true })
  successRemoveMsg!: ElementRef
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef

  color: ThemePalette = 'primary'
  value = 20

  sticky = false
  elementPosition: any
  currentFilter = 'acquired_by_you'
  myCompetencies: NSCompetencie.ICompetencie[] = []
  desiredCompetencies: NSCompetencie.ICompetencie[] = []
  tabsData: NSCompetencie.ICompetenciesTab[]
  allCompetencies!: NSCompetencie.ICompetencie[]
  watCompetencies: NSCompetencie.ICompetencie[] = []
  fracCompetencies!: NSCompetencie.ICompetencie[]
  filteredCompetencies!: NSCompetencie.ICompetencie[]
  searchJson!: NSCompetencie.ISearch[]
  searchKey = ''
  queryControl = new UntypedFormControl('')
  queryFracControl = new UntypedFormControl('')
  selectedId = ''
  currentProfile: any
  userPosition: any = null
  pageLayout: any
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private competencySvc: CompetenceService,
    private snackBar: MatSnackBar,
    private configSvc: ConfigurationsService,
    private eventSvc: EventService,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService
  ) {
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
    this.searchJson = [
      { type: 'COMPETENCY', field: 'name', keyword: '' },
      { type: 'COMPETENCY', field: 'status', keyword: 'VERIFIED' },
    ]

    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }

    const searchObj = {
      searches: this.searchJson,
      childNodes: true,
    }
    this.competencySvc
      .fetchCompetency(searchObj)
      .subscribe((reponse: NSCompetencie.ICompetencieResponse) => {
        if (reponse.statusInfo && reponse.statusInfo.statusCode === 200) {
          this.allCompetencies = reponse.responseData
          // this.resetcomp()
        }
      })

    this.pageLayout = (this.route.parent &&
      this.route.parent.snapshot.data.pageData.data.pageLayout) || []
    this.tabsData =
      (this.route.parent &&
        this.route.parent.snapshot.data.pageData.data.tabs) ||
      []
    if (
      this.route.snapshot.data &&
      this.route.snapshot.data.profile &&
      this.route.snapshot.data.profile.data &&
      this.route.snapshot.data.profile.data[0]
    ) {
      if (
        this.route.snapshot.data.profile.data[0].competencies &&
        this.route.snapshot.data.profile.data[0].competencies.length > 0
      ) {
        this.myCompetencies =
          this.route.snapshot.data.profile.data[0].competencies || []

          if (this.myCompetencies && this.myCompetencies.length > 0) {
            if (this.allCompetencies && this.allCompetencies.length > 0) {
              this.myCompetencies.forEach((comp: any) => {
                if (comp.competencyCBPCompletionLevel) {
                  if (!isNaN(Number(comp.competencyCBPCompletionLevel))) {
                    comp.competencyCBPCompletionLevel = Number(comp.competencyCBPCompletionLevel)
                  } else {
                    comp.competencyCBPCompletionLevel = comp.competencyCBPCompletionLevel
                  }
                }
                if (comp.competencySelfAttestedLevel) {
                  if (!isNaN(Number(comp.competencySelfAttestedLevel))) {
                    comp.competencySelfAttestedLevel = Number(comp.competencySelfAttestedLevel)
                  } else {
                    comp.competencySelfAttestedLevel = comp.competencySelfAttestedLevel
                  }
                }
                // const orgcomp = this.allCompetencies.filter((obj: any) => this.myCompetencies.includes(obj.id))
                const orgcomp = this.allCompetencies.filter(x => x.id === comp.id)
                if (orgcomp && orgcomp.length > 0) {
                  comp.children =  orgcomp[0].children
                }
              })
            }
          }
      } else {
        this.myCompetencies = []
      }
      if (
        this.route.snapshot.data.profile.data[0].desiredCompetencies &&
        this.route.snapshot.data.profile.data[0].desiredCompetencies.length > 0
      ) {
        this.desiredCompetencies =
          this.route.snapshot.data.profile.data[0].desiredCompetencies || []
      } else {
        this.desiredCompetencies = []
      }

      this.currentProfile = this.route.snapshot.data.profile.data[0]
    } else {
      this.getProfile()
    }
  }
  ngOnInit() { }

  translateHub(hubName: string): string {
    const translationKey =  hubName
    return this.translate.instant(translationKey)
  }

  getProfile() {
    this.competencySvc.fetchProfileById(this.configSvc.unMappedUser.id).subscribe(response => {
      if (response) {
        // console.log("My Comp", response.profileDetails.competencies)
        this.myCompetencies = response.profileDetails.competencies || []
        this.desiredCompetencies = response.profileDetails.desiredCompetencies || []
        this.currentProfile = response.profileDetails

        if (this.myCompetencies && this.myCompetencies.length > 0) {
          if (this.allCompetencies && this.allCompetencies.length > 0) {
            this.myCompetencies.forEach((comp: any) => {
              if (comp.competencyCBPCompletionLevel) {
                if (!isNaN(Number(comp.competencyCBPCompletionLevel))) {
                  comp.competencyCBPCompletionLevel = Number(comp.competencyCBPCompletionLevel)
                } else {
                  comp.competencyCBPCompletionLevel = comp.competencyCBPCompletionLevel
                }
              }
              if (comp.competencySelfAttestedLevel) {
                if (!isNaN(Number(comp.competencySelfAttestedLevel))) {
                  comp.competencySelfAttestedLevel = Number(comp.competencySelfAttestedLevel)
                } else {
                  comp.competencySelfAttestedLevel = comp.competencySelfAttestedLevel
                }
              }
              // const orgcomp = this.allCompetencies.filter((obj: any) => this.myCompetencies.includes(obj.id))
              const orgcomp = this.allCompetencies.filter(x => x.id === comp.id)
              if (orgcomp && orgcomp.length > 0) {
                comp.children =  orgcomp[0].children && orgcomp[0].children.length > 0 ? orgcomp[0].children : []
              }
            })
          }
        }

        const profDetails = response.profileDetails.professionalDetails
        // tslint:disable-next-line: ter-prefer-arrow-callback
        const designation = _.find(profDetails, function (o) { return o.designation })
        let designationOther = ''
        if (_.isEmpty(designation) || _.isNil(designation)) {
          // tslint:disable-next-line: ter-prefer-arrow-callback
          designationOther = _.find(profDetails, function (o) { return o.designationOther })
          // tslint:disable-next-line: max-line-length
          this.userPosition = (_.isEmpty(designationOther) || _.isNil(designationOther)) ? null :  _.get(designationOther, 'designationOther')
        } else {
          this.userPosition = (_.isEmpty(designation) || _.isNil(designation)) ? null :  _.get(designation, 'designation')
        }
        this.fetchMapping()
        this.fetchWatCompetency()
      }
    })
  }

  fetchMapping() {
    if (this.userPosition !== null) {
      const positionData = {
        type: 'COMPETENCY',
        mappings: [
          {
            type: 'POSITION',
            name: this.userPosition,
            relation: 'parent',
          },
        ],
      }

      this.competencySvc
      .fetchMappings(positionData)
      .subscribe((response: NSCompetencie.ICompetencieResponse) => {
        if (response.statusInfo && response.statusInfo.statusCode === 200) {
          if (_.isEmpty(response.responseData)) {
            this.userPosition = null
          }
          this.filteredCompetencies = response.responseData
          // this.resetcomp()
        }
      })
    }
  }

  filter(key: string | 'recommended' | 'acquired_by_you' | 'recommended_from_wat' | 'desired_competencies') {
    if (key) {
      this.currentFilter = key
      // this.refreshData()
    }
  }

  fetchWatCompetency() {
    const userId = this.configSvc.unMappedUser.id
    if (_.isEmpty(userId) || _.isNull(userId)) {
      this.watCompetencies = []
    }

    this.competencySvc
      .fetchWatCompetency(userId)
      .subscribe((response: NSCompetencie.IWatCompetencieResponse) => {
        if (response.result && response.result.status === 'OK') {
          this.watCompetencies = response.result.data
        }
    })
  }

  updateQuery(key: string) {
    this.searchKey = key
    this.refreshData()
  }

  reset() {
    this.searchKey = ''
    this.queryControl.setValue('')
    this.queryFracControl.setValue('')
    this.selectedId = ''
    this.refreshData()
  }
  resetSearch() {
    this.reset()
    // this.refreshData()
  }
  addCompetency(id: string) {
    if (id) {
      // API is not available
      const vc = _.chain(this.allCompetencies)
        .filter(i => {
          return i.id === id
        })
        .first()
        .value()
      this.myCompetencies.push(vc)
      // console.log(vc)
      this.addToProfile(vc)
      this.reset()
    }
  }
  deleteCompetency(id: string) {
    if (id) {
      // API is not available
      // const vc = _.chain(this.allCompetencies).filter(i => {
      //   return i.id === id
      // }).first().value()
      const vc = _.remove(
        this.myCompetencies, itm => _.get(itm, 'id') === id
      )
      // this.myCompetencies.push(vc)
      if (vc && vc[0]) {
        this.removeFromProfile(vc[0])
        this.reset()
      }
    }
  }
  addToProfile(item: NSCompetencie.ICompetencie) {
    if (item) {
      const newCompetence = {
        type: item.type || 'COMPETENCY',
        id: item.id,
        name: item.name || '',
        description: item.description || '',
        status: item.status || '',
        source: item.source || '',
        competencyType: _.get(item, 'additionalProperties.competencyType') || item.type,
      }
      // const updatedProfile = { ...this.currentProfile }
      let updatedProfile = this.currentProfile.competencies
      if (
        _.get(this, 'currentProfile.competencies') &&
        _.get(this, 'currentProfile.competencies').length > 0
      ) {
        _.remove(
          updatedProfile, itm => _.get(itm, 'id') === item.id
        )
        updatedProfile.push(newCompetence)
      } else {
        updatedProfile = []
        updatedProfile.push(newCompetence)
      }
      const reqUpdate = {
        request: {
          userId: this.configSvc.unMappedUser.id,
          profileDetails: {
            competencies: updatedProfile,
          },
        },
      }
      this.competencySvc.updateProfile(reqUpdate).subscribe(response => {
        if (response) {
          // success
          // this.myCompetencies.push(item)
          this.snackBar.open(this.successMsg.nativeElement.value, 'X')
          this.configSvc.updateGlobalProfile(true)
        }
      },
        /* tslint:disable */() => {
          this.snackBar.open(this.failureMsg.nativeElement.value, 'X');
        } /* tslint:disable */
      );
    }
  }
  removeFromProfile(item: NSCompetencie.ICompetencie) {
    if (item) {
      // console.log('item ---', item)
      const currentCompetencies = _.get(this, 'currentProfile.competencies');
      // const updatedProfile = { ...this.currentProfile };
      let updatedProfile = this.currentProfile.competencies
      _.remove(currentCompetencies, (itm) => _.get(itm, 'id') === item.id);
      if (item && item.competencyCBPCompletionLevel) {
        const newCompetence = {
          type: item.type,
          id: item.id,
          name: item.name,
          description: item.description,
          status: item.status,
          source: item.source,
          competencyType: item.type,
          competencyCBPCompletionLevel: item.competencyCBPCompletionLevel ? item.competencyCBPCompletionLevel : '',
          competencyCBPCompletionLevelName: item.competencyCBPCompletionLevelName ? item.competencyCBPCompletionLevelName : '',
          competencyCBPCompletionLevelValue: item.competencyCBPCompletionLevelValue ? item.competencyCBPCompletionLevelValue : '',
        }
        updatedProfile.push(newCompetence)
      }
      if (updatedProfile) {
        updatedProfile = currentCompetencies;
      }
      const reqUpdate = {
        request: {
          userId: this.configSvc.unMappedUser.id,
          profileDetails: {
            competencies: updatedProfile,
          },
        },
      }
      // const reqUpdate = {
      //   request: {
      //     userId: this.configSvc.unMappedUser.id,
      //     profileDetails: updatedProfile,
      //   },
      // }
      this.competencySvc.updateProfile(reqUpdate).subscribe(
        (response) => {
          if (response) {
            // success => removed
            this.snackBar.open(this.successRemoveMsg.nativeElement.value, 'X');
            this.configSvc.updateGlobalProfile(true)
          }
        },
        /* tslint:disable */() => {
          this.snackBar.open(this.failureMsg.nativeElement.value, 'X');
        } /* tslint:disable */
      );
    }
  }
  resetcomp() {
    let data: any[] = [];
    const allCompetencies = [...this.allCompetencies];
    if (this.myCompetencies && this.myCompetencies.length > 0) {
      data = _.flatten(
        _.map(this.myCompetencies, (item: NSCompetencie.ICompetencie) =>
          _.filter(
            allCompetencies,
            (i: NSCompetencie.ICompetencie) => i.id === item.id
          )
        )
      );

      this.filteredCompetencies = this.allCompetencies.filter((obj) => {
        return data.indexOf(obj) === -1;
      });
      // this.filteredCompetencies = data
    } else {
      this.filteredCompetencies = allCompetencies;
    }
  }
  refreshData() {
    this.fetchMapping()
    // this.searchJson = [
    //   { type: 'COMPETENCY', field: 'name', keyword: this.searchKey },
    //   { type: 'COMPETENCY', field: 'status', keyword: 'VERIFIED' },
    // ];
    // const searchObj = {
    //   searches: this.searchJson,
    // };
    // this.competencySvc
    //   .fetchCompetency(searchObj)
    //   .subscribe((reponse: NSCompetencie.ICompetencieResponse) => {
    //     if (reponse.statusInfo && reponse.statusInfo.statusCode === 200) {
    //       let data = reponse.responseData;
    //       if (this.myCompetencies && this.myCompetencies.length > 0) {
    //         data = _.flatten(
    //           _.map(this.myCompetencies, (item) => {
    //             return _.filter(reponse.responseData, (i) => i.id === item.id);
    //           })
    //         );
    //         this.filteredCompetencies = reponse.responseData.filter((obj) => {
    //           return data.indexOf(obj) === -1;
    //         });
    //       } else {
    //         this.filteredCompetencies = reponse.responseData;
    //       }
    //     }
    //   });
  }
  setSelectedCompetency(id: string) {
    this.selectedId = id;
  }

  view(item?: NSCompetencie.ICompetencie) {
    const dialogRef = this.dialog.open(CompetenceViewComponent, {
      minHeight: 'auto',
      // width: '80%',
      panelClass: 'remove-pad',
      data: item,
    });
    const instance = dialogRef.componentInstance;
    // console.log('item', item)
    if(item && item.competencySelfAttestedLevel !== ''){
      instance.isUpdate = true
    } else {
      instance.isUpdate = false
    }

    dialogRef.afterClosed().subscribe((response: any) => {
      if (response && response.action === 'ADD') {
        this.addCompetency(response.id);
        // this.refreshData(this.currentActivePage)
      } else if (response && response.action === 'DELETE') {
        this.deleteCompetency(response.id);
      }
    });
  }

  public tabTelemetry(label: string, index: number) {
    const data: WsEvents.ITelemetryTabData = {
      label,
      index,
    }
    this.eventSvc.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        subType: WsEvents.EnumInteractSubTypes.COMPETENCY_TAB,
        id: `${_.camelCase(data.label)}-tab`
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.COMPETENCY
      }
    )
  }
}
