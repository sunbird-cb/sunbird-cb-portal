import { Component, OnDestroy, OnInit } from '@angular/core'
import { NSProfileDataV3 } from '../../models/profile-v3.models'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
// tslint:disable-next-line
import _ from 'lodash'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { DialogBoxComponent } from '../../components/dialog-box/dialog-box.component'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { CompLocalService } from '../../services/comp.service'
import { UntypedFormControl } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-app-desired-competencies',
  templateUrl: './desired-competencies.component.html',
  styleUrls: ['./desired-competencies.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 comptency_main_div' },
  /* tslint:enable */
})
export class DesiredCompetenciesComponent implements OnInit, OnDestroy {
  searchJson!: NSProfileDataV3.ISearch[]
  alldesiredCompetencies: any = []
  changedProperties: any = {}
  // userDetails: any
  updatecompList: any = []
  infoIcon = false
  overallCompetencies!: NSProfileDataV3.ICompetencie[]
  desiredcompList: any = []
  placeHolder = 'Search here'
  queryControl = new UntypedFormControl('')
  desiredComps: NSProfileDataV3.ICompetencie[] = []
  private desiredCompSubscription: Subscription | null = null

  constructor(
    private configService: ConfigurationsService,
    private activateroute: ActivatedRoute,
    private dialog: MatDialog,
    private compLocalService: CompLocalService,
    private translate: TranslateService
  ) {
    if (this.desiredCompSubscription) {
      this.desiredCompSubscription.unsubscribe()
    }
    this.loadCompetencies()
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }

  ngOnInit() {
    this.desiredCompSubscription = this.compLocalService.desiredComps.subscribe(dc => {
      this.desiredComps = dc
    })
    const competenciesList = _.get(this.configService.userProfileV2, 'desiredCompetencies') || []
    const currentComps = _.get(this.configService.userProfileV2, 'competencies') || []
    const result = _.reject(this.overallCompetencies, item => _.find(currentComps, { id: item.id }))
    this.overallCompetencies = result as NSProfileDataV3.ICompetencie[]
    this.compLocalService.addInitDesiredComps(competenciesList)
    this.compLocalService.autoSaveDesired.next(false)
  }

  getUserDetails() {
    // this.desiredcompList = _.get(this.configService.userProfileV2, 'desiredCompetencies') || []
    // if (this.overallCompetencies && this.overallCompetencies.length > 0) {
    //   this.getCompLsit()
    // } else {
    //   this.getCompetencies()
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
    // this.searchJson = [
    //   { type: 'COMPETENCY', field: 'name', keyword: '' },
    //   { type: 'COMPETENCY', field: 'status', keyword: 'VERIFIED' },
    // ]

    // const searchObj = {
    //   searches: this.searchJson,
    //   childNodes: true,
    // }
    // this.competencySvc
    //   .getAllCompetencies(searchObj)
    //   .subscribe((reponse: any) => {
    //     if (reponse.statusInfo && reponse.statusInfo.statusCode === 200) {
    //       this.overallCompetencies = reponse.responseData
    //       this.getCompLsit()
    //   }
    // })
  }
  isSelected(competency: NSProfileDataV3.ICompetencie) {
    return _.findIndex(this.desiredComps, { id: competency.id }) !== -1
  }
  getSelectedLevel(competency: NSProfileDataV3.ICompetencie) {
    return _.get(_.first(_.filter(this.desiredComps, { id: competency.id })), 'competencySelfAttestedLevel')
  }
  // getCompLsit() {
  //   if (this.overallCompetencies) {
  //     if (this.desiredcompList && this.desiredcompList.length > 0) {
  //       const complist = this.desiredcompList
  //       complist.forEach((comp: any) => {
  //         this.overallCompetencies.forEach((ncomp: any) => {
  //           if (comp.id === ncomp.id) {
  //             // tslint:disable-next-line:max-line-length
  //             ncomp.competencySelfAttestedLevel =
  // !isNaN(Number(comp.competencySelfAttestedLevel)) ? Number(comp.competencySelfAttestedLevel) : comp.competencySelfAttestedLevel
  //             ncomp.competencySelfAttestedLevelValue = comp.competencySelfAttestedLevelValue
  //             ncomp.competencyType = comp.competencyType
  //             ncomp.osid = comp.osid
  //             if (!this.alldesiredCompetencies.some((el: any) => el.id === ncomp.id)) {
  //               if (ncomp.children && ncomp.children.length > 0) {
  //                 ncomp.children.forEach((lvl: any) => {
  //                   lvl.id = !isNaN(Number(lvl.id)) ? Number(lvl.id) : lvl.id
  //                 })
  //               }
  //               this.alldesiredCompetencies.unshift(ncomp)
  //             }
  //           } else {
  //             if (!this.alldesiredCompetencies.some((el: any) => el.id === ncomp.id)) {
  //               if (ncomp.children && ncomp.children.length > 0) {
  //                 ncomp.children.forEach((lvl: any) => {
  //                   lvl.id = !isNaN(Number(lvl.id)) ? Number(lvl.id) : lvl.id
  //                 })
  //               }
  //               this.alldesiredCompetencies.push(ncomp)
  //             }
  //           }
  //         })
  //       })
  //     } else {
  //       this.alldesiredCompetencies = this.overallCompetencies
  //     }
  //   }
  // }

  // updateSelectedCompetency(event: any) {
  //   if (this.desiredcompList && this.desiredcompList.length > 0) {
  //     this.updatecompList = this.desiredcompList
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
  //       desiredCompetencies: this.updatecompList,
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
  //       this.alldesiredCompetencies = []
  //       this.updatecompList = []
  //       this.desiredcompList = []
  //       this.ngOnInit()
  //     }
  //   })
  // }
  openActivityDialog() {
    this.infoIcon = true
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      data: {
        view: 'dscomp',
      },
      hasBackdrop: false,
      width: '550px',

    })
    dialogRef.afterClosed().subscribe(_result => {
      this.infoIcon = false
    })
  }
  ngOnDestroy(): void {
    if (this.desiredCompSubscription) {
      this.desiredCompSubscription.unsubscribe()
    }
  }
}
