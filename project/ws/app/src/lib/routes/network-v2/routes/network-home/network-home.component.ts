import { Component, Inject, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NSNetworkDataV2 } from '../../models/network-v2.model'
import { NetworkV2Service } from '../../services/network-v2.service'
import { NsUser, ConfigurationsService } from '@sunbird-cb/utils'
import { CardNetWorkService } from '@sunbird-cb/collection'
import { TranslateService } from '@ngx-translate/core'
import { DOCUMENT } from '@angular/common'
@Component({
  selector: 'ws-app-network-home',
  templateUrl: './network-home.component.html',
  styleUrls: ['./network-home.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 mt-6 network_right' },
  /* tslint:enable */
})
export class NetworkHomeComponent implements OnInit {
  tabsData: NSNetworkDataV2.IProfileTab[]
  recommendedUsers: any = []
  connectionRequests!: any
  connectionRequestsSent!: any
  enableFeature = true
  nameFilter = ''
  searchSpinner = false
  searchResultUserArray: any = []
  establishedConnections!: NSNetworkDataV2.INetworkUser[]
  me!: NsUser.IUserProfile
  currentUserDept: any
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private networkV2Service: NetworkV2Service,
    private cardNetworkService: CardNetWorkService,
    private activeRoute: ActivatedRoute,
    private configSvc: ConfigurationsService,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {

    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }

