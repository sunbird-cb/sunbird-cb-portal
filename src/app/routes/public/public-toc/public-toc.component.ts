import { Component, OnDestroy, OnInit, AfterViewInit, AfterViewChecked, HostListener, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core'
import { ActivatedRoute, Event, Data, Router, NavigationEnd } from '@angular/router'
import {
    NsContent,
    WidgetContentService,
    viewerRouteGenerator,
    NsPlaylist,
    NsGoal,
    RatingService,
} from '@sunbird-cb/collection'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ConfigurationsService, LoggerService, NsPage, TFetchStatus, UtilityService } from '@sunbird-cb/utils-v2'
import { Subscription, Observable } from 'rxjs'
import { share } from 'rxjs/operators'
import { SafeHtml, DomSanitizer, SafeStyle } from '@angular/platform-browser'
import { AccessControlService } from '@ws/author/src/public-api'
// import { FormControl, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material'
import { MobileAppsService } from 'src/app/services/mobile-apps.service'
import dayjs from 'dayjs'
// tslint:disable-next-line
import _ from 'lodash'
import { ContentRatingV2DialogComponent } from '@sunbird-cb/collection/src/lib/_common/content-rating-v2-dialog/content-rating-v2-dialog.component'
import moment from 'moment'
import { NsAppToc } from '@ws/app/src/lib/routes/app-toc/models/app-toc.model'
import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'
import { ActionService } from '@ws/app/src/lib/routes/app-toc/services/action.service'

export enum ErrorType {
    internalServer = 'internalServer',
    serviceUnavailable = 'serviceUnavailable',
    somethingWrong = 'somethingWrong',
}
const flattenItems = (items: any[], key: string | number) => {
    return items.reduce((flattenedItems, item) => {
        flattenedItems.push(item)
        if (Array.isArray(item[key])) {
            // tslint:disable-next-line
            flattenedItems = flattenedItems.concat(flattenItems(item[key], key))
        }
        return flattenedItems
        // tslint:disable-next-line
    }, [])
}
@Component({
    selector: 'ws-app-public-toc',
    templateUrl: './public-toc.component.html',
    styleUrls: ['./public-toc.component.scss'],
    // tslint:disable-next-line: use-component-view-encapsulation
    encapsulation: ViewEncapsulation.None,
})
export class PublicTocComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {
    banners: NsAppToc.ITocBanner | null = null
    showMoreGlance = false
    content: NsContent.IContent | null = null
    errorCode: NsAppToc.EWsTocErrorCode | null = null
    resumeData: any = null
    batchData: NsContent.IBatchListResponse | null = null
    currentCourseBatchId: string | null = null
    userEnrollmentList = null
    routeSubscription: Subscription | null = null
    pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar
    isCohortsRestricted = false
    sticky = false
    isInIframe = false
    forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
    //   analytics = this.route.snapshot.data.pageData.data.analytics
    errorWidgetData: NsWidgetResolver.IRenderConfigWithTypedData<any> = {
        widgetType: 'errorResolver',
        widgetSubType: 'errorResolver',
        widgetData: {
            errorType: 'internalServer',
        },
    }
    isAuthor = false
    authorBtnWidget: NsPage.INavLink = {
        actionBtnId: 'feature_authoring',
        config: {
            type: 'mat-button',
        },
    }
    tocConfig: any = null
    primaryCategory = NsContent.EPrimaryCategory
    askAuthorEnabled = true
    trainingLHubEnabled = false
    trainingLHubCount$?: Observable<number>
    body: SafeHtml | null = null
    viewMoreRelatedTopics = false
    hasTocStructure = false
    tocStructure: NsAppToc.ITocStructure | null = null
    contentParents: { [key: string]: NsAppToc.IContentParentResponse[] } = {}
    objKeys = Object.keys
    fragment!: string
    activeFragment = this.route.fragment.pipe(share())
    currentFragment = 'overview'
    showScroll!: boolean
    showScrollHeight = 300
    hideScrollHeight = 10
    elementPosition: any
    batchSubscription: Subscription | null = null
    @ViewChild('stickyMenu', { static: true }) menuElement!: ElementRef
    contentProgress = 0
    bannerUrl: SafeStyle | null = null
    routePath = 'overview'
    validPaths = new Set(['overview', 'contents', 'analytics'])
    routerParamSubscription: Subscription | null = null
    initialrouteData: any
    actionBtnStatus = 'wait'
    isRegistrationSupported = false
    showIntranetMessage = false
    firstResourceLink: { url: string; queryParams: { [key: string]: any } } | null = null
    resumeDataLink: { url: string; queryParams: { [key: string]: any } } | null = null
    showTakeAssessment: NsAppToc.IPostAssessment | null = null
    checkRegistrationSources: Set<string> = new Set([
        'SkillSoft Digitalization',
        'SkillSoft Leadership',
        'Pluralsight',
    ])
    btnPlaylistConfig: NsPlaylist.IBtnPlaylist | null = null
    btnGoalsConfig: NsGoal.IBtnGoal | null = null
    externalContentFetchStatus: TFetchStatus = 'done'
    registerForExternal = false
    isGoalsEnabled = false
    contextId?: string
    contextPath?: string
    defaultSLogo = ''
    disableEnrollBtn = false
    isAssessVisible = false
    isPracticeVisible = false
    certificateOpen = false
    breadcrumbs: any
    //   historyData: any
    courseCompleteState = 2
    certData: any
    userId: any
    userRating: any
    @HostListener('window:scroll', ['$event'])
    handleScroll() {
        const windowScroll = window.pageYOffset
        if (windowScroll >= this.elementPosition - 100) {
            this.sticky = true
        } else {
            this.sticky = false
        }
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private contentSvc: WidgetContentService,
        private tocSvc: AppTocService,
        private loggerSvc: LoggerService,
        private configSvc: ConfigurationsService,
        private domSanitizer: DomSanitizer,
        private authAccessControlSvc: AccessControlService,
        // private snackBar: MatSnackBar,
        private dialog: MatDialog,
        private mobileAppsSvc: MobileAppsService,
        private utilitySvc: UtilityService,
        // private progressSvc: ContentProgressService,
        private actionSVC: ActionService,
        private ratingSvc: RatingService,
    ) {
        // this.historyData = history.state
        this.handleBreadcrumbs()
    }

