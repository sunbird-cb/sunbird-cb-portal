
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { NSProfileDataV2 } from '../../models/profile-v2.model'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { DiscussService } from '../../../discuss/services/discuss.service'
// import { ProfileV2Service } from '../../services/profile-v2.servive'
/* tslint:disable */
import _ from 'lodash'
import { NetworkV2Service } from '../../../network-v2/services/network-v2.service'
import { NSNetworkDataV2 } from '../../../network-v2/models/network-v2.model'
import { ConfigurationsService, ValueService } from '@sunbird-cb/utils';
import { map } from 'rxjs/operators'
import {
  WidgetUserService,
  NsContent,
  WidgetContentService,
} from '@sunbird-cb/collection'
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
  currentUser!: string | null
  connectionRequests!: NSNetworkDataV2.INetworkUser[]
  currentUsername: any
  enrolledCourse: any = []
  allCertificate: any = []

  sideNavBarOpened = true
  verifiedBadge = false
  private defaultSideNavBarOpenedSubscription: any
  public screenSizeIsLtMedium = false
  isLtMedium$ = this.valueSvc.isLtMedium$
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')))

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
    private userSvc: WidgetUserService,
    private contentSvc: WidgetContentService,
  ) {
    this.Math = Math
    this.currentUser = this.configSvc.userProfile && this.configSvc.userProfile.userId
    this.tabsData = this.route.parent && this.route.parent.snapshot.data.pageData.data.tabs || []
    this.tabs = this.route.data.subscribe(data => {
      if (data.profile.data.profileDetails.verifiedKarmayogi === true) {
        this.verifiedBadge = true
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
      if (user === this.currentUser) {
        this.currentUsername = this.configSvc.userProfile && this.configSvc.userProfile.userName
      } else {
        this.currentUsername = this.portalProfile.personalDetails && this.portalProfile.personalDetails !== null
          ? this.portalProfile.personalDetails.userName
          : this.portalProfile.userName
      }

      if (!this.portalProfile.personalDetails && user === this.currentUser) {
        _.set(this.portalProfile, 'personalDetails.firstname', _.get(this.configSvc, 'userProfile.firstName'))
        // _.set(this.portalProfile, 'personalDetails.surname', _.get(this.configSvc, 'userProfile.lastName'))
      }
      /** // for loged in user only */
      this.decideAPICall()
    })
    this.fetchUserBatchList()

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

  ngOnInit() {
    // int left blank

    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.sideNavBarOpened = !isLtMedium
    })
  }

  ngOnDestroy() {
    if (this.tabs) {
      this.tabs.unsubscribe()
    }

    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
  }

  ngAfterViewInit() {
    this.elementPosition = this.menuElement.nativeElement.parentElement.offsetTop
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

  fetchUserBatchList() {
    const user = this.portalProfile.userId || this.portalProfile.id || ''
    this.userSvc.fetchUserBatchList(user).subscribe((courses: NsContent.ICourse[]) => {

      courses.forEach(items => {
        if (items.completionPercentage === 100) {
          this.enrolledCourse.push(items)
          // return items;
        }
      })
      this.downloadAllCertificate(this.enrolledCourse)
    })
  }

  downloadAllCertificate(data: any) {
    data.forEach((item: any) => {
      if (item.issuedCertificates.length !== 0) {
        const certId = item.issuedCertificates[0].identifier
        this.contentSvc.downloadCert(certId).subscribe(response => {

          this.allCertificate.push({ identifier: item.issuedCertificates[0].identifier, dataUrl: response.result.printUri })

        })
      }
    })
  }
}
