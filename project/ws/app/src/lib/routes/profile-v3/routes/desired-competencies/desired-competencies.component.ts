import { Component, OnInit } from '@angular/core'
import { ProfileV3Service } from '../../services/profile_v3.service'
import { NSProfileDataV3 } from '../../models/profile-v3.models'
import { ConfigurationsService } from '@sunbird-cb/utils/src/public-api'
// tslint:disable-next-line
import _ from 'lodash'
import { MatDialog } from '@angular/material'
import { DialogBoxComponent } from '../../components/dialog-box/dialog-box.component'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'ws-app-desired-competencies',
  templateUrl: './desired-competencies.component.html',
  styleUrls: ['./desired-competencies.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 comptency_main_div' },
  /* tslint:enable */
})
export class DesiredCompetenciesComponent implements OnInit {
  searchJson!: NSProfileDataV3.ISearch[]
  alldesiredCompetencies: any = []
  changedProperties: any = {}
  // userDetails: any
  updatecompList: any = []
  overallCompetencies!: NSProfileDataV3.ICompetencie[]
  desiredcompList: any = []

  constructor(
    private competencySvc: ProfileV3Service,
    private configService: ConfigurationsService,
    private activateroute: ActivatedRoute,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.alldesiredCompetencies = []
    this.getUserDetails()
  }

  getUserDetails() {
    this.desiredcompList = _.get(this.configService.userProfileV2, 'desiredCompetencies') || []
    if (this.overallCompetencies && this.overallCompetencies.length > 0) {
      this.getCompLsit()
    } else {
      this.getCompetencies()
    }
  }

  getCompetencies() {
    if (
      this.activateroute.snapshot.parent
      && this.activateroute.snapshot.parent.data.desiredcompetencies
      && this.activateroute.snapshot.parent.data.desiredcompetencies.data
    ) {
      this.overallCompetencies = this.activateroute.snapshot.parent.data.desiredcompetencies.data
    }
    this.getCompLsit()
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

  getCompLsit() {
    if (this.overallCompetencies) {
      if (this.desiredcompList && this.desiredcompList.length > 0) {
        const complist = this.desiredcompList
        complist.forEach((comp: any) => {
          this.overallCompetencies.forEach((ncomp: any) => {
            if (comp.id === ncomp.id) {
              // tslint:disable-next-line:max-line-length
              ncomp.competencySelfAttestedLevel = !isNaN(Number(comp.competencySelfAttestedLevel)) ? Number(comp.competencySelfAttestedLevel) : comp.competencySelfAttestedLevel
              ncomp.competencySelfAttestedLevelValue = comp.competencySelfAttestedLevelValue
              ncomp.competencyType = comp.competencyType
              ncomp.osid = comp.osid
              if (!this.alldesiredCompetencies.some((el: any) => el.id === ncomp.id)) {
                if (ncomp.children && ncomp.children.length > 0) {
                  ncomp.children.forEach((lvl: any) => {
                    lvl.id = !isNaN(Number(lvl.id)) ? Number(lvl.id) : lvl.id
                  })
                }
                this.alldesiredCompetencies.unshift(ncomp)
              }
            } else {
              if (!this.alldesiredCompetencies.some((el: any) => el.id === ncomp.id)) {
                if (ncomp.children && ncomp.children.length > 0) {
                  ncomp.children.forEach((lvl: any) => {
                    lvl.id = !isNaN(Number(lvl.id)) ? Number(lvl.id) : lvl.id
                  })
                }
                this.alldesiredCompetencies.push(ncomp)
              }
            }
          })
        })
      } else {
        this.alldesiredCompetencies = this.overallCompetencies
      }
    }
  }

  updateSelectedCompetency(event: any) {
    if (this.desiredcompList && this.desiredcompList.length > 0) {
      this.updatecompList = this.desiredcompList
      this.updatecompList.forEach((com: any) => {
        event.forEach((evt: any) => {
          if (evt.id === com.id) {
            // tslint:disable-next-line:prefer-template
            const compValue = evt.competencySelfAttestedLevelName + ` (` + evt.competencySelfAttestedLevelValue + `)`
            // tslint:disable-next-line:max-line-length
            com.competencySelfAttestedLevel = !isNaN(Number(evt.competencySelfAttestedLevel)) ? Number(evt.competencySelfAttestedLevel) : evt.competencySelfAttestedLevel
            com.competencySelfAttestedLevelValue = compValue
            com.competencyType = evt.competencyType
            com.osid = evt.osid
          } else {
            if (!this.updatecompList.some((el: any) => el.id === evt.id)) {
              // tslint:disable-next-line:prefer-template
              const compValue = evt.competencySelfAttestedLevelName + ` (` + evt.competencySelfAttestedLevelValue + `)`
              const obj = {
                competencySelfAttestedLevel: evt.competencySelfAttestedLevel,
                competencySelfAttestedLevelValue: compValue,
                competencyType: evt.competencyType,
                description: evt.description,
                osid: evt.osid,
                id: evt.id,
                name: evt.name,
                source: evt.source,
                status: evt.status,
                type: evt.type,
              }
              this.updatecompList.push(obj)
            }
          }
        })
      })
    } else {
      this.updatecompList = event
    }
    this.changedProperties = {
      profileDetails: {
        desiredCompetencies: this.updatecompList,
      },
    }
    const reqUpdates = {
      request: {
        userId: this.configService.unMappedUser.id,
        ...this.changedProperties,
      },
    }
    this.competencySvc.updateProfileDetails(reqUpdates).subscribe((res: any) => {
      if (res.responseCode === 'OK') {
        this.configService.updateGlobalProfile(true)
        this.alldesiredCompetencies = []
        this.updatecompList = []
        this.desiredcompList = []
        this.ngOnInit()
      }
    })
  }
  openActivityDialog() {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      data: {
        view: 'dscomp',
      },
      hasBackdrop: false,
      width: '550px',

    })
    dialogRef.afterClosed().subscribe(_result => {
    })
  }
}
