import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { NSProfileDataV2 } from '../../models/profile-v2.model'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
import { DiscussService } from '../../../discuss/services/discuss.service'
// import { DOCUMENT } from '@angular/common'
// import { ProfileV2Service } from '../../services/profile-v2.servive'
/* tslint:disable */
import _ from 'lodash'
import { MatTabChangeEvent } from '@angular/material'
import { NetworkV2Service } from '../../../network-v2/services/network-v2.service'
import { NSNetworkDataV2 } from '../../../network-v2/models/network-v2.model'
import { ConfigurationsService, ValueService } from '@sunbird-cb/utils';
import { map } from 'rxjs/operators'
import moment from 'moment'

import {
  NsContent,
  WidgetContentService,
} from '@sunbird-cb/collection'
import { HomePageService } from 'src/app/services/home-page.service'
/* tslint:enable */
// import {  } from '@sunbird-cb/utils'

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 margin-top-l' },
  /* tslint:enable */
})
export class ProfileViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('stickyMenu', { static: true }) menuElement!: ElementRef
  sticky = false
  /* tslint:disable */
  Math: any
  /* tslint:enable */
  elementPosition: any
  currentFilter = 'timestamp'
  discussionList!: any
  discussProfileData!: any
  portalProfile!: NSProfileDataV2.IProfile
  userDetails: any
  location!: string | null
  tabs: any
  tabsData: NSProfileDataV2.IProfileTab[]
  currentUser: any
  connectionRequests!: NSNetworkDataV2.INetworkUser[]
  currentUsername: any
  enrolledCourse: any = []
  allCertificate: any = []
  pageData: any
  sideNavBarOpened = true
  verifiedBadge = false
  private defaultSideNavBarOpenedSubscription: any
  public screenSizeIsLtMedium = false
  isLtMedium$ = this.valueSvc.isLtMedium$
  insightsData: any
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')))
  orgId: any
  selectedTabIndex: any

  pendingRequestData: any = []
  pendingRequestSkeleton = true
  insightsDataLoading = true

  countdata = 0
  enrollInterval: any

  discussion = {
    loadSkeleton: false,
    data: undefined,
    error: false,
  }
  recentRequests = {
    data: undefined,
    error: false,
    loadSkeleton: false,
  }
  updatesPosts = {
    data: undefined,
    error: false,
    loadSkeleton: false,
  }
  certificatesData: any

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset
    if (windowScroll >= this.elementPosition) {
      this.sticky = true
    } else {
      this.sticky = false
    }
  }

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private discussService: DiscussService,
    private networkV2Service: NetworkV2Service,
    private configSvc: ConfigurationsService,
    public router: Router,
    private valueSvc: ValueService,
    private contentSvc: WidgetContentService,
    private homeSvc: HomePageService,
    private matSnackBar: MatSnackBar,

    // @Inject(DOCUMENT) private document: Document
  ) {
    this.Math = Math
    this.pageData = this.route.parent && this.route.parent.snapshot.data.pageData.data
    this.currentUser = this.configSvc && this.configSvc.userProfile
    this.tabsData = this.route.parent && this.route.parent.snapshot.data.pageData.data.tabs || []
    this.selectedTabIndex = this.route.snapshot.queryParams && this.route.snapshot.queryParams.tab || 0
    this.tabs = this.route.data.subscribe(data => {
      if (data.certificates) {
        this.certificatesData = data.certificates.data
        this.fetchCertificates(this.certificatesData)
      }
      if (data.profile.data.profileDetails.verifiedKarmayogi === true) {
        this.verifiedBadge = true
      }
      if (data.profile.data) {
        this.orgId = data.profile.data.rootOrgId
      }
      if (data.profile.data.profileDetails) {
        this.portalProfile = data.profile.data.profileDetails
      } else {
        this.portalProfile = data.profile.data
        _.set(this.portalProfile, 'personalDetails.firstname', _.get(data.profile.data, 'firstName'))
        // _.set(this.portalProfile, 'personalDetails.surname', _.get(data.profile.data, 'lastName'))
        _.set(this.portalProfile, 'personalDetails.email', _.get(data.profile.data, 'email'))
        _.set(this.portalProfile, 'personalDetails.userId', _.get(data.profile.data, 'userId'))
        _.set(this.portalProfile, 'personalDetails.userName', _.get(data.profile.data, 'userName'))
      }

      const user = this.portalProfile.userId || this.portalProfile.id || _.get(data, 'profile.data.id') || ''
      if (this.portalProfile && !(this.portalProfile.id && this.portalProfile.userId)) {
        this.portalProfile.id = user
        this.portalProfile.userId = user
      }

      /** // for loged in user only */
      if (user === this.currentUser.userId) {
        this.currentUsername = this.configSvc.userProfile && this.configSvc.userProfile.userName
      } else {
        this.currentUsername = this.portalProfile.personalDetails && this.portalProfile.personalDetails !== null
          ? this.portalProfile.personalDetails.userName
          : this.portalProfile.userName
      }

      if (!this.portalProfile.personalDetails && user === this.currentUser.userId) {
        _.set(this.portalProfile, 'personalDetails.firstname', _.get(this.configSvc, 'userProfile.firstName'))
        // _.set(this.portalProfile, 'personalDetails.surname', _.get(this.configSvc, 'userProfile.lastName'))
      }
      /** // for loged in user only */
      this.decideAPICall()
      this.getInsightsData()
    })
    // this.fetchDiscussionsData()
    this.fetchRecentRequests()
    this.contentSvc.getKarmaPoitns(3, moment(new Date()).valueOf()).subscribe((res: any) => {
      if (res && res.kpList) {
        this.portalProfile.karmapoints = res.kpList
      }
    })
  }

  ngOnInit() {
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.sideNavBarOpened = !isLtMedium
    })
    this.getPendingRequestData()
    this.enrollInterval = setInterval(() => {
      this.getKarmaCount()
    },                                1000)
  }

  ngAfterViewInit() {
    if (this.menuElement) {
      this.elementPosition = this.menuElement.nativeElement.parentElement.offsetTop
    }

    this.route.fragment.subscribe(data => {
      if (data) {
        const el = document.getElementById(data)
        if (el != null) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
        }
      }
    })
  }

  getKarmaCount() {
    let enrollList: any
    if (localStorage.getItem('enrollmentData')) {
      enrollList = JSON.parse(localStorage.getItem('enrollmentData') || '')
      this.countdata = enrollList && enrollList.userCourseEnrolmentInfo &&
       enrollList.userCourseEnrolmentInfo.karmaPoints || 0
      clearInterval(this.enrollInterval)
    }
  }

  decideAPICall() {
    const user = this.portalProfile.userId || this.portalProfile.id || ''
    if (this.portalProfile && user) {
      this.fetchUserDetails(this.currentUsername)
      this.fetchConnectionDetails(user)
    } else {

      if (this.configSvc.userProfile) {
        const me = this.configSvc.userProfile.userName || ''
        if (me) {
          this.fetchUserDetails(me)
          this.fetchConnectionDetails(this.configSvc.userProfile.userId)
        }
      }

    }
  }

  fetchDiscussionsData(): void {
    this.discussion.loadSkeleton = true
    this.homeSvc.getDiscussionsData(this.currentUser.userName).subscribe(
      (res: any) => {
        this.discussion.loadSkeleton = false
        this.updatesPosts.loadSkeleton = false
        this.discussion.data = res && res.latestPosts
        this.updatesPosts.data = res && res.latestPosts && res.latestPosts.sort((x: any, y: any) => {
          return y.timestamp - x.timestamp
        })
      },
      (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.discussion.loadSkeleton = false
          this.updatesPosts.loadSkeleton = false
          this.discussion.error = true
          this.updatesPosts.error = true
        }
      }
    )
  }

  fetchRecentRequests(): void {
    this.recentRequests.loadSkeleton = true
    this.homeSvc.getRecentRequests().subscribe(
      (res: any) => {
        this.recentRequests.loadSkeleton = false
        this.recentRequests.data = res.result.data && res.result.data.map((elem: any) => {
          elem.fullName = elem.fullName.charAt(0).toUpperCase() + elem.fullName.slice(1)
          elem.connecting = false
          return elem
        })
      },
      (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.recentRequests.loadSkeleton = false
        }
      }
    )
  }

  handleUpdateRequest(event: any): void {
    this.homeSvc.updateConnection(event.payload).subscribe(
      (_res: any) => {
        if (event.action === 'Approved') {
          this.matSnackBar.open('Request accepted successfully')
        } else {
          this.matSnackBar.open('Rejected the request')
        }
        event.reqObject.connecting = false
        this.fetchRecentRequests()
      },
      (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.matSnackBar.open('Unable to update connection, due to some error!')
        }
        event.reqObject.connecting = false
      }
    )
  }

  fetchUserDetails(name: string) {
    if (name) {
      this.discussService.fetchProfileInfo(name).subscribe((response: any) => {
        if (response) {
          this.discussProfileData = response
          this.discussionList = _.uniqBy(_.filter(this.discussProfileData.posts, p => _.get(p, 'isMainPost') === true), 'tid') || []
        }
      })
    }
  }

  fetchConnectionDetails(wid: string) {
    this.networkV2Service.fetchAllConnectionEstablishedById(wid).subscribe(
      (data: any) => {
        this.connectionRequests = data.result.data
      },
      (_err: any) => {
        // this.openSnackbar(err.error.message.split('|')[1] || this.defaultError)
      })
  }

  filter(key: string | 'timestamp' | 'best' | 'saved') {
    if (key) {
      this.currentFilter = key
      switch (key) {
        case 'timestamp':
          // this.discussionList = _.uniqBy(_.filter(this.discussProfileData.posts, p => _.get(p, 'isMainPost') === true), 'tid')
          this.discussionList = this.discussProfileData.posts.filter((p: any) => (p.isMainPost === true))
          break

        case 'best':
          // this.discussionList = _.uniqBy(this.discussProfileData.bestPosts, 'tid')
          this.discussionList = this.discussProfileData.bestPosts
          break

        case 'saved':
          this.discussService.fetchSaved(this.currentUsername).subscribe((response: any) => {
            if (response) {
              // this.discussionList = _.uniqBy(response.posts, 'tid')
              this.discussionList = response['posts']
            } else {
              this.discussionList = []
            }
          },
            // tslint:disable-next-line
            () => {
              this.discussionList = []
            })
          break

        default:
          // this.discussionList = _.uniqBy(this.discussProfileData.latestPosts, 'tid')
          this.discussionList = this.discussProfileData.latestPosts
          break
      }
    }
  }

  fetchCertificates(data: any) {
    const courses: NsContent.ICourse[] = data && data.courses
    courses.forEach((items: any) => {
      if (items.issuedCertificates && items.issuedCertificates.length > 0) {
        this.enrolledCourse.push(items)
        return items
      }
      if (items.issuedCertificates && items.issuedCertificates.length === 0 && items.completionPercentage === 100) {
        this.enrolledCourse.push(items)
        return items
      }
    })
    this.downloadAllCertificate(this.enrolledCourse)
  }

  downloadAllCertificate(data: any) {
    data.forEach((item: any) => {
      if (item.issuedCertificates.length !== 0) {
        const certId = item.issuedCertificates[0].identifier
        this.contentSvc.downloadCert(certId).subscribe(response => {

          this.allCertificate.push({ identifier:
            item.issuedCertificates[0].identifier, dataUrl: response.result.printUri })
        })
      }
    })
  }

  public tabClicked(_tabEvent: MatTabChangeEvent) {}

  getInsightsData() {
    this.insightsDataLoading = true
    const request = {
      request: {
          filters: {
              primaryCategory: 'programs',
              organisations: [
                  'across',
                  this.orgId,
              ],
          },
      },
    }
    this.homeSvc.getInsightsData(request).subscribe((res: any) => {
      if (res.result.response) {
        this.insightsData = res.result.response
        this.constructNudgeData()
        if (this.insightsData && this.insightsData['weekly-claps']) {
          this.insightsData['weeklyClaps'] = this.insightsData['weekly-claps']
        }
      }
      this.insightsDataLoading = false
   },                                               (_error: any) => {
      this.insightsDataLoading = false
   })
  }
  constructNudgeData() {
    this.insightsDataLoading = true
    const nudgeData: any = {
      type: 'data',
      iconsDisplay: false,
      cardClass: 'slider-container',
      height: 'auto',
      width: '',
      sliderData: [],
      negativeDisplay: false,
      'dot-default': 'dot-grey',
      'dot-active': 'dot-active',
    }
    const sliderData: { title: any; icon: string; data: string; colorData: string; }[] = []
    this.insightsData.nudges.forEach((ele: any) => {
      if (ele) {
        const data = {
          title: ele.label,
          icon: ele.growth === 'positive' ?  'arrow_upward' : 'arrow_downward',
          data: ele.growth === 'positive' && ele.progress > 1 ? `+${Math.round(ele.progress)}%` : '',
          colorData: ele.growth === 'positive' ? 'color-green' : 'color-red',
        }
        sliderData.push(data)
      }
    })
    nudgeData.sliderData = sliderData
    this.insightsData['sliderData'] = nudgeData
    this.insightsDataLoading = false
  }

  getPendingRequestData() {
    this.homeSvc.getRecentRequests().subscribe(
      (res: any) => {
        this.pendingRequestSkeleton = false
        this.pendingRequestData = res.result.data && res.result.data.map((elem: any) => {
          elem.fullName = elem.fullName.charAt(0).toUpperCase() + elem.fullName.slice(1)
          return elem
        })
      },
      (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.pendingRequestSkeleton = false
        }
      }
    )
  }

  ngOnDestroy() {
    if (this.tabs) {
      this.tabs.unsubscribe()
    }

    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
  }
}
