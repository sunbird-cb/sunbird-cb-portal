
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
import { ConfigurationsService } from '@sunbird-cb/utils';
/* tslint:enable */

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
  ) {
    this.Math = Math
    this.currentUser = this.configSvc.userProfile && this.configSvc.userProfile.userId
    this.tabsData = this.route.parent && this.route.parent.snapshot.data.pageData.data.tabs || []
    this.tabs = this.route.data.subscribe(data => {
      this.portalProfile = data.profile
        && data.profile.data
        && data.profile.data.length > 0
        && data.profile.data[0]

      if (this.portalProfile.id === this.currentUser) {
        this.currentUsername = this.configSvc.userProfile && this.configSvc.userProfile.userName
      } else  {
        this.currentUsername = this.portalProfile.personalDetails.userName
      }
      this.decideAPICall()
    })
  }
  decideAPICall() {
    if (this.portalProfile && this.portalProfile.id) {
      this.fetchUserDetails(this.currentUsername)
      this.fetchConnectionDetails(this.portalProfile.id)
    } else {

      if (this.configSvc.userProfile) {
        const me = this.configSvc.userProfile.userId || ''
        if (me) {
          this.fetchUserDetails(me)
          this.fetchConnectionDetails(me)
        }
      }

    }
  }
  ngOnDestroy() {
    if (this.tabs) {
      this.tabs.unsubscribe()
    }
  }
  ngOnInit() {
    // int left blank
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

}
