import { AfterViewChecked, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NsContent } from '@sunbird-cb/collection'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { UtilityService, ValueService, WsEvents, EventService, ConfigurationsService } from '@sunbird-cb/utils'
import { Subscription } from 'rxjs'
import { RootService } from '../../../../../src/app/component/root/root.service'
import { TStatus, ViewerDataService } from './viewer-data.service'
import { NsCohorts } from '@ws/app/src/lib/routes/app-toc/models/app-toc.model'
import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'
import { MatTabChangeEvent } from '@angular/material'
// tslint:disable-next-line
import _ from 'lodash'
import { BaseWrapperComponent, ConfigService, DiscussionService, EventsService, NavigationServiceService } from '@sunbird-cb/discussions-ui-v8'

export enum ErrorType {
  accessForbidden = 'accessForbidden',
  notFound = 'notFound',
  internalServer = 'internalServer',
  serviceUnavailable = 'serviceUnavailable',
  somethingWrong = 'somethingWrong',
  mimeTypeMismatch = 'mimeTypeMismatch',
  previewUnAuthorised = 'previewUnAuthorised',
}

@Component({
  selector: 'viewer-container',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent  extends BaseWrapperComponent implements OnInit, OnDestroy, AfterViewChecked {
  fullScreenContainer: HTMLElement | null = null
  content: NsContent.IContent | null = null
  errorType = ErrorType
  show = true
  private isLtMedium$ = this.valueSvc.isLtMedium$
  sideNavBarOpened = false
  mode: 'over' | 'side' = 'side'
  forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
  isTypeOfCollection = true
  collectionId = this.activatedRoute.snapshot.queryParamMap.get('collectionId')
  batchId = this.activatedRoute.snapshot.queryParamMap.get('batchId')
  status: TStatus = 'none'
  error: any | null = null
  isNotEmbed = true
  discussionConfig: any = {}
  detailsToggle = true
  category = 'category'
  detailsPage = 'categoryDetails'
  tagAllDiscussPage =  'tagAllDiscuss'
  homePage = 'categoryHome'
  showTrendTagPost = 0
  tid!: number
  slug!: string
  context: any = { categories: { result: [] } }
  categoryId: any
  alldiscussPage = 'alldiscuss'
  previousState: any
  cIds: any = {}
  cid: any
  errorWidgetData: NsWidgetResolver.IRenderConfigWithTypedData<any> = {
    widgetType: 'errorResolver',
    widgetSubType: 'errorResolver',
    widgetData: {
      errorType: '',
    },
  }
  cohortResults: {
    [key: string]: { hasError: boolean; contents: NsCohorts.ICohortsContent[] }
  } = {}
  cohortTypesEnum = NsCohorts.ECohortTypes
  private screenSizeSubscription: Subscription | null = null
  private resourceChangeSubscription: Subscription | null = null
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private valueSvc: ValueService,
    private dataSvc: ViewerDataService,
    private rootSvc: RootService,
    private utilitySvc: UtilityService,
    public configService: ConfigurationsService,
    private changeDetector: ChangeDetectorRef,
    private tocSharedSvc: AppTocService,
    private eventSvc: EventService,
    @Inject(ConfigService)
    configSvc: ConfigService,
    @Inject(DiscussionService)
    discussionService: DiscussionService,
    @Inject(NavigationServiceService)
    navigationServiceService: NavigationServiceService,
    @Inject(EventsService)
    eventService: EventsService) {
    super(navigationServiceService, eventService, configSvc, discussionService)

    this.rootSvc.showNavbarDisplay$.next(false)
    if (this.collectionId) {
      this.discussionConfig = {
        // menuOptions: [{ route: 'categories', enable: true }],
        userName: (this.configService.nodebbUserProfile && this.configService.nodebbUserProfile.username) || '',
      }
      this.discussionConfig.contextType = 'course'
      this.discussionConfig.contextIdArr = (this.collectionId) ? [this.collectionId] : []
      // this.discussionConfig.categoryObj = {
      //   category: {
      //     name: this.content.name,
      //     pid: '',
      //     description: this.content.description,
      //     context: [
      //       {
      //         type: 'course',
      //         identifier: this.collectionId,
      //       },
      //     ],
      //   },
      // }
      this.fetchCohorts(this.cohortTypesEnum.ACTIVE_USERS, this.collectionId)
    }
  }

  widgetBackClick() {
    this.state = this.alldiscussPage
    this.showTrendTagPost = 0
  }

  stateChange(event: any) {
    // debugger
    // console.log(event)
    this.previousState = this.state
    this.state = event.action
    if (event.action === this.detailsPage) {
      this.tid = event.tid
      this.slug = event.title
      this.showTrendTagPost = 0
      this.cid = event.cId[0]
    }

    if (event.action === this.tagAllDiscussPage) {
      this.tid = event.tid
      this.slug = event.title
      this.showTrendTagPost = 1
      this.cIds.result = event.cIds
    }
  }

  getContentData(e: any) {
    e.activatedRoute.data.subscribe((data: { content: { data: NsContent.IContent } }) => {
      if (data.content && data.content.data) {
        this.content = data.content.data
      }
    })
  }

  ngOnInit() {
    this.state = this.alldiscussPage
    this.isNotEmbed = !(
      window.location.href.includes('/embed/') ||
      this.activatedRoute.snapshot.queryParams.embed === 'true'
    )
    this.isTypeOfCollection = this.activatedRoute.snapshot.queryParams.collectionType ? true : false
    this.screenSizeSubscription = this.isLtMedium$.subscribe(isSmall => {
      // this.sideNavBarOpened = !isSmall
      this.sideNavBarOpened = isSmall ? false : false
      this.mode = isSmall ? 'over' : 'side'
    })
    this.resourceChangeSubscription = this.dataSvc.changedSubject.subscribe(_ => {
      this.status = this.dataSvc.status
      this.error = this.dataSvc.error
      if (this.error && this.error.status) {
        switch (this.error.status) {
          case 403: {
            this.errorWidgetData.widgetData.errorType = ErrorType.accessForbidden
            break
          }
          case 404: {
            this.errorWidgetData.widgetData.errorType = ErrorType.notFound
            break
          }
          case 500: {
            this.errorWidgetData.widgetData.errorType = ErrorType.internalServer
            break
          }
          case 503: {
            this.errorWidgetData.widgetData.errorType = ErrorType.serviceUnavailable
            break
          }
          default: {
            this.errorWidgetData.widgetData.errorType = ErrorType.somethingWrong
            break
          }
        }
      }
      if (this.error && this.error.errorType === this.errorType.mimeTypeMismatch) {
        setTimeout(() => {
          this.router.navigate([this.error.probableUrl])
          // tslint:disable-next-line: align
        }, 3000)
      }
      if (this.error && this.error.errorType === this.errorType.previewUnAuthorised) {
      }
      // //console.log(this.error)
    })
  }

  ngAfterViewChecked() {
    const container = document.getElementById('fullScreenContainer')
    if (container) {
      this.fullScreenContainer = container
      this.changeDetector.detectChanges()
    } else {
      this.fullScreenContainer = null
      this.changeDetector.detectChanges()
    }
  }

  ngOnDestroy() {
    this.rootSvc.showNavbarDisplay$.next(true)
    if (this.screenSizeSubscription) {
      this.screenSizeSubscription.unsubscribe()
    }
    if (this.resourceChangeSubscription) {
      this.resourceChangeSubscription.unsubscribe()
    }
  }

  toggleSideBar() {
    this.sideNavBarOpened = !this.sideNavBarOpened
  }

  minimizeBar() {
    if (this.utilitySvc.isMobile) {
      this.sideNavBarOpened = false
    }
  }

  get isPreview(): boolean {
    this.forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
    return this.forPreview
  }

  fetchCohorts(cohortType: NsCohorts.ECohortTypes, contentID: any) {
    if (!this.cohortResults[cohortType] && !this.forPreview) {
      this.tocSharedSvc.fetchContentCohorts(cohortType, contentID).subscribe(
        (data: any) => {
          this.cohortResults[cohortType] = {
            contents: _.map(data, d => {
              return {
                first_name: _.get(d, 'first_name'),
                last_name: _.get(d, 'last_name'),
                department: _.get(d, 'department'),
                designation: _.get(d, 'designation'),
                email: _.get(d, 'email'),
                desc: _.get(d, 'desc'),
                uid: _.get(d, 'user_id'),
                last_ts: _.get(d, 'last_ts'),
                phone_No: _.get(d, 'phone_No'),
                city: _.get(d, 'city'),
                userLocation: _.get(d, 'userLocation'),
              }
            }) || [],
            hasError: false,
          }
        },
        () => {
          this.cohortResults[cohortType] = {
            contents: [],
            hasError: true,
          }
        },
      )
    } else if (this.cohortResults[cohortType] && !this.forPreview) {
      return
    } else {
      this.cohortResults[cohortType] = {
        contents: [],
        hasError: false,
      }
    }
  }

  public tabClicked(tabEvent: MatTabChangeEvent) {
    // if (this.forPreview) {
    //   return
    // }
    const data: WsEvents.ITelemetryTabData = {
      label: `${tabEvent.tab.textLabel}`,
      index: tabEvent.index,
    }
    this.eventSvc.handleTabTelemetry(
      WsEvents.EnumInteractSubTypes.COURSE_TAB,
      data,
      {
        id: this.content && this.content.identifier,
        type: this.content && this.content.primaryCategory,
      }
    )
  }
}
