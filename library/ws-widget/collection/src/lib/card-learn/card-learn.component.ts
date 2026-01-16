import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { ConfigurationsService, EventService, MultilingualTranslationsService, WsEvents } from '@sunbird-cb/utils-v2'
import { NSSearch, NsContent } from '@sunbird-cb/collection'
import { SearchApiService } from '../_services/search-api.service'
import { TranslateService } from '@ngx-translate/core'
import * as _ from 'lodash'

// import { ActivitiesService } from '@ws/app/src/lib/routes/activities/services/activities.service'
// import { IActivity, IActivityCard, IChallenges } from '@ws/app/src/lib/routes/activities/interfaces/activities.model'
// import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'ws-widget-card-learn',
  templateUrl: './card-learn.component.html',
  styleUrls: ['./card-learn.component.scss'],
})
export class CardLearnComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<any> {

  @Input() widgetData: any
  givenName: string | undefined
  userEmail: string | undefined
  // activityCards: IActivityCard[] = []
  // challenges: IChallenges[] = []
  activityCards: any[] = []
  challenges: any[] = []
  isNewUser = false
  showActivities = false
  keyTag: string[] = []
  exploreBtns = []
  showModeratedCourseTab = false

  @HostBinding('id')
  public id = 'w-card-learn'
  constructor(
    private configSvc: ConfigurationsService,
    private router: Router,
    private activateroute: ActivatedRoute,
    private searchApiService: SearchApiService,
    private langtranslations: MultilingualTranslationsService,
    private translate: TranslateService,
    private events: EventService,
    // private activitiesSvc: ActivitiesService,
    // private snackBar: MatSnackBar,
  ) {

    super()
    if (this.configSvc.userProfile) {
      this.givenName = this.configSvc.userProfile.givenName
      this.userEmail = this.configSvc.userProfile.email
    }
    this.isNewUser = this.configSvc.isNewUser
    if (this.configSvc.restrictedFeatures) {
      if (this.configSvc.restrictedFeatures.has('activities')) {
        this.showActivities = false
      } else {
        this.showActivities = true
      }
    } else {
      this.showActivities = false
    }
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })

  }
  hasRole(role: string[]): boolean {
    let returnValue = false
    role.forEach(v => {
      const rolesList = (this.configSvc.userRoles || new Set())
      if (rolesList.has(v.toLowerCase()) || rolesList.has(v.toUpperCase())) {
        returnValue = true
      }
    })
    return returnValue
  }
  ngOnInit() {
    if (
      this.activateroute.snapshot.parent
      && this.activateroute.snapshot.parent.data
      && this.activateroute.snapshot.data.pageData
      && this.activateroute.snapshot.data.pageData.data
      && this.activateroute.snapshot.data.pageData.data.ExploreButtons
    ) {
      this.exploreBtns = this.activateroute.snapshot.data.pageData.data.ExploreButtons
    }
    if (this.showActivities) {
      // this.activitiesSvc.fetchLearnActivites().then((result: IActivity) => {
      //   if (result.activities.length !== 0) {
      //     result.activities.forEach(activity => {
      //       if (activity.hasRole.length === 0 || this.hasRole(activity.hasRole)) {
      //         this.activityCards.push(activity)
      //       }
      //     })
      //     // this.activityCards = result.activities
      //     this.activityCards.forEach(activityCard => {
      //       if (!(this.keyTag.includes(activityCard.tag))) {
      //         this.keyTag.push(activityCard.tag)
      //       }
      //     })
      //     this.keyTag.forEach(tag => {
      //       const filteredActivity = this.activityCards.filter(activity => (tag === activity.tag))
      //       this.challenges.push({ tag, activities: filteredActivity })
      //     })
      //   } else {
      //     this.showActivities = false
      //   }
      // }).catch(() => {
      //   this.showActivities = false
      //   this.snackBar.open('Failed to load activities', 'X')
      // })
    }
    // if (this.configSvc && this.configSvc.unMappedUser &&
    //     this.configSvc.unMappedUser.profileDetails &&
    //     this.configSvc.unMappedUser.profileDetails.verifiedKarmayogi) {
      this.callModeratedFunc()
    // }

  }

  callModeratedFunc() {
    let orgId = ''
    if (this.configSvc && this.configSvc.userProfile && this.configSvc.userProfile.rootOrgId) {
      orgId = this.configSvc.userProfile.rootOrgId
    }
    const moderatedCoursesRequestBody: NSSearch.ISearchV6RequestV3 = {
      request: {
        query: '',
        filters: {
          courseCategory: [NsContent.ECourseCategory.MODERATED_COURSE,
            NsContent.ECourseCategory.MODERATED_PROGRAM, NsContent.ECourseCategory.MODERATED_ASSESSEMENT],
            'secureSettings.organisation': orgId,
          contentType: ['Course'],
            status: [
                'Live',
            ],
        },
        sort_by: {
            lastUpdatedOn: 'desc',
        },
        facets: [
            'mimeType',
        ],
        limit : 20,
      },
    }

    if (this.configSvc && this.configSvc.unMappedUser &&
      this.configSvc.unMappedUser.profileDetails &&
      !this.configSvc.unMappedUser.profileDetails.verifiedKarmayogi) {
      moderatedCoursesRequestBody.request.filters = {
        ...moderatedCoursesRequestBody.request.filters,
        'secureSettings.isVerifiedKarmayogi': 'No',
      }
    }
    this.searchApiService.getSearchV4Results(moderatedCoursesRequestBody).subscribe(results => {
      let contentList = []
      if (results && results.result && results.result.content && results.result.content.length) {
        // if (this.configSvc && this.configSvc.unMappedUser &&
        //        this.configSvc.unMappedUser.profileDetails &&
        //        this.configSvc.unMappedUser.profileDetails.verifiedKarmayogi) {
        //   contentList = results.result.content
        // } else {
        //   contentList = results.result.content.filter((ele: any) => {
        //     return ele.secureSettings && ele.secureSettings.isVerifiedKarmayogi === 'No'
        //   })
        // }
        contentList = results.result.content
      }
      this.showModeratedCourseTab = Boolean(contentList.length > 0)
    })
  }

  allActivities() {
    this.router.navigate(['app', 'activities'])
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }

  raiseTelemetry(name: string) {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        id: `${_.kebabCase(name).toLocaleLowerCase()}`,
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.LEARN,
      }
    )
  }

}
