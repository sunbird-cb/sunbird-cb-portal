import { Component, OnInit } from '@angular/core'
import { ProfileV3Service } from '../../services/profile_v3.service'
import { NSProfileDataV3 } from '../../models/profile-v3.models'

@Component({
  selector: 'ws-app-current-competencies',
  templateUrl: './current-competencies.component.html',
  styleUrls: ['./current-competencies.component.scss'],
})
export class CurrentCompetenciesComponent implements OnInit {
  searchJson!: NSProfileDataV3.ISearch[]
  allCompetencies!: NSProfileDataV3.ICompetencie[]

  constructor(private competencySvc: ProfileV3Service) { }

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
          this.allCompetencies = reponse.responseData
        }
      })
  }

  getSelectedCompetency(event: any) {
    console.log('getSelectedCompetency ********', event)
  }

  getSelectedCompLevel(event: any) {
    console.log('getSelectedCompetencyLEvel ==========', event)
  }

}
