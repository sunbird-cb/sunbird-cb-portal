import { Component, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import moment from 'moment'

@Component({
  selector: 'ws-app-today-event-card',
  templateUrl: './today-event-card.component.html',
  styleUrls: ['./today-event-card.component.scss'],
})
export class TodayEventCardComponent implements OnInit {
  @Input() eventData: any
  isLive = false
  isRecording = false

  constructor(private router: Router, private translate: TranslateService) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      let lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
   }

  ngOnInit() {
    if (this.eventData) {
      const eventDate = this.customDateFormat(this.eventData.event.startDate, this.eventData.event.startTime)
      const eventendDate = this.customDateFormat(this.eventData.event.endDate, this.eventData.event.endTime)
      const now = new Date()
      const today = moment(now).format('YYYY-MM-DD HH:mm')
      if (moment(today).isBetween(eventDate, eventendDate)) {
        this.isRecording = false
        this.isLive = true
        if (today >= eventendDate) {
          if (this.eventData.event.recordedLinks && this.eventData.event.recordedLinks.length > 0) {
            this.isRecording = true
            this.isLive = false
          }
        }
      } else if (today >= eventendDate) {
        this.isRecording = true
        this.isLive = false
      }
    }
  }
  customDateFormat(date: any, time: any) {
    const stime = time.split('+')[0]
    const hour = stime.substr(0, 2)
    const min = stime.substr(2, 3)
    return `${date} ${hour}${min}`
  }
  getEventDetails(eventID: any) {
    // this.router.navigate([`/app/event-hub/home/${this.discuss.tid}`])
    this.router.navigate([`/app/event-hub/home/${eventID}`])
  }

  translateLabels(label: string, type: any) {
    console.log(label)
    label = label.replace(/\s/g, "").toLocaleLowerCase()
    const translationKey = type + '.' +  label;
    return this.translate.instant(translationKey);
  }
}
