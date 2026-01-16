import { Component, Input, OnInit } from '@angular/core'
import { switchMap, map, catchError } from 'rxjs/operators'
import { of, Observable } from 'rxjs'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils-v2'
import { NsContent } from '../_services/widget-content.model'
import {
  BtnContentMailMeDialogComponent,
  IWidgetMailMeDialogComponentResponse,
} from './btn-content-mail-me-dialog/btn-content-mail-me-dialog.component'
import { WidgetContentShareService } from '../_services/widget-content-share.service'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'

enum TMailMeResponse {
  NONE,
  SUCCESS,
  ERROR,
}
interface IMailMeResponseObj extends IWidgetMailMeDialogComponentResponse {
  res: TMailMeResponse
}
const VALID_CATEGORIES = new Set(['leave behind'])

@Component({
  selector: 'ws-widget-btn-content-mail-me',
  templateUrl: './btn-content-mail-me.component.html',
  styleUrls: ['./btn-content-mail-me.component.scss'],
})
export class BtnContentMailMeComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<NsContent.IContent> {
  @Input() widgetData!: NsContent.IContent
  enabled = false
  constructor(
    private events: EventService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private shareSvc: WidgetContentShareService,
    private configSvc: ConfigurationsService,
  ) {
    super()
  }

  ngOnInit() {
    this.checkAccessibility()
  }

  checkAccessibility() {
    try {
      let userEmail = ''
      if (this.configSvc.userProfile) {
        userEmail = this.configSvc.userProfile.email || ''
      }
      const instanceConfig = this.configSvc.instanceConfig
      if (instanceConfig && instanceConfig.validMailIdExtensionsForMailMe.indexOf(`@${userEmail.split('@')[1]}`) > -1) {
        let isLeaveBehind = false
        if (this.widgetData.resourceCategory) {
          this.widgetData.resourceCategory.forEach(category => {
            isLeaveBehind = isLeaveBehind || VALID_CATEGORIES.has(category.toLowerCase())
          })
          this.enabled =
            isLeaveBehind &&
            (this.widgetData.mimeType === NsContent.EMimeTypes.PDF ||
              this.widgetData.mimeType === NsContent.EMimeTypes.MP4 ||
              this.widgetData.mimeType === NsContent.EMimeTypes.M3U8 ||
              this.widgetData.mimeType === NsContent.EMimeTypes.MP3 ||
              this.widgetData.mimeType === NsContent.EMimeTypes.YOUTUBE)
        }
      } else {
        this.enabled = false
      }
    } catch (e) {
      this.enabled = false
    }
  }
  confirm() {
    const dialogRef = this.dialog.open(BtnContentMailMeDialogComponent, {
      data: { title: this.widgetData.name, description: this.widgetData.description },
    })

    dialogRef
      .afterClosed()
      .pipe(
        switchMap(
          (dialogResponse: IWidgetMailMeDialogComponentResponse): Observable<IMailMeResponseObj> => {
            if (dialogResponse && dialogResponse.send) {
              this.events.raiseInteractTelemetry(
                {
                  type: 'mailMe',
                  subType: undefined,
                  id: this.widgetData.identifier,
                },
                {
                  id: this.widgetData.identifier,
                  type: this.widgetData.contentType,
                },
                {
                  pageIdExt: 'btn-mailme',
                  module: WsEvents.EnumTelemetrymodules.CONTENT,
                }
              )
              return this.shareSvc.shareContent(this.widgetData, [], dialogResponse.mailBody, 'attachment').pipe(
                map(({ response }): boolean => response === 'Success'),
                map(
                  (isSuccessful): IMailMeResponseObj => ({
                    res: isSuccessful ? TMailMeResponse.SUCCESS : TMailMeResponse.ERROR,
                    ...dialogResponse,
                  }),
                ),
                catchError(() => {
                  return of({ res: TMailMeResponse.ERROR, ...dialogResponse })
                }),
              )
            }
            return of({ res: TMailMeResponse.NONE, ...dialogResponse })
          },
        ),
      )
      .subscribe((res: IMailMeResponseObj) => {
        switch (res.res) {
          case TMailMeResponse.SUCCESS:
            this.snackBar.open(res.successToast, 'X')
            break
          case TMailMeResponse.ERROR:
            this.snackBar.open(res.errorToast, 'X')
            break
        }
      })
  }
}
