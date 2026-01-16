import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { NSCompetencie } from '../../models/competencies.model'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { ActivatedRoute } from '@angular/router'
import { CompetenceService } from '../../services/competence.service'
/* tslint:disable */
import _ from 'lodash';
import { UntypedFormControl } from '@angular/forms';
import { CompetenceViewComponent } from '../../components/competencies-view/competencies-view.component';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { ConfigurationsService, MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import { TranslateService } from '@ngx-translate/core'
/* tslint:enable */

@Component({
  selector: 'app-competence-sys',
  templateUrl: './competence-sys.component.html',
  styleUrls: ['./competence-sys.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 margin-top-l' },
  /* tslint:enable */
})
export class CompetenceSysComponent implements OnInit {
  @ViewChild('stickyMenu', { static: true }) menuElement!: ElementRef
  @ViewChild('successMsg', { static: true }) successMsg!: ElementRef
  @ViewChild('failMsg', { static: true }) failureMsg!: ElementRef
  @ViewChild('successRemoveMsg', { static: true })
  successRemoveMsg!: ElementRef
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef

  sticky = false
  elementPosition: any
  currentFilter = 'recent'
  myCompetencies: NSCompetencie.ICompetencie[] = []
  // tabsData: NSCompetencie.ICompetenciesTab[]
  allCompetencies!: NSCompetencie.ICompetencie[]
  filteredCompetencies!: NSCompetencie.ICompetencie[]
  searchJson!: NSCompetencie.ISearch[]
  searchKey = ''
  queryControl = new UntypedFormControl('')
  selectedId = ''
  currentProfile: any
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private competencySvc: CompetenceService,
    private snackBar: MatSnackBar,
    private configSvc: ConfigurationsService,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService
  ) {
    // this.tabsData =
    //   (this.route.parent &&
    //     this.route.parent.snapshot.data.pageData.data.tabs) ||
    //   []

    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })

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
    // console.log('this.route =======', this.route.snapshot.queryParams)
  }
  ngOnInit() {
    // load page based on 'page' query param or default to 1
    this.searchJson = [
      { type: 'COMPETENCY', field: 'name', keyword: '' },
      { type: 'COMPETENCY', field: 'status', keyword: 'VERIFIED' },
    ]

    const searchObj = {
      searches: this.searchJson,
    }
    this.competencySvc
      .fetchCompetency(searchObj)
      .subscribe((reponse: NSCompetencie.ICompetencieResponse) => {
        if (reponse.statusInfo && reponse.statusInfo.statusCode === 200) {
          this.allCompetencies = reponse.responseData
          this.resetcomp()
        }
      })
  }

  getProfile() {
    this.competencySvc.fetchProfileById(this.configSvc.unMappedUser.id).subscribe(response => {
      if (response) {
        this.myCompetencies = response.profileDetails.competencies || []
        this.currentProfile = response.profileDetails
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
    // let data: any[] = [];
    const allCompetencies = [...this.allCompetencies];
    // if (this.myCompetencies && this.myCompetencies.length > 0) {
    //   data = _.flatten(
    //     _.map(this.myCompetencies, (item: NSCompetencie.ICompetencie) =>
    //       _.filter(
    //         allCompetencies,
    //         (i: NSCompetencie.ICompetencie) => i.id === item.id
    //       )
    //     )
    //   );

      // this.filteredCompetencies = this.allCompetencies.filter((obj) => {
      //   return data.indexOf(obj) === -1;
      // });
    //   this.filteredCompetencies = data
    // } else {
      this.filteredCompetencies = allCompetencies;
    // }
  }
  refreshData() {
    this.searchJson = [
      { type: 'COMPETENCY', field: 'name', keyword: this.searchKey },
      { type: 'COMPETENCY', field: 'status', keyword: 'VERIFIED' },
    ];
    const searchObj = {
      searches: this.searchJson,
    };
    this.competencySvc
      .fetchCompetency(searchObj)
      .subscribe((reponse: NSCompetencie.ICompetencieResponse) => {
        if (reponse.statusInfo && reponse.statusInfo.statusCode === 200) {
          // let data = reponse.responseData;
          // if (this.myCompetencies && this.myCompetencies.length > 0) {
          //   data = _.flatten(
          //     _.map(this.myCompetencies, (item) => {
          //       return _.filter(reponse.responseData, (i) => i.id === item.id);
          //     })
          //   );
          //   this.filteredCompetencies = reponse.responseData.filter((obj) => {
          //     return data.indexOf(obj) === -1;
          //   });
          // } else {
            this.filteredCompetencies = reponse.responseData;
          // }
        }
      });
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
}
