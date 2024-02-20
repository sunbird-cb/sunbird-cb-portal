import { AfterViewInit, Component, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core'
import { MatTabChangeEvent, MatTabGroup } from '@angular/material'
import { ActivatedRoute } from '@angular/router'
import { NsContent, UtilityService } from '@sunbird-cb/utils/src/public-api'
import { Subscription } from 'rxjs'

import { LoadCheckService } from '@ws/app/src/lib/routes/app-toc/services/load-check.service'

@Component({
  selector: 'ws-widget-content-toc',
  templateUrl: './content-toc.component.html',
  styleUrls: ['./content-toc.component.scss'],
})

export class ContentTocComponent implements OnInit, AfterViewInit, OnChanges {

  tabChangeValue: any = ''
  @Input() content!: NsContent.IContent
  @Input() initialRouteData: any
  @Input() changeTab = false
  routeSubscription: Subscription | null = null
  @Input() forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
  @Input() contentTabFlag = true
  @Input() resumeData: NsContent.IContinueLearningData | null = null
  @Input() batchData: /**NsContent.IBatchListResponse */ any | null = null
  @Input() skeletonLoader = false
  @Input() tocStructure: any = {}
  @Input() pathSet: any
  @Input() fromViewer = false
  @ViewChild('stickyMenu', { static: false }) tabElement!: MatTabGroup
  sticky = false
  menuPosition: any
  isMobile = false
  selectedTabIndex = 0
  config: any

  constructor(
    private route: ActivatedRoute,
    private utilityService: UtilityService,
    private loadCheckService: LoadCheckService
  ) { }

  ngOnInit() {
    if (this.route.snapshot.data.pageData && this.route.snapshot.data.pageData.data) {
      this.config = this.route.snapshot.data.pageData.data
    }
  }

  ngAfterViewInit() {
    this.isMobile = this.utilityService.isMobile
    this.menuPosition = this.tabElement._elementRef.nativeElement.offsetTop
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.changeTab && changes.changeTab.currentValue) {
      this.selectedTabIndex = 1
    }
  }

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.scrollY
    if (windowScroll >= (this.menuPosition - ((this.isMobile) ? 96 : 104))) {
      this.sticky = true
    } else {
      this.sticky = false
    }
  }

  handleTabChange(event: MatTabChangeEvent): void {
    this.tabChangeValue = event.tab
    this.selectedTabIndex = event.index
    if (this.selectedTabIndex === 1) {
      this.loadCheckService.componentLoaded(true)
    }
  }
}
