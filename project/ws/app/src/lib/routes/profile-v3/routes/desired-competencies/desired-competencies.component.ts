import { Component, OnInit } from '@angular/core'
import { ProfileV3Service } from '../../services/profile_v3.service'
import { NSProfileDataV3 } from '../../models/profile-v3.models'
import { ConfigurationsService } from '@sunbird-cb/utils/src/public-api'

@Component({
  selector: 'ws-app-desired-competencies',
  templateUrl: './desired-competencies.component.html',
  styleUrls: ['./desired-competencies.component.scss'],
})
export class DesiredCompetenciesComponent implements OnInit {
  searchJson!: NSProfileDataV3.ISearch[]
  allCompetencies: any = []
  changedProperties: any = {}
  userDetails: any
  updatecompList: any = []
  overallCompetencies!: NSProfileDataV3.ICompetencie[]
  desiredcompList: any = []

  constructor(private competencySvc: ProfileV3Service, private configService: ConfigurationsService) { }

  ngOnInit() {
    this.getUserDetails()
  }

  getUserDetails() {
    if (this.configService.unMappedUser && this.configService.unMappedUser.id) {
      this.competencySvc.getUserdetailsFromRegistry(this.configService.unMappedUser.id).subscribe(
        (data: any) => {
          this.userDetails = data
          this.desiredcompList = data.profileDetails.desiredCompetencies
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
      if (this.desiredcompList && this.desiredcompList.length > 0) {
        const complist = this.desiredcompList
        complist.forEach((comp: any) => {
          this.overallCompetencies.forEach((ncomp: any) => {
            if (comp.id === ncomp.id) {
              ncomp.competencySelfAttestedLevel = comp.competencySelfAttestedLevel
              ncomp.competencySelfAttestedLevelValue = comp.competencySelfAttestedLevelValue
              ncomp.osid = comp.osid
            }
          })
        })
      }
    }
    this.allCompetencies = this.overallCompetencies
  }

  updateSelectedCompetency(event: any) {
    if (this.desiredcompList && this.desiredcompList.length > 0) {
      this.updatecompList = this.desiredcompList
      this.updatecompList.forEach((com: any) => {
         event.forEach((evt: any) => {
           if (evt.id === com.id) {
            //  this.updatecompList.push(evt)
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
        this.allCompetencies = []
        this.updatecompList = []
        this.ngOnInit()
      }
    })
  }
}
