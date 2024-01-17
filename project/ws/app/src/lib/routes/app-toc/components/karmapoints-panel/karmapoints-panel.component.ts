import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-app-karmapoints-panel',
  templateUrl: './karmapoints-panel.component.html',
  styleUrls: ['./karmapoints-panel.component.scss'],
})
export class KarmaPointsPanelComponent implements OnInit {
    @Input() btntype: any
    @Input() data: any = []
    @Input() btnCategory = ''
    @Input() pCategory = ''
    @Output() clickClaimKarmaPoints = new EventEmitter<string>()
    kpData: any

  constructor(
    private translate: TranslateService,
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      let lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }

  ngOnInit() {
    this.data.forEach((item: any) => {
        if (item.displayButton === this.btntype) {
            this.kpData = item
        }
    })
  }

  onClickOfClaim() {
    this.clickClaimKarmaPoints.emit('claim')
  }

  getDynamicText(helText: string) {
    if (this.pCategory !== '') {
      return helText.replace('course', this.pCategory.toLowerCase())
    }
    return helText
  }

  translateLabels(label: string, type: any, subtype: any) {
    label = label.replace(/\s/g, "")
    if(subtype) {
      const translationKey = type + '.' +  label + subtype
      return this.translate.instant(translationKey);
    }
    const translationKey = type + '.' +  label
    return this.translate.instant(translationKey);
  }

}
