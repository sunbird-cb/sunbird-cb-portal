import { AfterViewInit, Component, HostListener, Input, OnInit, ViewChild } from '@angular/core'
import { MatTabChangeEvent, MatTabGroup } from '@angular/material'
import { NsContent, UtilityService } from '@sunbird-cb/utils/src/public-api'
import { Subscription } from 'rxjs'

@Component({
  selector: 'ws-widget-content-toc',
  templateUrl: './content-toc.component.html',
  styleUrls: ['./content-toc.component.scss'],
})

export class ContentTocComponent implements OnInit, AfterViewInit {

  tabChangeValue: any = ''
  @Input() content: NsContent.IContent | null = null
  @Input() initialRouteData: any
  routeSubscription: Subscription | null = null
  @Input() forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
  @Input() contentTabFlag = true;
  @Input() resumeData: NsContent.IContinueLearningData | null = null
  @Input() batchData: /**NsContent.IBatchListResponse */ any | null = null
  @Input() skeletonLoader = false
  @ViewChild('stickyMenu', { static: false }) tabElement!: MatTabGroup
  sticky = false
  menuPosition: any
  isMobile = false

  constructor(
    private utilityService: UtilityService
  ) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.isMobile = this.utilityService.isMobile
    this.menuPosition = this.tabElement._elementRef.nativeElement.offsetTop
  }

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.scrollY
    if (windowScroll >= (this.menuPosition - ((this.isMobile) ? 185 : 104))) {
      this.sticky = true
    } else {
      this.sticky = false
    }
  }

  handleTabChange(event: MatTabChangeEvent): void {
    this.tabChangeValue = event.tab
  }

}
