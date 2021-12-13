import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { NSCompetencie } from '../../models/competencies.model'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute } from '@angular/router'
import { CompetenceService } from '../../services/competence.service'
/* tslint:disable */
import _ from 'lodash';
import { FormControl } from '@angular/forms';
import { CompetenceViewComponent } from '../../components/competencies-view/competencies-view.component';
import { MatSnackBar } from '@angular/material';
import { ConfigurationsService, WsEvents, EventService } from '@sunbird-cb/utils/src/public-api'
import {ThemePalette} from '@angular/material/core'
/* tslint:enable */

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
  currentFilter = 'recommended'
  myCompetencies: NSCompetencie.ICompetencie[] = []
  tabsData: NSCompetencie.ICompetenciesTab[]
  allCompetencies!: NSCompetencie.ICompetencie[]
  watCompetencies: NSCompetencie.ICompetencie[] = []
  fracCompetencies!: NSCompetencie.ICompetencie[]
  filteredCompetencies!: NSCompetencie.ICompetencie[]
  searchJson!: NSCompetencie.ISearch[]
  searchKey = ''
  queryControl = new FormControl('')
  queryFracControl = new FormControl('')
  selectedId = ''
  currentProfile: any
  userPosition: any = null
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private competencySvc: CompetenceService,
    private snackBar: MatSnackBar,
    private configSvc: ConfigurationsService,
    private eventSvc: EventService,
  ) {
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
      } else {
        this.myCompetencies = []
      }
      this.currentProfile = this.route.snapshot.data.profile.data[0]
    } else {
      this.getProfile()
    }
  }
  ngOnInit() {
    // load page based on 'page' query param or default to 1
    // this.searchJson = [
    //   { type: 'COMPETENCY', field: 'name', keyword: '' },
    //   { type: 'COMPETENCY', field: 'status', keyword: 'VERIFIED' },
    // ]

    // const searchObj = {
    //   searches: this.searchJson,
    // }
    // this.competencySvc
    //   .fetchCompetency(searchObj)
    //   .subscribe((reponse: NSCompetencie.ICompetencieResponse) => {
    //     if (reponse.statusInfo && reponse.statusInfo.statusCode === 200) {
    //       this.allCompetencies = reponse.responseData
    //       this.resetcomp()
    //     }
    //   })
  }

  getProfile() {
    this.competencySvc.fetchProfileById(this.configSvc.unMappedUser.id).subscribe(response => {
      if (response) {
        // console.log("My Comp", response.profileDetails.competencies)
        this.myCompetencies = response.profileDetails.competencies || []
        this.currentProfile = response.profileDetails

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

  filter(key: string | 'recommended' | 'added_by_you' | 'recommended_from_wat') {
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
      const updatedProfile = { ...this.currentProfile }
      if (
        _.get(this, 'currentProfile.competencies') &&
        _.get(this, 'currentProfile.competencies').length > 0
      ) {
        _.remove(
          updatedProfile.competencies, itm => _.get(itm, 'id') === item.id
        )
        updatedProfile.competencies.push(newCompetence)
      } else {
        updatedProfile.competencies = []
        updatedProfile.competencies.push(newCompetence)
      }
      const reqUpdate = {
        request: {
          userId: this.configSvc.unMappedUser.id,
          profileDetails: updatedProfile,
        },
      }

      this.competencySvc.updateProfile(reqUpdate).subscribe(response => {
        if (response) {
          // success
          // this.myCompetencies.push(item)
          this.snackBar.open(this.successMsg.nativeElement.value, 'X')
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
      const currentCompetencies = _.get(this, 'currentProfile.competencies');
      const updatedProfile = { ...this.currentProfile };
      _.remove(currentCompetencies, (itm) => _.get(itm, 'id') === item.id);
      if (updatedProfile) {
        updatedProfile.competencies = currentCompetencies;
      }
      const reqUpdate = {
        request: {
          userId: this.configSvc.unMappedUser.id,
          profileDetails: updatedProfile,
        },
      }
      this.competencySvc.updateProfile(reqUpdate).subscribe(
        (response) => {
          if (response) {
            // success => removed
            this.snackBar.open(this.successRemoveMsg.nativeElement.value, 'X');
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
    instance.isUpdate = true;
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
    this.eventSvc.handleTabTelemetry(
      WsEvents.EnumInteractSubTypes.CAREER_TAB,
      data,
    )
  }
}
