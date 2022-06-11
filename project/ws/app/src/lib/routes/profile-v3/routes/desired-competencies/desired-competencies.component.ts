import { Component, OnInit } from '@angular/core'
import { ProfileV3Service } from '../../services/profile_v3.service'
import { NSProfileDataV3 } from '../../models/profile-v3.models'
import { ConfigurationsService } from '@sunbird-cb/utils/src/public-api'
// tslint:disable-next-line
import _ from 'lodash'
import { ActivatedRoute } from '@angular/router'
import { MatDialog } from '@angular/material'
import { DialogBoxComponent } from '../../components/dialog-box/dialog-box.component'

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
  allCompetencies: any = []
  changedProperties: any = {}
  // userDetails: any
  updatecompList: any = []
  overallCompetencies!: NSProfileDataV3.ICompetencie[]
  desiredcompList: any = []

  constructor(private competencySvc: ProfileV3Service, private configService: ConfigurationsService,
              private activateroute: ActivatedRoute, private dialog: MatDialog,) {}

  ngOnInit() {
    this.getUserDetails()
  }

  getUserDetails() {
    // if (this.configService.unMappedUser && this.configService.unMappedUser.id) {
    //   this.competencySvc.getUserdetailsFromRegistry(this.configService.unMappedUser.id).subscribe(
    //     (data: any) => {
    //       this.userDetails = data
    //       this.desiredcompList = data.profileDetails.desiredCompetencies
    //       this.getCompetencies()
    //   })
    // }
    this.desiredcompList = _.get(this.configService.unMappedUser, 'profileDetails.desiredCompetencies') || []
    if (this.overallCompetencies && this.overallCompetencies.length > 0) {
      this.getCompLsit()
    } else {
      this.getCompetencies()
    }
  }

  getCompetencies() {
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
    if (
      this.activateroute.snapshot.parent
      && this.activateroute.snapshot.parent.data.competencies
      && this.activateroute.snapshot.parent.data.competencies.data
    ) {
      this.overallCompetencies = this.activateroute.snapshot.parent.data.competencies.data
    }
    this.getCompLsit()
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
              ncomp.competencySelfAttestedLevel = comp.competencySelfAttestedLevel
              ncomp.competencySelfAttestedLevelValue = comp.competencySelfAttestedLevelValue
              ncomp.competencyType = comp.competencyType
              ncomp.osid = comp.osid
              if (!this.allCompetencies.some((el: any) => el.id === ncomp.id)) {
                if (ncomp.children && ncomp.children.length > 0) {
                  ncomp.children.forEach((lvl: any) => {
                    lvl.id = !isNaN(Number(lvl.id)) ? Number(lvl.id) : lvl.id
                  })
                }
                this.allCompetencies.unshift(ncomp)
              }
            } else {
              if (!this.allCompetencies.some((el: any) => el.id === ncomp.id)) {
                if (ncomp.children && ncomp.children.length > 0) {
                  ncomp.children.forEach((lvl: any) => {
                    lvl.id = !isNaN(Number(lvl.id)) ? Number(lvl.id) : lvl.id
                  })
                }
                this.allCompetencies.push(ncomp)
              }
            }
          })
        })
      } else {
        this.allCompetencies = this.overallCompetencies
      }
    }
    // this.allCompetencies = this.overallCompetencies
  }

  updateSelectedCompetency(event: any) {
    if (this.desiredcompList && this.desiredcompList.length > 0) {
      this.updatecompList = this.desiredcompList
      this.updatecompList.forEach((com: any) => {
         event.forEach((evt: any) => {
           if (evt.id === com.id) {
            //  this.updatecompList.push(evt)
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
              const obj  = {
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
        this.allCompetencies = []
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
        width: '550px'

    })
    dialogRef.afterClosed().subscribe(_result => {

    })
    }
}