    ngOnInit() {
        // this.route.fragment.subscribe(fragment => { this.fragment = fragment })
        try {
            this.isInIframe = window.self !== window.top
        } catch (_ex) {
            this.isInIframe = false
        }
        if (this.route) {
            this.routeSubscription = this.route.data.subscribe((data: Data) => {
                this.initialrouteData = data
                this.banners = data.pageData.data.banners
                this.tocSvc.subtitleOnBanners = data.pageData.data.subtitleOnBanners || false
                this.tocSvc.showDescription = data.pageData.data.showDescription || false
                this.tocConfig = data.pageData.data
                this.initData(data)
            })
            this.route.data.subscribe(data => {
                this.tocConfig = data.pageData.data
                if (this.content && this.isPostAssessment) {
                    this.tocSvc.fetchPostAssessmentStatus(this.content.identifier).subscribe(res => {
                        const assessmentData = res.result
                        for (const o of assessmentData) {
                            if (o.contentId === (this.content && this.content.identifier)) {
                                this.showTakeAssessment = o
                                break
                            }
                        }
                    })
                }
            })
        }
        this.currentFragment = 'overview'
        this.route.fragment.subscribe((fragment: string) => {
            this.currentFragment = fragment || 'overview'
        })
        this.batchSubscription = this.tocSvc.batchReplaySubject.subscribe(
            () => {
                // this.fetchBatchDetails()
            },
            () => {
                // tslint:disable-next-line: no-console
                console.log('error on batchSubscription')
            },
        )
        const instanceConfig = this.configSvc.instanceConfig
        if (instanceConfig && instanceConfig.logos && instanceConfig.logos.defaultSourceLogo) {
            this.defaultSLogo = instanceConfig.logos.defaultSourceLogo
        }

        if (this.configSvc.restrictedFeatures) {
            this.isGoalsEnabled = !this.configSvc.restrictedFeatures.has('goals')
        }
        this.routeSubscription = this.route.queryParamMap.subscribe(qParamsMap => {
            const contextId = qParamsMap.get('contextId')
            const contextPath = qParamsMap.get('contextPath')
            if (contextId && contextPath) {
                this.contextId = contextId
                this.contextPath = contextPath
            }
        })
        if (this.configSvc.restrictedFeatures) {
            this.isRegistrationSupported = this.configSvc.restrictedFeatures.has('registrationExternal')
            this.showIntranetMessage = !this.configSvc.restrictedFeatures.has(
                'showIntranetMessageDesktop',
            )
        }
        // this.checkRegistrationStatus()
        this.routerParamSubscription = this.router.events.subscribe((routerEvent: Event) => {
            if (routerEvent instanceof NavigationEnd) {
                this.assignPathAndUpdateBanner(routerEvent.url)
            }
        })

        if (this.content) {
            this.btnPlaylistConfig = {
                contentId: this.content.identifier,
                contentName: this.content.name,
                contentType: this.content.contentType,
                primaryCategory: this.content.primaryCategory,
                mode: 'dialog',
            }
            this.btnGoalsConfig = {
                contentId: this.content.identifier,
                contentName: this.content.name,
                contentType: this.content.contentType,
                primaryCategory: this.content.primaryCategory,
            }
        }
    }

