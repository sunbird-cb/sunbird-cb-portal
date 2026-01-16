import { Component, OnDestroy, OnInit } from '@angular/core'
import { NSProfileDataV3 } from '../../models/profile-v3.models'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
// tslint:disable-next-line
import _ from 'lodash'
import { ActivatedRoute } from '@angular/router'
import { DialogBoxComponent } from '../../components/dialog-box/dialog-box.component'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { Subscription } from 'rxjs'
import { CompLocalService } from '../../services/comp.service'
import { UntypedFormControl } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-app-current-competencies',
  templateUrl: './current-competencies.component.html',
  styleUrls: ['./current-competencies.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 comptency_main_div' },
  /* tslint:enable */
})
export class CurrentCompetenciesComponent implements OnInit, OnDestroy {
  searchJson!: NSProfileDataV3.ISearch[]
  allCompetencies: any = []
  overallCompetencies!: NSProfileDataV3.ICompetencie[]
  changedProperties: any = {}
  placeHolder = 'Search here'
  // userDetails: any
  updatecompList: any = []
  competenciesList: any = []
  infoIcon = false
  currentComps: NSProfileDataV3.ICompetencie[] = []
  private currentCompSubscription: Subscription | null = null
  queryControl = new UntypedFormControl('')
  constructor(
    private configService: ConfigurationsService,
    private activateroute: ActivatedRoute,
    private dialog: MatDialog,
    private compLocalService: CompLocalService,
    private translate: TranslateService
  ) {
    if (this.currentCompSubscription) {
      this.currentCompSubscription.unsubscribe()
    }
    this.loadCompetencies()
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }

  ngOnInit() {
    this.currentCompSubscription = this.compLocalService.currentComps.subscribe(cc => {
      this.currentComps = cc
    })
    const competenciesList = _.get(this.configService.userProfileV2, 'competencies') || []
    this.compLocalService.addInitcurrentComps(competenciesList)
    this.compLocalService.autoSaveCurrent.next(false)

    // this.getUserDetails()
  }
  isSelected(competency: NSProfileDataV3.ICompetencie) {
    return _.findIndex(this.currentComps, { id: competency.id })
  }
  getSelectedLevel(competency: NSProfileDataV3.ICompetencie) {
    // return _.get(_.first(_.filter(this.currentComps, { id: competency.id })), 'competencySelfAttestedLevel')
    const orgcomp = this.currentComps.filter((x: any) => x.id === competency.id)
    if (orgcomp && orgcomp.length > 0) {
      return orgcomp[0]
    }
    return ''
  }

  getUserDetails() {
    // this.competenciesList = _.get(this.configService.userProfileV2, 'competencies') || []
    // if (this.overallCompetencies && this.overallCompetencies.length > 0) {
    //   this.getCompLsit()
    // } else {
    //   this.loadCompetencies()
    // }
  }
  clearSearchText() {
    this.queryControl.reset()
  }
  loadCompetencies() {
    if (
      this.activateroute.snapshot.parent
      && this.activateroute.snapshot.parent.data.competencies
      && this.activateroute.snapshot.parent.data.competencies.data
    ) {
      this.overallCompetencies = this.activateroute.snapshot.parent.data.competencies.data
    }
    // this.getCompLsit()
  }

