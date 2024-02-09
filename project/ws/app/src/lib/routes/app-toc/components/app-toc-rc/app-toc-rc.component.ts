import { AfterViewInit, Component, OnInit, ViewChild, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { MatSnackBar } from '@angular/material'

import { NsContent } from '@sunbird-cb/collection/src/public-api'

import { LoadCheckService } from '../../services/load-check.service'
import { WidgetContentService } from '@sunbird-cb/collection'
import { ConfigurationsService, WsEvents } from '@sunbird-cb/utils'
import { EventService } from '@sunbird-cb/utils/src/public-api'

@Component({
  selector: 'ws-app-toc-rc',
  templateUrl: './app-toc-rc.component.html',
  styleUrls: ['./app-toc-rc.component.scss'],
})
export class AppTocRcComponent implements OnInit, AfterViewInit {
  @ViewChild('rightContainer', { static: false }) rcElement!: ElementRef
  @Output() userEnrollment = new EventEmitter()
  @Input() content: NsContent.IContent | null = null
  @Input() skeletonLoader = false
  @Input() batchData: any
  firstResourceLink: { url: string; queryParams: { [key: string]: any } } | null = null
  contextPath?: string
  isClaimed = false
  courseID: any
  scrollLimit = 0
  rcElem = {
    offSetTop: 0,
    BottomPos: 0,
  }
  scrolled = false
  contextId?: string
  constructor(
    private loadCheckService: LoadCheckService,
    private configService: ConfigurationsService,
    private eventsService: EventService,
    private contentService: WidgetContentService,
    private matSnackBar: MatSnackBar,
  ) {
    this.loadCheckService.childComponentLoaded$.subscribe(_isLoaded => {
      // Present in app-toc-about.component
      const ratingsDiv = document.getElementById('ratingsDiv') as any
      this.scrollLimit = ratingsDiv && ratingsDiv.getBoundingClientRect().bottom as any
    })
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.rcElem.BottomPos = this.rcElement.nativeElement.offsetTop + this.rcElement.nativeElement.offsetHeight
    this.rcElem.offSetTop = this.rcElement.nativeElement.offsetTop
  }

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    if (this.scrollLimit) {
      if ((window.scrollY + this.rcElem.BottomPos) >= this.scrollLimit) {
        this.rcElement.nativeElement.style.position = 'sticky'
      } else {
        this.rcElement.nativeElement.style.position = 'fixed'
      }
    }

    // 236... (OffsetTop of right container + 104)
    if (window.scrollY > (this.rcElem.offSetTop + 104)) {
      this.scrolled = true
    } else {
      this.scrolled = false
    }
  }

  handleCapitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  handleClickOfClaim(event: any) {
    // tslint:disable:no-console
    console.log(event)
    const request = {
      userId: this.configService.unMappedUser.identifier,
      courseId: this.courseID,
    }
    this.raiseTelemetry()
    this.contentService.claimKarmapoints(request).subscribe((res: any) => {
      // tslint:disable:no-console
      console.log(res)
      this.isClaimed = true
      this.matSnackBar.open('Karma points are successfully claimed.')
      this.userEnrollment.emit()
      // this.getUserEnrollmentList()
    },                                                      (error: HttpErrorResponse) => {
      // tslint:disable:no-console
      if (!error.ok) {
        this.matSnackBar.open('something went wrong.')
      }
    })
  }

  raiseTelemetry() {
    this.eventsService.raiseInteractTelemetry(
      {
        type: 'click',
        subType: 'karmapoints-claim',
        id: this.courseID,
      },
      {
        id: this.courseID,
        type: 'course',
      },
      {
        pageIdExt: 'btn-acbp-claim',
        module: WsEvents.EnumTelemetrymodules.KARMAPOINTS,
    })
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

  public handleParseJsonData(s: string) {
    try {
      const parsedString = JSON.parse(s)
      return parsedString
    } catch {
      return []
    }
  }

  handleGenerateQuery(_type: 'RESUME' | 'START_OVER' | 'START'): any {
    // if (this.firstResourceLink && (type === 'START' || type === 'START_OVER')) {
    //   let qParams: { [key: string]: string } = {
    //     ...this.firstResourceLink.queryParams,
    //     viewMode: type,
    //     batchId: this.getBatchId(),
    //   }
    //   if (this.contextId && this.contextPath) {
    //     qParams = {
    //       ...qParams,
    //       collectionId: this.contextId,
    //       collectionType: this.contextPath,
    //     }
    //   }
    //   if (this.forPreview) {
    //     delete qParams.viewMode
    //   }
    //   qParams = {
    //     ...qParams,
    //     channelId: this.channelId,
    //   }
    //   return qParams
    // }

    // if (this.resumeDataLink && type === 'RESUME') {
    //   let qParams: { [key: string]: string } = {
    //     ...this.resumeDataLink.queryParams,
    //     batchId: this.getBatchId(),
    //     viewMode: 'RESUME',
    //     // courseName: this.content ? this.content.name : '',
    //   }
    //   if (this.contextId && this.contextPath) {
    //     qParams = {
    //       ...qParams,
    //       collectionId: this.contextId,
    //       collectionType: this.contextPath,
    //     }
    //   }
    //   if (this.forPreview) {
    //     delete qParams.viewMode
    //   }
    //   qParams = {
    //     ...qParams,
    //     channelId: this.channelId,
    //   }
    //   return qParams
    // }
    // if (this.forPreview) {
    //   return {}
    // }
    // return {
    //   batchId: this.getBatchId(),
    //   viewMode: type,
    // }
  }

}
