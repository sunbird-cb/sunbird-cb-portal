import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogBoxComponent } from './../dialog-box/dialog-box.component';
@Component({
  selector: 'ws-top-right-nav-bar',
  templateUrl: './top-right-nav-bar.component.html',
  styleUrls: ['./top-right-nav-bar.component.scss']
})
export class TopRightNavBarComponent implements OnInit {
  @Input() item:any;
  constructor(public dialog: MatDialog    ) { }

  ngOnInit() {
  }

  openDialog(): void { 
    let dialogRef = this.dialog.open(DialogBoxComponent, { 
      width: '1000px', 
    }); 
  
    dialogRef.afterClosed().subscribe(() => { 
    }); 
  } 
 
}
