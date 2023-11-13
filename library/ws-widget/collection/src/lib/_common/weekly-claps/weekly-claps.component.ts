import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';

@Component({
  selector: 'ws-widget-weekly-claps',
  templateUrl: './weekly-claps.component.html',
  styleUrls: ['./weekly-claps.component.scss']
})
export class WeeklyClapsComponent implements OnInit {
  @Input('isLoading') isLoading: any = '';

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openInfo(myDialog: any) {
    console.log(myDialog,'hiiiiiiiiiiiiiiiismyDialog')
    const confirmDialog = this.dialog.open(InfoDialogComponent, {
        width: '613px',
        panelClass: 'custom-info-dialog',
        backdropClass: 'info-dialog-backdrop',
        data: {  template:  myDialog}
      })
      confirmDialog.afterClosed().subscribe((result: any) => {
        if (result) {
        }
      })
  }

}
