import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core'
import { CompetenceService } from '../../services/competence.service'
// tslint:disable
import _ from 'lodash'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { NSCompetencie } from '../../models/competencies.model'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material';
import { CompetenceViewComponent } from '../../components/competencies-view/competencies-view.component';
import { ConfigurationsService } from '@sunbird-cb/utils/src/public-api'

@Component({
  selector: 'ws-app-competency-detailed-view',
  templateUrl: './competency-detailed-view.component.html',
  styleUrls: ['./competency-detailed-view.component.scss']
})
export class CompetencyDetailedViewComponent implements OnInit, OnDestroy {
  @ViewChild('successMsg', { static: true }) successMsg!: ElementRef
  @ViewChild('failMsg', { static: true }) failureMsg!: ElementRef
  @ViewChild('successRemoveMsg', { static: true })
  successRemoveMsg!: ElementRef

  private paramSubscription: Subscription | null = null
  competencyName: any = null
  routeType: any = 'ALL'
  isAdded: boolean = false
  jsonConfigForCBP: any = null
  type: any = 'COMPETENCY'
  competencyId: any = null
  competencyData: any = null
  myCompetencies: any;
  currentProfile: any;
  courses: any[] = []
  facets: any
  searchReq = {
    request: {
        filters: {
            primaryCategory: [
                'Course',
                'Program',
            ],
            status: [
                'Live',
            ],
            'competencies_v3.name': [''],
        },
        query: '',
        sort_by: {
            lastUpdatedOn: '',
        },
        fields: [],
        facets: [
            'primaryCategory',
            'mimeType',
            'source',
            // 'competencies_v3.name',
            // 'competencies_v3.competencyType',
            // 'taxonomyPaths_v3.name',
        ],
    },
  }
  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private competencySvc: CompetenceService,
    private configSvc: ConfigurationsService,
  ) {
    this.getProfile()
  }

  ngOnInit() {
    this.paramSubscription = this.activatedRoute.params.subscribe(async params => {
      this.competencyId = _.get(params, 'competencyId')
      this.competencyName = _.get(params, 'competencyName')
      this.routeType = _.get(params, 'routeType')
      if(this.activatedRoute.snapshot && this.activatedRoute.snapshot.parent && this.activatedRoute.snapshot.parent.parent) {
        this.jsonConfigForCBP = this.activatedRoute.snapshot.parent.parent.data.pageData.data.relatedCBP
        this.searchReq.request.filters['competencies_v3.name'].splice(0, 1, this.competencyName)
        this.jsonConfigForCBP.widgetData.strips[0]['payload'] = this.searchReq
      }
    })


    this.competencySvc
      .fetchCompetencyDetails(this.competencyId, this.type)
      .subscribe((reponse: NSCompetencie.ICompetencieResponse) => {
        if (reponse.statusInfo && reponse.statusInfo.statusCode === 200) {
          this.competencyData = reponse.responseData
        } else {
          this.competencyData = []
        }
      })

    // this.getCbps()
  }

  getProfile() {
    this.competencySvc.fetchProfileById(this.configSvc.unMappedUser.id).subscribe(response => {
      if (response) {
        this.myCompetencies = response.profileDetails.competencies || []
        this.currentProfile = response.profileDetails
        const vc = _.chain(this.myCompetencies)
        .filter(i => {
          return i.id === this.competencyId
        })
        .first()
        .value()

        if(vc && ('id' in vc) && !_.isEmpty(vc.id)) {
          this.isAdded = true;
        }
      }
    })
  }

  ngOnDestroy() {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe()
    }
  }

  addCompetency(id: string, levelId: any, levelName: any) {
    if (id) {
      // API is not available
      const data = [this.competencyData]
      const vc = _.chain(data)
        .filter(i => {
          return i.id === id
        })
        .first()
        .value()

      // console.log(vc)
      // this.myCompetencies.push(vc)
      this.addToProfile(vc, levelId, levelName)
      // this.reset()
    }
  }

  deleteCompetency(id: string) {
    if (id) {
      /// API is not available
      const data = [this.competencyData]
      const vc = _.chain(data)
        .filter(i => {
          return i.id === id
        })
        .first()
        .value()

      // console.log(vc)
      if (vc) {
        this.removeFromProfile(vc)
      }
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
            this.isAdded = false;
            // success => removed
            this.snackBar.open('Removed competency sucessfully', 'X');
            this.configSvc.updateGlobalProfile(true)
          }
        },
        /* tslint:disable */() => {
          this.snackBar.open(this.failureMsg.nativeElement.value, 'X');
        } /* tslint:disable */
      );
    }
  }

  addToProfile(item: NSCompetencie.ICompetencie, levelId: any, levelName: any) {
    if (item) {
      const newCompetence = {
        type: item.type || 'COMPETENCY',
        id: item.id,
        name: item.name || '',
        description: item.description || '',
        status: item.status || '',
        source: item.source || '',
        competencyType: _.get(item, 'additionalProperties.competencyType') || item.type,
        competencySelfAttestedLevel: levelId || '',
        competencySelfAttestedLevelValue: levelName || '',
      }

      // console.log(newCompetence)
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
          this.isAdded = true;
          this.snackBar.open('Compentency added successfully', 'X')
          this.configSvc.updateGlobalProfile(true)
        }
      },
        /* tslint:disable */() => {
          this.snackBar.open('Failed to add compentency', 'X');
        } /* tslint:disable */
      );
    }
  }

  view(item?: NSCompetencie.ICompetencie) {
    const dialogRef = this.dialog.open(CompetenceViewComponent, {
      minHeight: 'auto',
      // width: '80%',
      // width:'100%',
      maxWidth: '95vw',
      panelClass: 'remove-pad',
      data: item,
    });
    const instance = dialogRef.componentInstance;
    instance.isUpdate = (this.isAdded) ? true : false;
    dialogRef.afterClosed().subscribe((response: any) => {
      // console.log(response)
      if (response && response.action === 'ADD') {
        this.addCompetency(response.id, response.levelId, response.levelName);
        // this.refreshData(this.currentActivePage)
      } else if (response && response.action === 'DELETE') {
        this.deleteCompetency(response.id);
      }
    });
  }


  getCbps() {
      this.searchReq.request.filters['competencies_v3.name'].splice(0, 1, this.competencyName)
      this.competencySvc.fetchSearchData(this.searchReq).subscribe((res: any) => {
        if (res && res.result &&  res.result && res.result.content) {
          this.courses = res.result.content
        }
        if (res && res.result &&  res.result && res.result.facets) {
          this.facets = res.result.facets
        }
      })
  }

}
