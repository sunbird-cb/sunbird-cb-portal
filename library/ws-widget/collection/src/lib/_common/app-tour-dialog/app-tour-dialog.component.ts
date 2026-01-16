import { ConfigurationsService, NsPage } from '@sunbird-cb/utils-v2'
import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'
import { CustomTourService } from '../tour-guide/tour-guide.service'
import { Router } from '@angular/router'

@Component({
  selector: 'ws-widget-app-tour-dialog',
  templateUrl: './app-tour-dialog.component.html',
  styleUrls: ['./app-tour-dialog.component.scss'],
})
export class AppTourDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  pageData: NsPage.IPage | null = null
  takeToAnotherLink = false
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<AppTourDialogComponent>,
    private tour: CustomTourService,
    @Inject(MAT_DIALOG_DATA) public clicked: string,
    private configSvc: ConfigurationsService,
  ) { }

  ngOnInit() {
    if (this.configSvc.userUrl) {
      this.takeToAnotherLink = true
    }
  }

  ngOnDestroy() {
    this.configSvc.userUrl = ''
  }

  ngAfterViewInit() {
    const hash: any = window.location.hash ? window.location.hash.split('#')[1] : ''
    if (hash && isNaN(hash)) {
      setTimeout(() => {
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView()
        }
        // tslint:disable-next-line: align
      }, 1000)
    }
  }

  startTour() {
    this.tour.startTour()
  }

  takeToLink() {
    this.router.navigateByUrl(this.configSvc.userUrl)
    this.configSvc.userUrl = ''
  }
}
