import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogBoxComponent } from './../dialog-box/dialog-box.component';
import { TranslateService } from '@ngx-translate/core';
import { HomePageService } from '../../services/home-page.service';
import { ConfigurationsService, MultilingualTranslationsService } from '@sunbird-cb/utils/src/public-api';
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
  selectedLanguage = 'en'
  multiLang: any = []

  constructor(public dialog: MatDialog, public homePageService: HomePageService, 
    private configSvc: ConfigurationsService,
    private langtranslations: MultilingualTranslationsService, private translate: TranslateService) { 
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        let lang = JSON.stringify(localStorage.getItem('websiteLanguage'))
        lang = lang.replace(/\"/g, "")
        this.selectedLanguage = lang
        this.translate.use(lang)
      }
  }

  ngOnInit() {
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.multiLang = instanceConfig.webistelanguages
    }
    this.rightNavConfig = this.rightNavConfig.topRightNavConfig ? this.rightNavConfig.topRightNavConfig : rightNavConfig;
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

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }
  
  selectLanguage(event: any) {
    this.selectedLanguage = event
    localStorage.setItem('websiteLanguage', this.selectedLanguage)
    this.langtranslations.updatelanguageSelected(true, this.selectedLanguage, this.configSvc.unMappedUser.id)
  }
}
