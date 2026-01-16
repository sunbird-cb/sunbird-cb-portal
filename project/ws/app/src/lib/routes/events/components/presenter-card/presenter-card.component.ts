import { Component, OnInit, Input } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-presenter-card',
  templateUrl: './presenter-card.component.html',
  styleUrls: ['./presenter-card.component.scss'],
})
export class PresenterCardComponent implements OnInit {
  @Input() userData: any
  initials: any
  badge!: any

  constructor(private translate: TranslateService) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
   }

  ngOnInit() {
    if (this.userData && !this.initials) {
      this.createInititals()
    }
   }

  private createInititals(): void {
    let initials = ''
    const array = `${this.userData.name || this.userData.firstname} `.toString().split(' ')
    if (array[0] !== 'undefined' && typeof array[1] !== 'undefined') {
      initials += array[0].charAt(0)
      initials += array[1].charAt(0)
    } else {
      if (this.userData.name) {
        for (let i = 0; i < this.userData.name.length; i += 1) {
          if (this.userData.name.charAt(i) === ' ') {
            continue
          }

          if (this.userData.name.charAt(i) === this.userData.name.charAt(i)) {
            initials += this.userData.name.charAt(i)

            if (initials.length === 2) {
              break
            }
          }
        }
      }
      if (this.userData.firstname) {
        for (let i = 0; i < this.userData.firstname.length; i += 1) {
          if (this.userData.firstname.charAt(i) === ' ') {
            continue
          }

          if (this.userData.firstname.charAt(i) === this.userData.firstname.charAt(i)) {
            initials += this.userData.firstname.charAt(i)

            if (initials.length === 2) {
              break
            }
          }
        }
      }
    }
    this.initials = initials.toUpperCase()
  }
}
