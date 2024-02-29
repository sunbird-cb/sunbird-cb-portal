import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

import { MultilingualTranslationsService } from '@sunbird-cb/utils/src/public-api'

@Component({
  selector: 'ws-app-karmapoints-panel',
  templateUrl: './karmapoints-panel.component.html',
  styleUrls: ['./karmapoints-panel.component.scss'],
})
export class KarmaPointsPanelComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private langTranslations: MultilingualTranslationsService
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }
  @Input() btntype: any
  @Input() data: any = []
  @Input() btnCategory = ''
  @Input() pCategory = ''
  @Output() clickClaimKarmaPoints = new EventEmitter<string>()
  @Input() condition: any
  kpData: any

  karmaPointsSlider: any

  ngOnInit() {
    this.data.forEach((item: any) => {
      if (item.displayButton === this.btntype) {
          this.kpData = item
      }
    })
    this.constructNudgeData()
    // console.log('condition - ', this.condition)
  }

  onClickOfClaim() {
    this.clickClaimKarmaPoints.emit('claim')
  }
  constructNudgeData() {
    const nudgeData: any = {
      type: 'karma-points',
      iconsDisplay: false,
      cardClass: 'slider-container',
      height: 'auto',
      width: '',
      sliderData: [],
      negativeDisplay: false,
      'dot-default': 'dot-grey',
      'dot-active': 'dot-active',
    }

    nudgeData.sliderData = [{
      textBeforeIcon: 'Earn',
      points: '10',
      textAfterIcon: 'by completing this course',
    }, {
      textBeforeIcon: 'Earn',
      points: '15',
      textAfterIcon: 'by completing this course',
    }, {
      textBeforeIcon: 'Earn',
      points: '20',
      textAfterIcon: 'by completing this course',
    }]

    this.karmaPointsSlider = nudgeData
  }

  getDynamicText(helText: string) {
    if (this.pCategory !== '') {
      return helText.replace('course', this.pCategory.toLowerCase())
    }
    return helText
  }

  translateLabels(label: string, type: any) {
    return this.langTranslations.translateLabelWithoutspace(label, type, '')
  }

}
