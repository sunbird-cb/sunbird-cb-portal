import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { ActivatedRoute } from '@angular/router';
import { ConfigurationsService } from '@sunbird-cb/utils/src/lib/services/configurations.service';
import { IUserProfileDetailsFromRegistry } from '@ws/app/src/lib/routes/user-profile/models/user-profile.model'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import _ from 'lodash';
import { BtnSettingsService } from '@sunbird-cb/collection';
import { MobileAppsService } from '../../services/mobile-apps.service';
import { Router } from '@angular/router'
const API_END_POINTS = {
  fetchProfileById: (id: string) => `/apis/proxies/v8/api/user/v2/read/${id}`,
}
@Component({
  selector: 'ws-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  widgetData = {};
  sliderData = {};
  contentStripData:any = {};
  discussStripData = {};
  networkStripData = {};
  carrierStripData = {};
  clientList: {} | undefined
  homeConfig: any = {}; 
  isNudgeOpen = true;
  currentPosition: any;
  mobileTopHeaderVisibilityStatus: any = true;
  sectionList:any = [];
  enableLazyLoadingFlag = true;
  constructor(private activatedRoute:ActivatedRoute,  private configSvc: ConfigurationsService, public btnSettingsSvc: BtnSettingsService, 
    private http: HttpClient, public mobileAppsService: MobileAppsService, private router: Router) { }

  ngOnInit() {
    this.mobileAppsService.mobileTopHeaderVisibilityStatus.subscribe((status:any)=> {
      this.mobileTopHeaderVisibilityStatus = status; 
    })
    if(this.activatedRoute.snapshot.data.pageData) {
      this.homeConfig = this.activatedRoute.snapshot.data.pageData.data.homeConfig; 
    }
    if(this.activatedRoute.snapshot.data.pageData && this.activatedRoute.snapshot.data.pageData.data) {
      this.contentStripData = this.activatedRoute.snapshot.data.pageData.data || []
      this.contentStripData = (this.contentStripData.homeStrips || []).sort((a:any, b:any) => a.order - b.order)
      for(var i=0; i<this.contentStripData.length;i++) {
        if(this.contentStripData[i] && 
          this.contentStripData[i]['strips'] && 
          this.contentStripData[i]['strips'][0] && 
          this.contentStripData[i]['strips'][0]['active']) {
            let obj:any = {};
            obj['section'] = 'section_'+i;
            obj['isVisible'] = false;
            this.sectionList.push(obj);
        }
      }
    }

    this.clientList = this.activatedRoute.snapshot.data.pageData.data.clientList;
    this.widgetData = this.activatedRoute.snapshot.data.pageData.data.hubsData;
    this.enableLazyLoadingFlag = this.activatedRoute.snapshot.data.pageData.data.enableLazyLoading;

    this.discussStripData = {
      "strips": [
        {
          "key": "discuss",
          "logo": "forum",
          "title": "discuss",
          "stripBackground": "assets/instances/eagle/background/discuss.svg",
          "titleDescription": "Trending Discussions",
          "stripConfig": {
            "cardSubType": "cardHomeDiscuss"
          },
          "viewMoreUrl": {
            "path": "/app/discuss/home",
            "viewMoreText": "Discuss",
            "queryParams": {}
          },
          "filters": [],
          "request": {
            "api": {
              "path": "/apis/proxies/v8/discussion/recent",
              "queryParams": {}
            }
          }
        }
      ]
    };

    this.networkStripData = {
      "strips": [
        {
          "key": "network",
          "logo": "group",
          "title": "network",
          "stripBackground": "assets/instances/eagle/background/network.svg",
          "titleDescription": "Connect with people you may know",
          "stripConfig": {
            "cardSubType": "cardHomeNetwork"
          },
          "viewMoreUrl": {
            "path": "/app/network-v2",
            "viewMoreText": "Network",
            "queryParams": {}
          },
          "filters": [],
          "request": {
            "api": {
              "path": "/apis/protected/v8/connections/v2/connections/recommended/userDepartment",
              "queryParams": ""
            }
          }
        }
      ]
    };

    this.carrierStripData = {
      "widgets":
        [
          {
            "dimensions": {},
            "className": "",
            "widget": {
              "widgetType": "carrierStrip",
              "widgetSubType": "CarrierStripMultiple",
              "widgetData": {
                "strips": [
                  {
                    "key": "Career",
                    "logo": "work",
                    "title": "Careers",
                    "stripBackground": "assets/instances/eagle/background/careers.svg",
                    "titleDescription": "Latest openings",
                    "stripConfig": {
                      "cardSubType": "cardHomeCarrier"
                    },
                    "viewMoreUrl": {
                      "path": "/app/careers/home",
                      "viewMoreText": "Career",
                      "queryParams": {}
                    },
                    "filters": [],
                    "request": {
                      "api": {
                        "path": "/apis/protected/v8/discussionHub/categories/1",
                        "queryParams": {}
                      }
                    }
                  }
                ]
              }
            }
          }
        ],
    };

    this.sliderData = this.activatedRoute.snapshot.data.pageData.data.sliderData;
       this.sectionList.push({'section':'slider', 'isVisible': false});
    this.sectionList.push({'section':'discuss', 'isVisible': false});
    this.sectionList.push({'section':'network', 'isVisible': false});

    this.handleUpdateMobileNudge();
    this.handleDefaultFontSetting();
  }

  ngAfterViewInit() {
    for(let i=0; i<this.sectionList.length;i++) {
      if(this.sectionList[i]['section'] == 'section_0' || this.sectionList[i]['section'] == 'section_1') {
        this.sectionList[i]['isVisible'] = true;        
      } 
    }
  }

  handleUpdateMobileNudge() {
    if (this.configSvc.unMappedUser && this.configSvc.unMappedUser.id) {
      this.fetchProfileById(this.configSvc.unMappedUser.id).subscribe(x => {
        // console.log(x.profileDetails, "x.profileDetails====")
        // if (x.profileDetails.mandatoryFieldsExists) {
        //   this.isNudgeOpen = false
        // }
        let profilePopUp = sessionStorage.getItem('hideUpdateProfilePopUp')
        if(profilePopUp !== null){
          this.isNudgeOpen = false
        }else if(x && x.profileDetails && x.profileDetails.personalDetails){
          if (x.profileDetails.mandatoryFieldsExists || x.profileDetails.personalDetails.dob ||
            x.profileDetails.personalDetails.gender || x.profileDetails.personalDetails.category || x.profileDetails.personalDetails.pincode) {
            this.isNudgeOpen = false
          }
        }
          
        // if (x && x.profileDetails && x.profileDetails.personalDetails && x.profileDetails.personalDetails.phoneVerified) {
        //   this.isNudgeOpen = false
        // }
      })
    }
  }

  fetchProfileById(id: any): Observable<any> {
    return this.http.get<[IUserProfileDetailsFromRegistry]>(API_END_POINTS.fetchProfileById(id))
      .pipe(map((res: any) => {
        return _.get(res, 'result.response')
      }))
  }

  handleDefaultFontSetting() {
    let fontClass = localStorage.getItem('setting');
    this.btnSettingsSvc.changeFont(fontClass);
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler() {
    for(let i=0; i<this.sectionList.length;i++) {
      if(this.sectionList[i]['section'] !== 'section_0' && this.sectionList[i]['section'] !== 'section_1') {
       this.checkSectionVisibility(this.sectionList[i]['section']);
      }
    }
    
    // let scroll = e.scrollTop;
    // console.log('scroll');
    // if (scroll > this.currentPosition) {
    //   console.log("scrollDown");
    // } else {
    //   console.log("scrollUp");
    // }
    // this.currentPosition = scroll;
    // // var insightsResults = document.getElementsByClassName(
    // //   'insights-results'
    // // )[0];
    // // var childInsights = insightsResults?.scrollHeight;
    // // var windowScroll = window.scrollY;
    // // if (Math.floor(windowScroll) >= Math.floor(childInsights)) {
    // //     this.loadMore();
    // // }
  }

  checkSectionVisibility(className:string) {
    var isVisible = false;
    if(className === 'section_0' || className === 'section_1') {
      isVisible = true;
     
    } else {
      if(className !== 'section_0' && className !== 'section_1') {
      for(var i=0; i<this.sectionList.length;i++) {      
        if(this.sectionList[i]['section'] === className) {
          if(document.getElementsByClassName(this.sectionList[i]['section']) 
          && document.getElementsByClassName(this.sectionList[i]['section'])[0] 
          && !this.sectionList[i]['isVisible']) {
            var tect = document.getElementsByClassName(this.sectionList[i]['section'])[0].getBoundingClientRect()
          var eleTop = tect.top
          var eleBottom = tect.bottom
          isVisible = (eleTop >= 0 ) && (eleBottom <= window.innerHeight)
          this.sectionList[i]['isVisible'] = isVisible;
          break;
        }
          
        }
       
      }}
    }
  }
  
  
  //  loadMore(): void {
  //   this.page++;
  // }
  
  remindlater() { 
    sessionStorage.setItem('hideUpdateProfilePopUp', 'true')
    this.isNudgeOpen = false
  }
  
  fetchProfile() {
    this.router.navigate(['/app/user-profile/details']);
  }

}
