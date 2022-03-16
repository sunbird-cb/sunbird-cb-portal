import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { ActivatedRoute, NavigationExtras } from '@angular/router'
import { ConfigurationsService, NsPage, ValueService } from '@sunbird-cb/utils'
import { Subscription } from 'rxjs'
import { ViewerDataService } from '../../viewer-data.service'

@Component({
  selector: 'viewer-viewer-top-bar',
  templateUrl: './viewer-top-bar.component.html',
  styleUrls: ['./viewer-top-bar.component.scss'],
})
export class ViewerTopBarComponent implements OnInit, OnDestroy {
  @Input() frameReference: any
  @Input() forPreview = false
  @Output() toggle = new EventEmitter()
  private viewerDataServiceSubscription: Subscription | null = null
  private paramSubscription: Subscription | null = null
  private viewerDataServiceResourceSubscription: Subscription | null = null
  appIcon: SafeUrl | null = null
  isTypeOfCollection = false
  collectionType: string | null = null
  prevResourceUrl: string | null = null
  nextResourceUrl: string | null = null
  prevResourceUrlParams!: NavigationExtras
  nextResourceUrlParams!: NavigationExtras
  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar
  resourceId: string = (this.viewerDataSvc.resourceId as string) || ''
  resourceName: string | null = this.viewerDataSvc.resource ? this.viewerDataSvc.resource.name : ''
  resourcePrimaryCategory: string | null = this.viewerDataSvc.resource ? this.viewerDataSvc.resource.primaryCategory : ''
  collectionId = ''
  logo = true
  isPreview = false
  forChannel = false
  constructor(
    private activatedRoute: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    // private logger: LoggerService,
    private configSvc: ConfigurationsService,
    private viewerDataSvc: ViewerDataService,
    private valueSvc: ValueService,
  ) {
    this.valueSvc.isXSmall$.subscribe(isXSmall => {
      this.logo = !isXSmall
    })
  }

  ngOnInit() {
    if (window.location.href.includes('/channel/')) {
      this.forChannel = true
    }
    this.isTypeOfCollection = this.activatedRoute.snapshot.queryParams.collectionType ? true : false
    this.collectionType = this.activatedRoute.snapshot.queryParams.collectionType

    if (this.configSvc.instanceConfig) {
      this.appIcon = this.domSanitizer.bypassSecurityTrustResourceUrl(
        this.configSvc.instanceConfig.logos.app,
      )
    }
    //   this.route.data.subscribe((data: any) => {
    //     this.appIcon =
    //     this.domSanitizer.bypassSecurityTrustResourceUrl(data.configData.data.logos.app)
    //   }
    // )
    this.viewerDataServiceSubscription = this.viewerDataSvc.tocChangeSubject.subscribe(data => {
      if (data.prevResource) {
        this.prevResourceUrl = data.prevResource.viewerUrl
        this.prevResourceUrlParams = {
          queryParams: {
            primaryCategory: data.prevResource.primaryCategory,
            collectionId: data.prevResource.collectionId,
            collectionType: data.prevResource.collectionType,
            batchId: data.prevResource.batchId,
            viewMode: data.prevResource.viewMode,
          },
          fragment: '',
        }
      }
      if (data.nextResource) {
        this.nextResourceUrl = data.nextResource.viewerUrl
        this.nextResourceUrlParams = {
          queryParams: {
            primaryCategory: data.nextResource.primaryCategory,
            collectionId: data.nextResource.collectionId,
            collectionType: data.nextResource.collectionType,
            batchId: data.nextResource.batchId,
            viewMode: data.nextResource.viewMode,
          },
          fragment: '',
        }
      }
      if (this.resourceId !== this.viewerDataSvc.resourceId) {
        this.resourceId = this.viewerDataSvc.resourceId as string
        this.resourceName = this.viewerDataSvc.resource ? this.viewerDataSvc.resource.name : ''
        this.resourcePrimaryCategory = this.viewerDataSvc.resource ? this.viewerDataSvc.resource.primaryCategory : ''
      }
    })
    this.paramSubscription = this.activatedRoute.queryParamMap.subscribe(async params => {
      this.collectionId = params.get('collectionId') as string
      this.isPreview = params.get('preview') === 'true' ? true : false
    })
    this.viewerDataServiceResourceSubscription = this.viewerDataSvc.changedSubject.subscribe(
      _data => {
        this.resourceId = this.viewerDataSvc.resourceId as string
        this.resourceName = this.viewerDataSvc.resource ? this.viewerDataSvc.resource.name : ''
        this.resourcePrimaryCategory = this.viewerDataSvc.resource ? this.viewerDataSvc.resource.primaryCategory : ''
      },
    )
  }

  ngOnDestroy() {
    if (this.viewerDataServiceSubscription) {
      this.viewerDataServiceSubscription.unsubscribe()
    }
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe()
    }
    if (this.viewerDataServiceResourceSubscription) {
      this.viewerDataServiceResourceSubscription.unsubscribe()
    }
  }

  toggleSideBar() {
    this.toggle.emit()
  }

  back() {
    try {
      if (window.self !== window.top) {
        return
      }
      window.history.back()
    } catch (_ex) {
      window.history.back()
    }

  }
}
