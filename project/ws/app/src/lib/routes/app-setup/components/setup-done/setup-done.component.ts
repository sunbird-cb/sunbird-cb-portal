import { Component, OnInit } from '@angular/core'
import { SafeUrl, DomSanitizer } from '@angular/platform-browser'
import {
  ConfigurationsService,
  NsPage,
} from '@sunbird-cb/utils-v2'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { AppTourDialogComponent } from '@sunbird-cb/collection'
import { Router, ActivatedRoute } from '@angular/router'
import { Globals } from '../../globals'

@Component({
  selector: 'ws-app-setup-done',
  templateUrl: './setup-done.component.html',
  styleUrls: ['./setup-done.component.scss'],
})
export class SetupDoneComponent implements OnInit {
  appIcon: SafeUrl | null = null
  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar
  badges: any | null = null
  constructor(
    private configSvc: ConfigurationsService,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private matDialog: MatDialog,
    private router: Router,
    private globals: Globals,
  ) { }

  ngOnInit() {
    this.route.data.subscribe(async data => {
      this.badges = data.badges.data
    })
    if (this.configSvc.instanceConfig) {
      this.appIcon = this.domSanitizer.bypassSecurityTrustResourceUrl(
        this.configSvc.instanceConfig.logos.thumpsUp || '',
      )
    }
  }

  finishSetup() {
    this.globals.firstTimeSetupDone = true
    this.matDialog.open(AppTourDialogComponent, {
      width: '500px',
      minHeight: '350px',
      data: 'dialog',
      backdropClass: 'backdropBackground',
    })
    this.router.navigate(['page', 'home'])
  }
}
