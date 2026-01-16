import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'ws-survey-form',
  templateUrl: './survey-form.component.html',
  styleUrls: ['./survey-form.component.scss'],
})
export class SurveyFormComponent implements OnInit {
  surveyPopupData: any
  surveyPopup: any
  isSurveyPopup = true
  widgetData: any
  userRead: any
  isTourDone: any
  localStorageFlag: any
  languageFlag: any
  constructor(
    private activatedRoute: ActivatedRoute,
    private configSvc: ConfigurationsService,
  ) { }

  ngOnInit() {
    if (this.activatedRoute.snapshot.data.pageData && this.activatedRoute.snapshot.data.pageData.data) {
      this.surveyPopupData = this.activatedRoute.snapshot.data.pageData.data.surveyPopup.banners
      this.surveyPopup = this.activatedRoute.snapshot.data.pageData.data.surveyPopup
      this.widgetData = this.activatedRoute.snapshot.data.pageData.data.surveyPopup
    }
    this.userRead = this.configSvc.unMappedUser
    if (this.userRead && this.userRead.profileDetails && this.userRead.profileDetails.get_started_tour) {
      if (this.userRead.profileDetails.get_started_tour.skipped || this.userRead.profileDetails.get_started_tour.visited) {
          this.isTourDone = true
      } else {
        this.isTourDone = false
      }
    }
    const localFlag = localStorage.getItem('surveyPopup')
     if (localFlag === 'true') {
      this.localStorageFlag = true
     } else if (localFlag === 'false') {
      this.localStorageFlag = false
     }
     const webLanguage = localStorage.getItem('websiteLanguage')
     if (webLanguage === 'en') {
      this.languageFlag = true
     } else if (localFlag === 'hi') {
      this.languageFlag = false
     }
  }

  closeCard() {
   this.isSurveyPopup = false
   if (this.localStorageFlag) {
    localStorage.setItem('surveyPopup', 'false')
    this.localStorageFlag = false
   }
  }
}
