import { Component, Input, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import { ActivatedRoute } from '@angular/router'
import { AttendanceHelperComponent } from '@sunbird-cb/collection/src/public-api'
import { NsContent } from '@sunbird-cb/utils'
// tslint:disable
import _ from 'lodash'

@Component({
  selector: 'ws-app-app-toc-attendance-card',
  templateUrl: './app-toc-attendance-card.component.html',
  styleUrls: ['./app-toc-attendance-card.component.scss'],
})
export class AppTocAttendanceCardComponent implements OnInit {
  @Input() session: NsContent.IContent | null = null
  @Input() status = 0
  tocConfig: any = null

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.tocConfig = data.pageData.data
      console.log(this.tocConfig)
    })
  }

  openHelp(content?: any): void {
      const dialogRef = this.dialog.open(AttendanceHelperComponent, {
        // height: '400px',
        // width: '770px',
        maxWidth: '1250px',
        data: { content, helperConfig: _.get(this.tocConfig, 'attendenceHelp')},
      })
      // dialogRef.componentInstance.xyz = this.configSvc
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          console.log(result)
        }
      })
  }

}
