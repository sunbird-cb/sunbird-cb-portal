import { Component, Input, OnInit } from '@angular/core'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { InfoDialogComponent } from '../info-dialog/info-dialog.component'
import { TranslateService } from '@ngx-translate/core'
import { MultilingualTranslationsService, EventService, WsEvents  } from '@sunbird-cb/utils-v2'
@Component({
  selector: 'ws-widget-weekly-claps',
  templateUrl: './weekly-claps.component.html',
  styleUrls: ['./weekly-claps.component.scss'],
})
export class WeeklyClapsComponent implements OnInit {
  @Input() isLoading: any = ''
  @Input() insightsData: any = ''
  @Input() weeklyData: any = ''

  constructor(private dialog: MatDialog, private translate: TranslateService,
              private langtranslations: MultilingualTranslationsService,
              private eventService: EventService) {

    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }

    })
   }

  ngOnInit() {
    // if(this.activatedRoute.snapshot.data.pageData) {
    //   this.weeklyData = this.activatedRoute.snapshot.data.pageData.data
    // && this.activatedRoute.snapshot.data.pageData.data.weeklyClaps || []
    // }
  }

  openInfo(myDialog: any) {
    this.eventService.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        id: 'weekly-claps-info',
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.HOME,
      }
    )
    const confirmDialog = this.dialog.open(InfoDialogComponent, {
        width: '613px',
        panelClass: 'custom-info-dialog',
        backdropClass: 'info-dialog-backdrop',
        data: {  template:  myDialog },
      })
      confirmDialog.afterClosed().subscribe((result: any) => {
        if (result) {
        }
      })
  }

}
