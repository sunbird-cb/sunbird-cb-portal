import { Component, Input, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import { DialogBoxComponent } from './../dialog-box/dialog-box.component'
import { HomePageService } from '../../services/home-page.service'
const rightNavConfig = [
  {
    id: 1,
    section: 'download',
    active: true,
  },
  {
    id: 2,
    section: 'font-setting',
    active: true,
  },
  {
    id: 3,
    section: 'help',
    active: true,
  },
  {
    id: 4,
    section: 'profile',
    active: true,
  }
]
@Component({
  selector: 'ws-top-right-nav-bar',
  templateUrl: './top-right-nav-bar.component.html',
  styleUrls: ['./top-right-nav-bar.component.scss'],
})
export class TopRightNavBarComponent implements OnInit {
  @Input() item:any
  @Input() rightNavConfig:any
  dialogRef:any;
  constructor(public dialog: MatDialog,  public homePageService: HomePageService) { }

  ngOnInit() {
    this.rightNavConfig = this.rightNavConfig.topRightNavConfig ? this.rightNavConfig.topRightNavConfig : rightNavConfig
    // console.log('rightNavConfig',this.rightNavConfig)
    this.homePageService.closeDialogPop.subscribe((data:any)=>{
      if(data) {
        this.dialogRef.close()
      }
    })
  }

  ngOnChanges() {}

  openDialog(): void { 
    this.dialogRef = this.dialog.open(DialogBoxComponent, { 
      width: '1000px', 
    })
  
    this.dialogRef.afterClosed().subscribe(() => { 
    })
  }
}
