import { Component, OnInit } from '@angular/core'
import { ProfileV3Service } from '../../services/profile_v3.service'
import { NSProfileDataV3 } from '../../models/profile-v3.models'
import { ConfigurationsService } from '@sunbird-cb/utils/src/public-api'
import * as _ from 'lodash'
@Component({
  selector: 'ws-app-current-competencies',
  templateUrl: './current-competencies.component.html',
  styleUrls: ['./current-competencies.component.scss'],
    /* tslint:disable */
    host: { class: 'flex flex-1 comptency_main_div' },
    /* tslint:enable */
})
export class CurrentCompetenciesComponent implements OnInit {
  searchJson!: NSProfileDataV3.ISearch[]
  allCompetencies: any = []
  overallCompetencies!: NSProfileDataV3.ICompetencie[]
  changedProperties: any = {}
  userDetails: any
  updatecompList: any = []
  competenciesList: any = []

  constructor(private competencySvc: ProfileV3Service, private configService: ConfigurationsService) {}

  ngOnInit() {
    this.getUserDetails()
  }

  getUserDetails() {
    if (this.configService.unMappedUser && this.configService.unMappedUser.id) {
      this.competencySvc.getUserdetailsFromRegistry(this.configService.unMappedUser.id).subscribe(
        (data: any) => {
          this.userDetails = data
          this.competenciesList = data.profileDetails.competencies
          this.getCompetencies()
      })
    }
  }

  getCompetencies() {
    this.searchJson = [
      { type: 'COMPETENCY', field: 'name', keyword: '' },
      { type: 'COMPETENCY', field: 'status', keyword: 'VERIFIED' },
    ]

    const searchObj = {
      searches: this.searchJson,
      childNodes: true,
    }
    this.competencySvc
      .getAllCompetencies(searchObj)
      .subscribe((reponse: any) => {
        if (reponse.statusInfo && reponse.statusInfo.statusCode === 200) {
          this.overallCompetencies = reponse.responseData
          this.getCompLsit()
        }
      })
  }

  getCompLsit() {
    if (this.overallCompetencies) {
      if (this.competenciesList && this.competenciesList.length > 0) {
        const complist = this.competenciesList
        complist.forEach((comp: any) => {
          this.overallCompetencies.forEach((ncomp: any) => {
            if (comp.id === ncomp.id) {
              ncomp.competencySelfAttestedLevel = comp.competencySelfAttestedLevel
              ncomp.competencySelfAttestedLevelValue = comp.competencySelfAttestedLevelValue
              ncomp.osid = comp.osid
              if (!this.allCompetencies.some((el: any) => el.id === ncomp.id)) {
                this.allCompetencies.unshift(ncomp)
              }
            } else {
              if (!this.allCompetencies.some((el: any) => el.id === ncomp.id)) {
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
    if (this.competenciesList && this.competenciesList.length > 0) {
     this.updatecompList = this.competenciesList
     this.updatecompList.forEach((com: any) => {
        event.forEach((evt: any) => {
          if (evt.id === com.id) {
            com.competencySelfAttestedLevel = evt.competencySelfAttestedLevel
            com.competencySelfAttestedLevelValue = evt.competencySelfAttestedLevelValue
            com.osid = evt.osid
          } else {
            if (!this.updatecompList.some((el: any) => el.id === evt.id)) {
              this.updatecompList.push(evt)
            }
          }
        })
      })
    } else {
      this.updatecompList = event
    }

    this.changedProperties = {
      profileDetails: {
        competencies: this.updatecompList,
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
        this.ngOnInit()
      }
    })
  }

}