    ngAfterViewInit() {
        // this.elementPosition = this.menuElement.nativeElement.parentElement.offsetTop
    }

    handleBreadcrumbs() {
        this.breadcrumbs = {
            url: 'home', titles:
                [{ title: 'Learn', url: '/page/learn', icon: 'school' },
                { title: 'Details', url: 'none' }],
        }

    }
    ngOnDestroy() {
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe()
        }
        if (this.batchSubscription) {
            this.batchSubscription.unsubscribe()
        }
        this.tocSvc.analyticsFetchStatus = 'none'
        if (this.routerParamSubscription) {
            this.routerParamSubscription.unsubscribe()
        }
    }

    ngAfterViewChecked(): void {
        try {
            if (this.fragment) {
                // tslint:disable-next-line: no-non-null-assertion
                document!.querySelector(`#${this.fragment}`)!.scrollTo({
                    top: 80,
                    behavior: 'smooth',
                })
            }
        } catch (e) { }
    }

    get enableAnalytics(): boolean {
        if (this.configSvc.restrictedFeatures) {
            return !this.configSvc.restrictedFeatures.has('tocAnalytics')
        }
        return false
    }

    get isResource() {
        if (this.content) {
            const isResource = this.content.primaryCategory === NsContent.EPrimaryCategory.KNOWLEDGE_ARTIFACT ||
                this.content.primaryCategory === NsContent.EPrimaryCategory.RESOURCE
                || this.content.primaryCategory === NsContent.EPrimaryCategory.PRACTICE_RESOURCE
                || this.content.primaryCategory === NsContent.EPrimaryCategory.OFFLINE_SESSION
                || !(this.content.children && this.content.children.length)
            if (isResource) {
                this.mobileAppsSvc.sendViewerData(this.content)
            }
            return isResource
        }
        return false
    }
    get getStartDate() {
        if (this.content) {
            const batch = _.first(_.filter(this.content['batches'], { batchId: this.currentCourseBatchId }) || [])
            if (_.get(batch, 'startDate') && moment(_.get(batch, 'startDate')).isAfter()) {
                return moment(_.get(batch, 'startDate')).fromNow()
            }
            if (_.get(batch, 'endDate') && moment(_.get(batch, 'endDate')).isBefore()) {
                return 'NA'
            }
            return 'NA'
        } return 'NA'
    }

    private initData(data: Data) {
        const initData = this.tocSvc.initData(data, true)
        this.content = initData.content
        this.errorCode = initData.errorCode
        switch (this.errorCode) {
            case NsAppToc.EWsTocErrorCode.API_FAILURE: {
                this.errorWidgetData.widgetData.errorType = ErrorType.internalServer
                break
            }
            case NsAppToc.EWsTocErrorCode.INVALID_DATA: {
                this.errorWidgetData.widgetData.errorType = ErrorType.internalServer
                break
            }
            case NsAppToc.EWsTocErrorCode.NO_DATA: {
                this.errorWidgetData.widgetData.errorType = ErrorType.internalServer
                break
            }
            default: {
                this.errorWidgetData.widgetData.errorType = ErrorType.somethingWrong
                break
            }
        }
        // not public
        // this.getUserRating()
        // this.getUserEnrollmentList()
        this.body = this.domSanitizer.bypassSecurityTrustHtml(
            this.content && this.content.body
                ? this.forPreview
                    ? this.authAccessControlSvc.proxyToAuthoringUrl(this.content.body)
                    : this.content.body
                : '',
        )
        this.contentParents = {}
        this.tocStructure = {
            assessment: 0,
            finalTest: 0,
            course: 0,
            handsOn: 0,
            interactiveVideo: 0,
            learningModule: 0,
            other: 0,
            pdf: 0,
            survey: 0,
            podcast: 0,
            practiceTest: 0,
            quiz: 0,
            video: 0,
            webModule: 0,
            webPage: 0,
            youtube: 0,
            interactivecontent: 0,
            offlineSession: 0,
        }
        if (this.content) {
            this.hasTocStructure = false
            this.tocStructure.learningModule = this.content.primaryCategory === this.primaryCategory.MODULE ? -1 : 0
            this.tocStructure.course = this.content.primaryCategory === this.primaryCategory.COURSE ? -1 : 0
            this.tocStructure = this.tocSvc.getTocStructure(this.content, this.tocStructure)
            for (const progType in this.tocStructure) {
                if (this.tocStructure[progType] > 0) {
                    this.hasTocStructure = true
                    break
                }
            }

            // from ngOnChanges
            this.fetchExternalContentAccess()
            this.modifySensibleContentRating()
            this.assignPathAndUpdateBanner(this.router.url)
            this.getLearningUrls()
        }

        this.actionSVC.getUpdateCompGroupO.subscribe((res: any) => {
            this.resumeDataLink = res
        })

        if (this.content && this.isPostAssessment) {
            this.tocSvc.fetchPostAssessmentStatus(this.content.identifier).subscribe(res => {
                const assessmentData = res.result
                for (const o of assessmentData) {
                    if (o.contentId === (this.content && this.content.identifier)) {
                        this.showTakeAssessment = o
                        break
                    }
                }
            })
        }
    }

    getUserRating() {
        if (this.configSvc.userProfile) {
            this.userId = this.configSvc.userProfile.userId || ''
        }
        if (this.content && this.content.identifier && this.content.primaryCategory) {
            this.ratingSvc.getRating(this.content.identifier, this.content.primaryCategory, this.userId).subscribe(
                (res: any) => {
                    if (res && res.result && res.result.response) {
                        this.userRating = res.result.response
                        this.tocSvc.changeUpdateReviews(true)
                    }
                },
                (err: any) => {
                    this.loggerSvc.error('USER RATING FETCH ERROR >', err)
                }
            )
        }
    }
    public getBatchId(): string {
        let batchId = ''
        if (this.batchData && this.batchData.content) {
            for (const batch of this.batchData.content) {
                batchId = batch.batchId
            }
        }
        return batchId
    }

    scrollToTop() {
        (function smoothscroll() {
            const currentScroll = document.documentElement.scrollTop || document.body.scrollTop
            if (currentScroll > 0) {
                // window.requestAnimationFrame(smoothscroll)
                // window.scrollTo(0, currentScroll - (currentScroll / 5))
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                })
            }
        })()
    }

    public getCompetencies(competencies: any) {
        const competenciesArray = JSON.parse(competencies)
        const competencyStringArray: any[] = []
        competenciesArray.map((c: any) => {
            // if (i < (competenciesArray.length -1)) {
            //   competencyString.push(`${c.name}, `)
            // } else {
            //   competencyString.push(c.name)
            // }
            competencyStringArray.push(c.name)
        })
        return competencyStringArray
    }

    get showIntranetMsg() {
        if (this.isMobile) {
            return true
        }
        return this.showIntranetMessage
    }

    get showStart() {
        return this.tocSvc.showStartButton(this.content)
    }

    get isPostAssessment(): boolean {
        if (!(this.tocConfig && this.tocConfig.postAssessment)) {
            return false
        }
        if (this.content) {
            return (
                this.content.primaryCategory === NsContent.EPrimaryCategory.COURSE &&
                this.content.learningMode === 'Instructor-Led'
            )
        }
        return false
    }

    get isMobile(): boolean {
        return this.utilitySvc.isMobile
    }

    get showSubtitleOnBanner() {
        return this.tocSvc.subtitleOnBanners
    }

    public handleEnrollmentEndDate(batch: any) {
        const enrollmentEndDate = dayjs(_.get(batch, 'enrollmentEndDate')).format('YYYY-MM-DD')
        const systemDate = dayjs()
        return enrollmentEndDate ? dayjs(enrollmentEndDate).isBefore(systemDate) : false
    }

    //   private openSnackbar(primaryMsg: string, duration: number = 5000) {
    //     this.snackBar.open(primaryMsg, 'X', {
    //       duration,
    //     })
    //   }

    get showInstructorLedMsg() {
        return (
            this.showActionButtons &&
            this.content &&
            this.content.learningMode === 'Instructor-Led' &&
            !this.content.children.length &&
            !this.content.artifactUrl
        )
    }

    get isHeaderHidden() {
        return this.isResource && this.content && !this.content.artifactUrl.length
    }

    // get showStart() {
    //   return this.content && this.content.resourceType !== 'Certification'
    // }

    get showActionButtons() {
        return (
            this.actionBtnStatus !== 'wait' &&
            this.content &&
            this.content.status !== 'Deleted' &&
            this.content.status !== 'Expired'
        )
    }

    get showButtonContainer() {
        return (
            this.actionBtnStatus === 'grant' &&
            !(this.isMobile && this.content && this.content.isInIntranet) &&
            !(
                this.content &&
                this.content.contentType === 'Course' &&
                this.content.children.length === 0 &&
                !this.content.artifactUrl
            ) &&
            !(this.content && this.content.contentType === 'Resource' && !this.content.artifactUrl)
        )
    }
    // private getResumeDataFromList() {
    //   const lastItem = this.resumeData && this.resumeData.pop()
    //   return {
    //     identifier: lastItem.contentId,
    //     mimeType: lastItem.progressdetails && lastItem.progressdetails.mimeType,
    //   }
    // }
    private modifySensibleContentRating() {
        if (
            this.content &&
            this.content.averageRating &&
            typeof this.content.averageRating !== 'number'
        ) {
            this.content.averageRating = (this.content.averageRating as any)[this.configSvc.rootOrg || '']
        }
        if (this.content && this.content.totalRating && typeof this.content.totalRating !== 'number') {
            this.content.totalRating = (this.content.totalRating as any)[this.configSvc.rootOrg || '']
        }
    }
    private getLearningUrls() {
        if (this.content) {
            if (!this.forPreview) {
                // this.progressSvc.getProgressFor(this.content.identifier).subscribe(data => {
                //   this.contentProgress = data
                // })
            }
            // this.progressSvc.fetchProgressHashContentsId({
            //   "contentIds": [
            //     "lex_29959473947367270000",
            //     "lex_5501638797018560000"
            //   ]
            // }
            // ).subscribe(data => {
            //   console.log("DATA: ", data)
            // })
            this.isPracticeVisible = Boolean(
                this.tocSvc.filterToc(this.content, NsContent.EFilterCategory.PRACTICE),
            )
            this.isAssessVisible = Boolean(
                this.tocSvc.filterToc(this.content, NsContent.EFilterCategory.ASSESS),
            )
            const firstPlayableContent = this.contentSvc.getFirstChildInHierarchy(this.content)
            this.firstResourceLink = viewerRouteGenerator(
                firstPlayableContent.identifier,
                firstPlayableContent.mimeType,
                this.isResource ? undefined : this.content.identifier,
                this.isResource ? undefined : this.content.contentType,
                this.forPreview,
                this.content.primaryCategory,
                this.getBatchId(),
            )
        }
    }
    private assignPathAndUpdateBanner(url: string) {
        const path = url.split('/').pop()
        if (path && this.validPaths.has(path)) {
            this.routePath = path
            this.updateBannerUrl()
        }
    }
    private updateBannerUrl() {
        if (this.banners) {
            this.bannerUrl = this.domSanitizer.bypassSecurityTrustStyle(
                `url(${this.banners[this.routePath]})`,
            )
        }
    }
    playIntroVideo() {
        // if (this.content) {
        //   this.dialog.open(AppTocDialogIntroVideoComponent, {
        //     data: this.content.introductoryVideo,
        //     height: '350px',
        //     width: '620px',
        //   })
        // }
    }
    get sanitizedIntroductoryVideoIcon() {
        if (this.content && this.content.introductoryVideoIcon) {
            return this.domSanitizer.bypassSecurityTrustStyle(`url(${this.content.introductoryVideoIcon})`)
        }
        return null
    }
    private fetchExternalContentAccess() {
        if (this.content && this.content.registrationUrl) {
            if (!this.forPreview) {
                this.externalContentFetchStatus = 'fetching'
                this.registerForExternal = false
                this.tocSvc.fetchExternalContentAccess(this.content.identifier).subscribe(
                    data => {
                        this.externalContentFetchStatus = 'done'
                        this.registerForExternal = data.hasAccess
                    },
                    _error => {
                        this.externalContentFetchStatus = 'done'
                        this.registerForExternal = false
                    },
                )
            } else {
                this.externalContentFetchStatus = 'done'
                this.registerForExternal = true
            }
        }
    }
    getRatingIcon(ratingIndex: number): 'star' | 'star_border' | 'star_half' {
        if (this.content && this.content.averageRating) {
            const avgRating = this.content.averageRating
            const ratingFloor = Math.floor(avgRating)
            if (ratingIndex <= ratingFloor) {
                return 'star'
            }
            if (ratingFloor === ratingIndex - 1 && avgRating % 1 > 0) {
                return 'star_half'
            }
        }
        return 'star_border'
    }

    generateQuery(type: 'RESUME' | 'START_OVER' | 'START'): { [key: string]: string } {
        if (this.firstResourceLink && (type === 'START' || type === 'START_OVER')) {
            let qParams: { [key: string]: string } = {
                ...this.firstResourceLink.queryParams,
                viewMode: type,
                batchId: this.getBatchId(),
            }
            if (this.contextId && this.contextPath) {
                qParams = {
                    ...qParams,
                    collectionId: this.contextId,
                    collectionType: this.contextPath,
                }
            }
            if (this.forPreview) {
                delete qParams.viewMode
            }
            return qParams
        }
        if (this.resumeDataLink && type === 'RESUME') {
            let qParams: { [key: string]: string } = {
                ...this.resumeDataLink.queryParams,
                batchId: this.getBatchId(),
                viewMode: 'RESUME',
                // courseName: this.content ? this.content.name : '',
            }
            if (this.contextId && this.contextPath) {
                qParams = {
                    ...qParams,
                    collectionId: this.contextId,
                    collectionType: this.contextPath,
                }
            }
            if (this.forPreview) {
                delete qParams.viewMode
            }
            return qParams
        }
        if (this.forPreview) {
            return {}
        }
        return {
            batchId: this.getBatchId(),
            viewMode: type,
        }
    }

    get isInIFrame(): boolean {
        try {
            return window.self !== window.top
        } catch (e) {
            return true
        }
    }

    openFeedbackDialog(content: any): void {
        const dialogRef = this.dialog.open(ContentRatingV2DialogComponent, {
            // height: '400px',
            width: '770px',
            data: { content, userId: this.userId, userRating: this.userRating },
        })
        // dialogRef.componentInstance.xyz = this.configSvc
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
                this.getUserRating()
            }
        })
    }
}