    this.currentUserDept = this.configSvc.userProfile && this.configSvc.userProfile.rootOrgName
    this.tabsData = this.route.parent && this.route.parent.snapshot.data.pageData.data.tabs || []
    if (this.activeRoute.parent) {
      this.me = this.activeRoute.parent.snapshot.data.me
    }
    if (this.route.snapshot.data.recommendedUsers && this.route.snapshot.data.recommendedUsers.data.result) {
      this.recommendedUsers = this.route.snapshot.data.recommendedUsers.data.result.data.
      find((item: any) => item.field === 'employmentDetails.departmentName').results
      this.recommendedUsers.sort((a: any, b: any) => {
        return this.getName(a.personalDetails).toLowerCase().localeCompare(this.getName(b.personalDetails).toLowerCase())
      })
    }
    if (this.route.snapshot.data.myConnectionList
      && this.route.snapshot.data.myConnectionList.data
      && this.route.snapshot.data.myConnectionList.data.result
      && this.route.snapshot.data.myConnectionList.data.result.data) {
        this.establishedConnections = this.route.snapshot.data.myConnectionList.data.result.data.map((v: NSNetworkDataV2.INetworkUser) => {
          if (v && v.personalDetails && v.personalDetails.firstname) {
            v.personalDetails.firstname = v.personalDetails.firstname.toLowerCase()
          }
          return v
        })
      }
      if (this.route.snapshot.data.connectionRequests
        && this.route.snapshot.data.connectionRequests.data
        && this.route.snapshot.data.connectionRequests.data.result
        && this.route.snapshot.data.connectionRequests.data.result.data) {
          this.connectionRequests = this.route.snapshot.data.connectionRequests.data.result.data
        }
    this.getAllConnectionRequests()
  }

  getName(userDetails: any) {
    return userDetails.firstName ? userDetails.firstName : userDetails.firstname
  }

  ngOnInit() {
    if (this.router.url.includes('/app/network-v2/home?page=people_you_may_know')) {
      this.route.queryParams.subscribe(params => {
        const param = params['page']
        if (param === 'people_you_may_know') {
            if (this.document.getElementById('people_you_may_know')) {
              if (navigator.userAgent.search('Firefox') < 0) {
                const element =  this.document.getElementById('people_you_may_know')
                if (element !== null) {
                  element.scrollIntoView()
                }
              } else {
                setTimeout(() => {
                  const element =  this.document.getElementById('people_you_may_know')
                  if (element !== null) {
                    element.scrollIntoView()
                  }
                },         500)
              }

            }

        }
      })
    }
    if (this.router.url.includes('/app/network-v2/home?page=people_connection_request')) {
      this.route.queryParams.subscribe(params => {
        const param = params['page']
        if (param === 'people_connection_request') {
          if (this.document.getElementById('people_connection_request')) {
            if (navigator.userAgent.search('Firefox') < 0) {
              const element =  this.document.getElementById('people_connection_request')
              if (element !== null) {
                element.scrollIntoView()
              }
            } else {
              setTimeout(() => {
                const element =  this.document.getElementById('people_connection_request')
                if (element !== null) {
                  element.scrollIntoView()
                }
              },         500)

            }

          }
        }
      })
    }
  }

  goToMyMdo() {
    this.router.navigate(['/app/network-v2/my-mdo'])
  }

  goToConnectionRequests() {
    this.router.navigate(['/app/network-v2/connection-requests'])
  }

  connectionUpdate(event: any) {
    if (event === 'connection-updated') {
      this.networkV2Service.fetchAllReceivedConnectionRequests().subscribe(
        (data: any) => {
          this.connectionRequests = data.result.data
        },
        (_err: any) => {
          // this.openSnackbar(err.error.message.split('|')[1] || this.defaultError)
        })
    }
  }

  connectionUpdateSearchCard(event: any) {
    if (event === 'connection-updated') {
      this.connectionUpdatePeopleCard(event)
      this.getAllConnectionRequests()
      this.searchUser()
    }
  }

  connectionUpdatePeopleCard(event: any) {
    if (event === 'connection-updated') {
      // let usrDept = 'igot'
      // if (this.me) {
      //   usrDept = this.me.departmentName || 'igot'
      // }
      let req: NSNetworkDataV2.IRecommendedUserReq
      req = {
        size: 50,
        offset: 0,
        search: [
          {
            field: 'employmentDetails.departmentName',
            values: [this.currentUserDept],
          },
        ],
      }
      this.networkV2Service.fetchAllRecommendedUsers(req).subscribe(
        (data: any) => {
          this.recommendedUsers = data.result.data
            .find((item: any) => item.field === 'employmentDetails.departmentName').results
          this.getAllConnectionRequests()
        },
        (_err: any) => {
          // this.openSnackbar(err.error.message.split('|')[1] || this.defaultError)
        })
    }
  }

  searchUser() {
    if (this.nameFilter.length === 0) {
      this.enableFeature = true
    } else {
      this.searchSpinner = true
      this.enableFeature = false
      this.getSearchResult()
    }
  }

  getAllConnectionRequests() {
    this.networkV2Service.fetchAllConnectionRequests().subscribe(
      (requests: any) => {
        this.connectionRequestsSent = requests.result.data

        if (this.recommendedUsers && this.recommendedUsers.length > 0) {
          // Filter all the connection requests sent
          if (this.connectionRequestsSent &&  this.connectionRequestsSent.length > 0) {
            this.connectionRequestsSent.map((user: any) => {
              const userid = user.id || user.identifier || user.wid
              if (userid) {
                this.recommendedUsers.forEach((usr: any) => {
                  if ((usr.userId || usr.wid) === userid) {
                    usr['requestSent'] = true
                  }
                })
              }
            })
          }
        }
      })
  }

  getSearchResult() {
    const val = this.nameFilter.trim()
    this.searchResultUserArray = []
    if (val.length >= 3) {
      this.searchResultUserArray = []
      if (this.searchResultUserArray && this.searchResultUserArray.length === 0) {
        this.cardNetworkService.fetchSearchUserInfo(val).subscribe(data => {
          this.searchResultUserArray = []
          this.searchResultUserArray = data.result.response.content
          // this.searchResultUserArray.forEach((usr: any) => {
            // this.networkV2Service.fetchProfile(usr.wid).subscribe((res: any) => {
              // const resdata = res.result.UserProfile[0]
              // if (usr.wid === resdata.id) {
                // const index = this.searchResultUserArray.indexOf(usr.wid)
                // console.log(index)
                // this.searchResultUserArray[index] = resdata
              // }
              if (this.searchResultUserArray && this.searchResultUserArray.length > 0) {
                // this.networkV2Service.fetchAllConnectionRequests().subscribe(
                //   requests => {
                    // Filter all the connection requests sent
                    if (this.connectionRequestsSent &&  this.connectionRequestsSent.length > 0) {
                      this.connectionRequestsSent.map((user: any) => {
                        const userid = user.id || user.identifier || user.wid
                        if (userid) {
                          this.searchResultUserArray.map((autoCompleteUser: any) => {
                            if ((autoCompleteUser.userId || autoCompleteUser.wid) === userid) {
                              autoCompleteUser['requestSent'] = true
                            }
                          })
                        }
                      })
                    }
                    // Filter all the connection requests recieved
                    if (this.connectionRequests && this.connectionRequests.length > 0) {
                      this.connectionRequests.map((con: any) => {
                        const userid = con.id || con.identifier || con.wid
                        if (userid) {
                          this.searchResultUserArray.map((autoCompleteUser: any) => {
                            if ((autoCompleteUser.userId || autoCompleteUser.wid) === userid) {
                              autoCompleteUser['requestRecieved'] = true
                            }
                          })
                        }
                      })
                    }
                    // Filter all the estalished connections
                    if (this.establishedConnections && this.establishedConnections.length > 0) {
                      this.establishedConnections.map((con: any) => {
                        const userid = con.id || con.identifier || con.wid
                        if (userid) {
                          this.searchResultUserArray.map((autoCompleteUser: any) => {
                            if ((autoCompleteUser.userId || autoCompleteUser.wid) === userid) {
                              autoCompleteUser['connectionEstablished'] = true
                            }
                          })
                        }
                      })
                    }
                    this.searchSpinner = false

                  this.searchResultUserArray = this.searchResultUserArray.filter((el: any) => {
                    if (this.me && this.me.userId) {
                      if (el.wid === this.me.userId) {
                        return false
                      }
                    }
                    return el
                  })
              } else {
                this.searchSpinner = false
              }
            // })
          // })
        })
      }
    }
  }
}
