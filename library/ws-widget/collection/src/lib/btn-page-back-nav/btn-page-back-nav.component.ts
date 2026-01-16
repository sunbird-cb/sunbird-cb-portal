import { Component, Input, OnInit } from '@angular/core'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { Router } from '@angular/router'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { BtnPageBackNavService } from './btn-page-back-nav.service'
import { ConfirmDialogComponent } from '../_common/confirm-dialog/confirm-dialog.component'
type TUrl = undefined | 'none' | 'back' | string
@Component({
  selector: 'ws-widget-btn-page-back-nav',
  templateUrl: './btn-page-back-nav.component.html',
  styleUrls: ['./btn-page-back-nav.component.scss'],
})
export class BtnPageBackNavComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<{ url: TUrl }> {
  @Input() widgetData: { url: TUrl, titles?: NsWidgetResolver.ITitle[], queryParams?: any } = { url: 'none', titles: [] }
  @Input() assessmentStart = false
  presentUrl = ''
  assessmentStartSubscription: any
  constructor(
    private btnBackSvc: BtnPageBackNavService,
    private router: Router,
    private dialog: MatDialog
  ) {
    super()
  }

  ngOnInit() {
    this.presentUrl = this.router.url

  }

  get backUrl(): { fragment?: string; routeUrl: string; queryParams: any } {

    if (this.presentUrl === '/page/explore') {
      return {
        queryParams: undefined,
        routeUrl: '/page/home',
      }
    }
    if (this.widgetData.url === 'home') {
      return {
        queryParams: undefined,
        routeUrl: '/page/home',
      }
    }

    if (this.widgetData.url === 'doubleBack') {
      return {
        fragment: this.btnBackSvc.getLastUrl(2).fragment,
        queryParams: this.btnBackSvc.getLastUrl(2).queryParams,
        routeUrl: this.btnBackSvc.getLastUrl(2).route,
      }
    } if (this.widgetData.url === 'back') {
      return {
        fragment: this.btnBackSvc.getLastUrl().fragment,
        queryParams: this.btnBackSvc.getLastUrl().queryParams,
        routeUrl: this.btnBackSvc.getLastUrl().route,
      }
    }
    if (this.widgetData.url !== 'back' && this.widgetData.url !== 'doubleBack') {
      this.btnBackSvc.checkUrl(this.widgetData.url)

    }

    return {
      queryParams: this.widgetData.queryParams || undefined,
      routeUrl: this.widgetData.url ? this.widgetData.url : '/app/home',
    }
  }

  navigateToBack() {
    if (this.assessmentStart) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: ' ',
          cancelButton: 'Cancel',
          acceptButton: 'Confirm',
          message: 'Are you sure you want to exit the assessment',
          from: 'assessment',
        },
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (this.backUrl && this.backUrl.fragment) {
            this.router.navigate([this.backUrl.routeUrl], { queryParams : this.backUrl.queryParams, fragment: this.backUrl.fragment })
          } else {
            this.router.navigate([this.backUrl.routeUrl], { queryParams : this.backUrl.queryParams })
          }
        }
      })
    } else {
      if (this.backUrl && this.backUrl.fragment) {
        this.router.navigate([this.backUrl.routeUrl], { queryParams : this.backUrl.queryParams, fragment: this.backUrl.fragment })
      } else {
        this.router.navigate([this.backUrl.routeUrl], { queryParams : this.backUrl.queryParams })
      }
    }

  }

}
