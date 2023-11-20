import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogBoxComponent } from './../dialog-box/dialog-box.component';
const rightNavConfig = [
  {
    "id":1,
    "section":"download",
    "active": true
  },
  {
    "id":2,
    "section":"font-setting",
    "active": true
  },
  {
    "id":3,
    "section":"help",
    "active": true
  },
  {
    "id":4,
    "section":"profile",
    "active": true
  }
]
@Component({
  selector: 'ws-top-right-nav-bar',
  templateUrl: './top-right-nav-bar.component.html',
  styleUrls: ['./top-right-nav-bar.component.scss']
})
export class TopRightNavBarComponent implements OnInit {
  @Input() item:any;
  @Input() rightNavConfig:any;
  constructor(public dialog: MatDialog    ) { }

  ngOnInit() {
    this.rightNavConfig = this.rightNavConfig.topRightNavConfig ? this.rightNavConfig.topRightNavConfig : rightNavConfig;
    // console.log('rightNavConfig',this.rightNavConfig)
  }

  ngOnChanges() {

  }

  openDialog(): void { 
    let dialogRef = this.dialog.open(DialogBoxComponent, { 
      width: '1000px', 
    }); 
  
    dialogRef.afterClosed().subscribe(() => { 
    }); 
  } 
 
}
