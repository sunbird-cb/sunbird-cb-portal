import { Component, Input, OnInit } from '@angular/core'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
// import { ActivatedRoute } from '@angular/router'
import { AttendanceHelperComponent } from '@sunbird-cb/collection/src/public-api'
import { NsContent } from '@sunbird-cb/utils-v2'
// tslint:disable
import _ from 'lodash'

@Component({
  selector: 'ws-widget-attendance-card',
  templateUrl: './attendance-card.component.html',
  styleUrls: ['./attendance-card.component.scss']
})
export class AttendanceCardComponent implements OnInit {

  @Input() session: NsContent.IContent | null = null
  @Input() status = 0
  @Input() config:any = null
  @Input() showInfo: boolean = true

  constructor(
    // private route: ActivatedRoute,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    // this.route.data.subscribe(data => {
    //   this.pageConfig = data.pageData.data
    //   console.log(this.pageConfig)
    // })
  }

  openHelp(content?: any): void {
      const dialogRef = this.dialog.open(AttendanceHelperComponent, {
        // height: '400px',
        // width: '770px',
        maxWidth: '1250px',
        data: { content, helperConfig: _.get(this.config, 'attendenceHelp')},
      })
      // dialogRef.componentInstance.xyz = this.configSvc
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          console.log(result)
        }
      })
  }
}
