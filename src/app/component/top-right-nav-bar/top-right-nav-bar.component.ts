import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogBoxComponent } from './../dialog-box/dialog-box.component';
import { TranslateService } from '@ngx-translate/core';
import { HomePageService } from '../../services/home-page.service';
import { ConfigurationsService } from '@sunbird-cb/utils/src/public-api';
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
  dialogRef:any;
  selectedLanguage: any
  multiLang = [
    {
      value: 'English',
      key: 'en',
    },
    {
      value: 'Hindi',
      key: 'hi',
    },
    {
      value: 'Tamil',
      key: 'ta',
    },
  ]
  constructor(public dialog: MatDialog, public homePageService: HomePageService, 
    private configSvc: ConfigurationsService, private translate: TranslateService) { 
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        let lang = JSON.stringify(localStorage.getItem('websiteLanguage'))
        lang = lang.replace(/\"/g, "")
        this.selectedLanguage = lang
        this.translate.use(lang)
        console.log(' this.selectedLanguage',  this.selectedLanguage)
      }
  }

  ngOnInit() {
    this.rightNavConfig = this.rightNavConfig.topRightNavConfig ? this.rightNavConfig.topRightNavConfig : rightNavConfig;
    // console.log('rightNavConfig',this.rightNavConfig)
    this.homePageService.closeDialogPop.subscribe((data:any)=>{
      if(data) {
        this.dialogRef.close();
      }
    })
  }

  ngOnChanges() {
  }

  openDialog(): void { 
    this.dialogRef = this.dialog.open(DialogBoxComponent, { 
      width: '1000px', 
    }); 
  
    this.dialogRef.afterClosed().subscribe(() => { 
    }); 
  } 
  
  selectLanguage(event: any) {
    this.selectedLanguage = event.target.value
    console.log('selectedLanguage', this.selectedLanguage)
    localStorage.setItem('websiteLanguage', this.selectedLanguage)
    this.configSvc.updatelanguageSelected(true)

    // this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    //   console.log('onLangChange', event);
    // });
  }
}