  // getCompLsit() {
  //   if (this.overallCompetencies) {
  //     if (this.competenciesList && this.competenciesList.length > 0) {
  //       const complist = this.competenciesList
  //       complist.forEach((comp: any) => {
  //         this.overallCompetencies.forEach((ncomp: any) => {
  //           if (comp.id === ncomp.id) {
  //             // tslint:disable-next-line:max-line-length
  //             ncomp.competencySelfAttestedLevel =
  // !isNaN(Number(comp.competencySelfAttestedLevel)) ? Number(comp.competencySelfAttestedLevel) : comp.competencySelfAttestedLevel
  //             ncomp.competencySelfAttestedLevelValue = comp.competencySelfAttestedLevelValue
  //             ncomp.competencyType = comp.competencyType
  //             ncomp.osid = comp.osid
  //             if (!this.allCompetencies.some((el: any) => el.id === ncomp.id)) {
  //               if (ncomp.children && ncomp.children.length > 0) {
  //                 ncomp.children.forEach((lvl: any) => {
  //                   lvl.id = !isNaN(Number(lvl.id)) ? Number(lvl.id) : lvl.id
  //                 })
  //               }
  //               this.allCompetencies.unshift(ncomp)
  //             }
  //           } else {
  //             if (!this.allCompetencies.some((el: any) => el.id === ncomp.id)) {
  //               if (ncomp.children && ncomp.children.length > 0) {
  //                 ncomp.children.forEach((lvl: any) => {
  //                   lvl.id = !isNaN(Number(lvl.id)) ? Number(lvl.id) : lvl.id
  //                 })
  //               }
  //               this.allCompetencies.push(ncomp)
  //             }
  //           }
  //         })
  //       })
  //     } else {
  //       this.allCompetencies = this.overallCompetencies
  //     }
  //   }
  //   // this.allCompetencies = this.overallCompetencies
  // }

  // updateSelectedCompetency(event: any) {
  //   if (this.competenciesList && this.competenciesList.length > 0) {
  //     this.updatecompList = this.competenciesList
  //     this.updatecompList.forEach((com: any) => {
  //       event.forEach((evt: any) => {
  //         if (evt.id === com.id) {
  //           // tslint:disable-next-line:prefer-template
  //           const compValue = evt.competencySelfAttestedLevelName + ` (` + evt.competencySelfAttestedLevelValue + `)`
  //           // tslint:disable-next-line:max-line-length
  //           com.competencySelfAttestedLevel =
  // !isNaN(Number(evt.competencySelfAttestedLevel)) ? Number(evt.competencySelfAttestedLevel) : evt.competencySelfAttestedLevel
  //           com.competencySelfAttestedLevelValue = compValue
  //           com.competencyType = evt.competencyType
  //           com.osid = evt.osid
  //         } else {
  //           if (!this.updatecompList.some((el: any) => el.id === evt.id)) {
  //             // tslint:disable-next-line:prefer-template
  //             const compValue = evt.competencySelfAttestedLevelName + ` (` + evt.competencySelfAttestedLevelValue + `)`
  //             const obj = {
  //               competencySelfAttestedLevel: evt.competencySelfAttestedLevel,
  //               competencySelfAttestedLevelValue: compValue,
  //               competencyType: evt.competencyType,
  //               description: evt.description,
  //               osid: evt.osid,
  //               id: evt.id,
  //               name: evt.name,
  //               source: evt.source,
  //               status: evt.status,
  //               type: evt.type,
  //             }
  //             this.updatecompList.push(obj)
  //           }
  //         }
  //       })
  //     })
  //   } else {
  //     this.updatecompList = event
  //   }

  //   this.changedProperties = {
  //     profileDetails: {
  //       competencies: this.updatecompList,
  //     },
  //   }

  //   const reqUpdates = {
  //     request: {
  //       userId: this.configService.unMappedUser.id,
  //       ...this.changedProperties,
  //     },
  //   }
  //   this.competencySvc.updateProfileDetails(reqUpdates).subscribe((res: any) => {
  //     if (res.responseCode === 'OK') {
  //       this.configService.updateGlobalProfile(true)
  //       this.allCompetencies = []
  //       this.updatecompList = []
  //       this.competenciesList = []
  //       this.ngOnInit()
  //     }
  //   })
  // }
  openActivityDialog() {
    this.infoIcon = true
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      data: {
        view: 'ccomp',
      },
      hasBackdrop: false,
      width: '550px',

    })
    dialogRef.afterClosed().subscribe(_result => {
      this.infoIcon = false
    })
  }
  ngOnDestroy(): void {
    if (this.currentCompSubscription) {
      this.currentCompSubscription.unsubscribe()
    }
  }
}
