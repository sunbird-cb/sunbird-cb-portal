import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { ActivatedRoute, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { MatSnackBar, MatSnackBarConfig } from '@angular/material'
/* tslint:disable */
import _ from 'lodash'
/* tslint:enable */
import { Observable, Subject } from 'rxjs'
import { map, takeUntil } from 'rxjs/operators'

import { ConfigurationsService } from '@sunbird-cb/utils/src/lib/services/configurations.service'
import { MobileAppsService } from '../../services/mobile-apps.service'
import { UserProfileService } from '@ws/app/src/lib/routes/user-profile/services/user-profile.service'
import { IUserProfileDetailsFromRegistry } from '@ws/app/src/lib/routes/user-profile/models/user-profile.model'
import { BtnSettingsService } from '@sunbird-cb/collection'

// import { NotificationComponent } from './notification/notification.component'

const API_END_POINTS = {
  fetchProfileById: (id: string) => `/apis/proxies/v8/api/user/v2/read/${id}`,
}
@Component({
  selector: 'ws-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private configSvc: ConfigurationsService,
    public btnSettingsSvc: BtnSettingsService,
    private http: HttpClient,
    public mobileAppsService: MobileAppsService,
    private router: Router,
    private translate: TranslateService,
    private userProfileService: UserProfileService,
    private matSnackBar: MatSnackBar
  ) { }
  private destroySubject$ = new Subject()
  widgetData = {}
  sliderData = {}
  contentStripData: any = {}
  discussStripData = {}
  networkStripData = {}
  carrierStripData = {}
  clientList: {} | undefined
  homeConfig: any = {}
  isNudgeOpen: any
  currentPosition: any
  mobileTopHeaderVisibilityStatus: any = true
  sectionList: any = []
  enableLazyLoadingFlag = true
  isKPPanelenabled = false
  enrollData: any
  enrollInterval: any
  jan26Change: any
  pendingApprovalList: any

  configSuccess: MatSnackBarConfig = {
    panelClass: 'style-success',
    duration: 20000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  }

  ngOnInit() {
    if (this.configSvc) {
      this.jan26Change = this.configSvc.overrideThemeChanges
    }
    this.mobileAppsService.mobileTopHeaderVisibilityStatus.subscribe((status: any) => {
      this.mobileTopHeaderVisibilityStatus = status
    })
    if (this.activatedRoute.snapshot.data.pageData) {
      this.homeConfig = this.activatedRoute.snapshot.data.pageData.data.homeConfig
    }
    if (this.activatedRoute.snapshot.data.pageData && this.activatedRoute.snapshot.data.pageData.data) {
      this.contentStripData = this.activatedRoute.snapshot.data.pageData.data || []
      // tslint:disable-next-line: prefer-template
      this.contentStripData = (this.contentStripData.homeStrips || []).sort((a: any, b: any) => a.order - b.order)
      // tslint:disable-next-line
      for (let i = 0; i < this.contentStripData.length; i++) {
        if (this.contentStripData[i] &&
          this.contentStripData[i]['strips'] &&
          this.contentStripData[i]['strips'][0] &&
          this.contentStripData[i]['strips'][0]['active']) {
            const obj: any = {}
            // tslint:disable-next-line: prefer-template
            obj['section'] = 'section_' + i
            obj['isVisible'] = false
            this.sectionList.push(obj)
        }
      }
    }

    this.clientList = this.activatedRoute.snapshot.data.pageData.data.clientList
    this.widgetData = this.activatedRoute.snapshot.data.pageData.data.hubsData
    this.enableLazyLoadingFlag = this.activatedRoute.snapshot.data.pageData.data.enableLazyLoading

    this.discussStripData = {
      strips: [
        {
          key: 'discuss',
          logo: 'forum',
          title: 'discuss',
          stripBackground: 'assets/instances/eagle/background/discuss.svg',
          titleDescription: 'Trending Discussions',
          stripConfig: {
            cardSubType: 'cardHomeDiscuss',
          },
          viewMoreUrl: {
            path: '/app/discuss/home',
            viewMoreText: 'Discuss',
            queryParams: {},
          },
          filters: [],
          request: {
            api: {
              path: '/apis/proxies/v8/discussion/recent',
              queryParams: {},
            },
          },
        },
      ],
    }

    this.networkStripData = {
      strips: [
        {
          key: 'network',
          logo: 'group',
          title: 'network',
          stripBackground: 'assets/instances/eagle/background/network.svg',
          titleDescription: 'Connect with people you may know',
          stripConfig: {
            cardSubType: 'cardHomeNetwork',
          },
          viewMoreUrl: {
            path: '/app/network-v2',
            viewMoreText: 'Network',
            queryParams: {},
          },
          filters: [],
          request: {
            api: {
              path: '/apis/protected/v8/connections/v2/connections/recommended/userDepartment',
              queryParams: '',
            },
          },
        },
      ],
    }

    this.carrierStripData = {
      widgets:
        [
          {
            dimensions: {},
            className: '',
            widget: {
              widgetType: 'carrierStrip',
              widgetSubType: 'CarrierStripMultiple',
              widgetData: {
                strips: [
                  {
                    key: 'Career',
                    logo: 'work',
                    title: 'Careers',
                    stripBackground: 'assets/instances/eagle/background/careers.svg',
                    titleDescription: 'Latest openings',
                    stripConfig: {
                      cardSubType: 'cardHomeCarrier',
                    },
                    viewMoreUrl: {
                      path: '/app/careers/home',
                      viewMoreText: 'Career',
                      queryParams: {},
                    },
                    filters: [],
                    request: {
                      api: {
                        path: '/apis/protected/v8/discussionHub/categories/1',
                        queryParams: {},
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
    }

    this.sliderData = this.activatedRoute.snapshot.data.pageData.data.sliderData
    this.sectionList.push({ section: 'slider', isVisible: false })
    this.sectionList.push({ section: 'discuss', isVisible: false })
    this.sectionList.push({ section: 'network', isVisible: false })

    this.getListPendingApproval()
    // this.handleUpdateMobileNudge()
    this.handleDefaultFontSetting()

    this.enrollInterval = setInterval(() => {
      this.getEnrollmentData()
    },                                1000)
  }

  ngAfterViewInit() {
    // tslint:disable-next-line
    for(let i = 0; i < this.sectionList.length; i++) {
      // tslint:disable-next-line
      if (this.sectionList[i]['section'] === 'section_0'
      || this.sectionList[i]['section'] === 'section_1'
      || this.sectionList[i]['section'] === 'section_2'
      || this.sectionList[i]['section'] === 'section_3'
      || this.sectionList[i]['section'] === 'section_4') {
        this.sectionList[i]['isVisible'] = true
      }
    }
  }

  getEnrollmentData() {
    this.enrollData = localStorage.getItem('userEnrollmentCount')
    if (this.enrollData) {
      this.enrollData = JSON.parse(this.enrollData)
      if (this.enrollData && this.enrollData.enrolledCourseCount) {
        this.isKPPanelenabled = false
      } else {
        this.isKPPanelenabled = true
      }
      clearInterval(this.enrollInterval)
    }
  }

  handleButtonClick(): void {
    // console.log('Working!!!')
  }

  translateHub(hubName: string): string {
    const translationKey =  hubName
    return this.translate.instant(translationKey)
  }

  getListPendingApproval(): void {
    this.userProfileService.listApprovalPendingFields()
    .pipe(takeUntil(this.destroySubject$))
    .subscribe((res: any) => {
      this.pendingApprovalList = res.result.data

      // TODO...
      // this.matSnackBar.openFromComponent(NotificationComponent, {
      //   data: { type: 'pending' },
      // ...this.configSuccess,
      // })
      if ((this.pendingApprovalList && this.pendingApprovalList.length)) {

      } else {
        this.handleUpdateMobileNudge()
      }

    },         (error: HttpErrorResponse) => {
      if (!error.ok) {
        this.matSnackBar.open('Unable to fetch pending approval list')
      }
    })
  }

  handleUpdateMobileNudge() {
    if (this.configSvc.unMappedUser && this.configSvc.unMappedUser.id) {
      this.fetchProfileById(this.configSvc.unMappedUser.id).subscribe((_obj: any) => {
        const profilePopUp = sessionStorage.getItem('hideUpdateProfilePopUp')

        if (_obj.profileDetails) {
          if (!(_obj.profileDetails.profileStatus === 'VERIFIED')
            && (profilePopUp === 'true' || profilePopUp === null)) {
            this.isNudgeOpen = true
          } else {
            this.isNudgeOpen = false
          }
        } else {
          this.isNudgeOpen = true
        }
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
    const fontClass = localStorage.getItem('setting')
    this.btnSettingsSvc.changeFont(fontClass)
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler() {
    // tslint:disable-next-line
    for(let i = 0; i < this.sectionList.length; i++) {
      // tslint:disable-next-line
      if(this.sectionList[i]['section'] !== 'section_0' &&
       this.sectionList[i]['section'] !== 'section_1' &&
       this.sectionList[i]['section'] !== 'section_2' &&
       this.sectionList[i]['section'] !== 'section_3' &&
       this.sectionList[i]['section'] !== 'section_4') {
       this.checkSectionVisibility(this.sectionList[i]['section'])
      }
    }

  }

  checkSectionVisibility(className: string) {
    let isVisible = false
    // tslint:disable-next-line
    if (className === 'section_0' ||
    className === 'section_1' ||
    className === 'section_2' ||
    className === 'section_3' ||
    className === 'section_4') {
      isVisible = true
    } else {
      if (className !== 'section_0' &&
       className !== 'section_1' &&
       className !== 'section_2' &&
       className !== 'section_3' &&
       className !== 'section_4') {
      // tslint:disable-next-line
        for(let i = 0; i < this.sectionList.length; i++) {
          if (this.sectionList[i]['section'] === className) {
            if (document.getElementsByClassName(this.sectionList[i]['section'])
            && document.getElementsByClassName(this.sectionList[i]['section'])[0]
            && !this.sectionList[i]['isVisible']) {
              const tect = document.getElementsByClassName(this.sectionList[i]['section'])[0].getBoundingClientRect()
              const eleTop = tect.top
              const eleBottom = tect.bottom
              isVisible = (eleTop >= 0) && (eleBottom <= window.innerHeight)
              this.sectionList[i]['isVisible'] = isVisible
              break
              // tslint:disable-next-line: prefer-template
            }
          }
        }
      }
    }
  }

  handleRemindLater() {
    sessionStorage.setItem('hideUpdateProfilePopUp', 'true')
    this.isNudgeOpen = false
  }

  fetchProfile() {
    this.router.navigate(['/app/person-profile/me'])
  }

  closeKarmaPointsPanel() {
    this.isKPPanelenabled = false
  }
}
