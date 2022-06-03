import { Component, OnInit } from '@angular/core'
import { ProfileV3Service } from '../../services/profile_v3.service'
import { NSProfileDataV3 } from '../../models/profile-v3.models'
import { ConfigurationsService } from '@sunbird-cb/utils/src/public-api'
import * as _ from 'lodash'
@Component({
  selector: 'ws-app-current-competencies',
  templateUrl: './current-competencies.component.html',
  styleUrls: ['./current-competencies.component.scss'],
})
export class CurrentCompetenciesComponent implements OnInit {
  searchJson!: NSProfileDataV3.ISearch[]
  allCompetencies: any = []
  overallCompetencies!: NSProfileDataV3.ICompetencie[]

  constructor(private competencySvc: ProfileV3Service, private configService: ConfigurationsService) {}

  ngOnInit() {
    this.getCompetencies()
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
      if (this.configService && this.configService.userProfileV2) {
        if (this.configService.userProfileV2.competencies && this.configService.userProfileV2.competencies.length > 0) {
          const complist = this.configService.userProfileV2.competencies
          complist.forEach((comp: any) => {
            this.overallCompetencies.forEach((ncomp: any) => {
              if (comp.id === ncomp.id) {
                ncomp.competencySelfAttestedLevel = comp.competencySelfAttestedLevel
                ncomp.competencySelfAttestedLevelValue = comp.competencySelfAttestedLevelValue
                ncomp.osid = comp.osid
                this.allCompetencies.push(ncomp)
              }
            })
          })
        } else {
          this.allCompetencies = this.overallCompetencies
        }
      } else {
        this.allCompetencies = this.overallCompetencies
      }
    }
  }

  getSelectedCompetency(_event: any) {
    // console.log('getSelectedCompetency ********', event)
  }

  getSelectedCompLevel(_event: any) {
    // console.log('getSelectedCompetencyLEvel ==========', event)
  }

}
