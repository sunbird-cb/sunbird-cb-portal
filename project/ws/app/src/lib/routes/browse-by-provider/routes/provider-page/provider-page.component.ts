import { DatePipe } from '@angular/common'
import {  Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { EventService, WsEvents } from '@sunbird-cb/utils-v2'
import * as _ from 'lodash'

@Component({
  selector: 'ws-app-provider-page',
  templateUrl: './provider-page.component.html',
  styleUrls: ['./provider-page.component.scss'],
})
export class ProviderPageComponent implements OnInit  {

  providerName = ''
  providerId = ''
  navList: any
  hideCompetencyBlock = false
  sectionList: any = []
  currentMonthAndYear: any
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school', disableTranslate: false },
    { title: `All Providers`,
      url: `/app/learn/browse-by/provider/all-providers`,
      icon: '', disableTranslate: true,
    },
  ]

  descriptionMaxLength = 500
  isTelemetryRaised = false

  constructor(private route: ActivatedRoute,
              public router: Router, private datePipe: DatePipe, private events: EventService) {

  }

  ngOnInit() {
    if (this.route.snapshot.data && this.route.snapshot.data.formData
      && this.route.snapshot.data.formData.data
      && this.route.snapshot.data.formData.data.result
      && this.route.snapshot.data.formData.data.result.form
      && this.route.snapshot.data.formData.data.result.form.data
      && this.route.snapshot.data.formData.data.result.form.data.sectionList
    ) {
      this.sectionList = this.route.snapshot.data.formData.data.result.form.data.sectionList
    }
    this.route.params.subscribe(params => {
      this.providerName = params['provider']
      this.providerId = params['orgId']
      this.titles.push({
        title: this.providerName, icon: '', url: 'none', disableTranslate: true,
      })
    })
    this.getNavitems()
    this.currentMonthAndYear = this.datePipe.transform(new Date(), 'MMMM y')
  }

  getNavitems() {
    this.navList = this.sectionList.filter(
      (obj: any) => obj.enabled && obj.navigation && obj.navOrder).sort(
        (a: any, b: any) => a.navOrder - b.navOrder)
  }

  scrollToSection(name:  string) {
    let section: HTMLElement | any
    section = document.getElementById(name)
    if (section) {
      // section.scrollIntoView({ behavior: 'smooth', block: 'start',inline: 'nearest', offsetTop: yOffset  })
      window.scrollTo({
        top: section.offsetTop - 121,
        behavior: 'smooth',
      })
    }
  }
  hideCompetency(event: any, columnData: any) {
    if (event) {
      this.hideCompetencyBlock = true
      columnData['navigation'] = false
      columnData['enabled'] = false
      this.navList.forEach((navItem: any) => {
       navItem.column.forEach((colEle: any) => {
          if (colEle.key === columnData.key) {
            navItem['navigation'] = false
          }
       })
      })
    }
  }
  hideContentStrip(event: any, contentStripData: any) {
    if (event) {
      contentStripData['hideSection'] = true
    }
  }
  hideLearnerReview(event: any, learnerReview: any) {
    if (event) {
      learnerReview['hideSection'] = true
    }
  }

  showAllContent(_stripData: any, contentStrip: any) {
    if (contentStrip && contentStrip.strips && contentStrip.strips.length) {
      const stripData: any = contentStrip.strips[0]
      if (stripData && stripData.request) {
        delete(stripData['loaderWidgets'])
        this.router.navigate(
          [`/app/learn/browse-by/provider/${this.providerName}/${this.providerId}/all-content`],
          { queryParams: { stripData: JSON.stringify(stripData), pageDetails: true } })
      }
    } else {
       this.router.navigate(
        [`/app/learn/browse-by/provider/${this.providerName}/${this.providerId}/all-CBP`],
        { queryParams: { pageDetails: true } })
    }
  }

  raiseTelemetryInteratEvent(event: any) {
    if (event && event.viewMoreUrl) {
      this.raiseTelemetry(`${event.stripTitle} ${event.viewMoreUrl.viewMoreText}`)
    }
    if (!this.isTelemetryRaised && event && !event.viewMoreUrl) {
      this.events.raiseInteractTelemetry(
        {
          type: 'click',
          subType: 'ATI/CTI',
          id: `${_.kebabCase(event.typeOfTelemetry.toLocaleLowerCase())}-card`,
        },
        {
          id: event.identifier,
          type: event.primaryCategory,
        },
        {
          pageIdExt: `${_.kebabCase(event.primaryCategory.toLocaleLowerCase())}-card`,
          module: WsEvents.EnumTelemetrymodules.LEARN,
        }
      )
      this.isTelemetryRaised = true
    }
  }

  raiseCompetencyTelemetry(name: string) {
    this.raiseTelemetry(`${name} core expertise`)
  }

  raiseTelemetry(name: string) {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: 'ATI/CTI',
        id: `${_.kebabCase(name).toLocaleLowerCase()}`,
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.LEARN,
      }
    )
  }

  raiseNavTelemetry(name: string) {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: 'ATI/CTI',
        id: `${_.kebabCase(name).toLocaleLowerCase()}-navigation`,
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.LEARN,
      }
    )
  }
}
