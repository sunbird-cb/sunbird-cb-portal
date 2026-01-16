import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { NsContent, viewerRouteGenerator } from '@sunbird-cb/collection'
import { NsAppToc } from '../../models/app-toc.model'
import { EventService } from '@sunbird-cb/utils-v2'
/* tslint:disable*/
import _ from 'lodash'
import { CertificateDialogComponent } from '@sunbird-cb/collection/src/lib/_common/certificate-dialog/certificate-dialog.component'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'

@Component({
  selector: 'ws-app-toc-content-card',
  templateUrl: './app-toc-content-card.component.html',
  styleUrls: ['./app-toc-content-card.component.scss'],
})
export class AppTocContentCardComponent implements OnInit, OnChanges {
  @Input() content: NsContent.IContent | null = null
  @Input() expandAll = false
  @Input() rootId!: string
  @Input() rootContentType!: string
  @Input() forPreview = false
  @Input() batchId!: string
  hasContentStructure = false
  enumContentTypes = NsContent.EDisplayContentTypes
  contentStructure: NsAppToc.ITocStructure = {
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
  defaultThumbnail = ''
  viewChildren = false
  constructor(
    private events: EventService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.evaluateImmediateChildrenStructure()
    // this.route.data.subscribe(data => {
    //     this.defaultThumbnail = data.configData.data.logos.defaultContent
    //   }
    // )
    
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const property in changes) {
      if (property === 'expandAll') {
        this.viewChildren = this.expandAll
      }
    }
  }
  get isCollection(): boolean {
    if (this.content) {
      return this.content.mimeType === NsContent.EMimeTypes.COLLECTION
    }
    return false
  }
  get isResource(): boolean {
    if (this.content) {
      return (
        this.content.primaryCategory === NsContent.EPrimaryCategory.RESOURCE
        // || this.content.primaryCategory === NsContent.EPrimaryCategory.KNOWLEDGE_ARTIFACT
        || this.content.primaryCategory === NsContent.EPrimaryCategory.PRACTICE_RESOURCE
        || this.content.primaryCategory === NsContent.EPrimaryCategory.FINAL_ASSESSMENT
        || this.content.primaryCategory === NsContent.EPrimaryCategory.COMP_ASSESSMENT
      )
    }
    return false
  }
  get resourceLink(): { url: string; queryParams: { [key: string]: any } } {
    if (this.content) {
      let url = viewerRouteGenerator(
        this.content.identifier,
        this.content.mimeType,
        this.rootId,
        this.rootContentType,
        this.forPreview,
        this.content.primaryCategory,
        this.batchId
      )
      
      /* tslint:disable-next-line */
      // console.log(url,'=====> content card url link <========')
      return url
    }
    return { url: '', queryParams: {} }
  }

  public progressColor(): string {
    // if (this.currentProgress <= 30) {
    //   return '#D13924'
    // } if (this.currentProgress > 30 && this.currentProgress <= 70) {
    //   return '#E99E38'
    // }
    // if (this.currentProgress > 70 && this.currentProgress <= 100) {
    //   return '#1D8923'
    // }
   
    return '#1D8923'
  }

  public progressColor2(): string {
    return '#f27d00'
  }


  private evaluateImmediateChildrenStructure() {
    if (this.content && this.content.children && this.content.children.length) {
      this.content.children.forEach((child: NsContent.IContent) => {
        if (child.primaryCategory === NsContent.EPrimaryCategory.COURSE) {
          this.contentStructure.course += 1
        } else if (child.primaryCategory === NsContent.EPrimaryCategory.KNOWLEDGE_ARTIFACT) {
          this.contentStructure.other += 1
        } else if (child.primaryCategory === NsContent.EPrimaryCategory.MODULE) {
          this.contentStructure.learningModule += 1
        } else if (child.primaryCategory === NsContent.EPrimaryCategory.OFFLINE_SESSION) {
          this.contentStructure.offlineSession += 1
        } else if (child.primaryCategory === NsContent.EPrimaryCategory.RESOURCE) {
          switch (child.mimeType) {
            case NsContent.EMimeTypes.HANDS_ON:
              this.contentStructure.handsOn += 1
              break
            case NsContent.EMimeTypes.MP3:
              this.contentStructure.podcast += 1
              break
            case NsContent.EMimeTypes.MP4:
            case NsContent.EMimeTypes.M3U8:
              this.contentStructure.video += 1
              break
            case NsContent.EMimeTypes.INTERACTION:
              this.contentStructure.interactiveVideo += 1
              break
            case NsContent.EMimeTypes.PDF:
              this.contentStructure.pdf += 1
              break
            case NsContent.EMimeTypes.OFFLINE_SESSION:
              this.contentStructure.offlineSession += 1
              break
            case NsContent.EMimeTypes.SURVEY:
              this.contentStructure.survey += 1
              break
            case NsContent.EMimeTypes.HTML:
              this.contentStructure.webPage += 1
              break
            case NsContent.EMimeTypes.QUIZ:
              if (child.resourceType === 'Assessment') {
                this.contentStructure.assessment += 1
              } else {
                this.contentStructure.quiz += 1
              }
              break
            case NsContent.EMimeTypes.PRACTICE_RESOURCE:
              // case NsContent.EMimeTypes.FINAL_ASSESSMENT:
              // case NsContent.EMimeTypes.PRACTICE_RESOURCE:
              this.contentStructure.practiceTest += 1
              break
            case NsContent.EMimeTypes.WEB_MODULE:
              this.contentStructure.webModule += 1
              break
            case NsContent.EMimeTypes.YOUTUBE:
              this.contentStructure.youtube += 1
              break
            default:
              this.contentStructure.other += 1
              break
          }
        }
      })
    }
    for (const key in this.contentStructure) {
      if (this.contentStructure[key] > 0) {
        this.hasContentStructure = true
      }
    }
  }

  get contextPath() {
    return {
      contextId: this.rootId,
      contextPath: this.rootContentType,
      batchId: this.batchId,
    }
  }

  public contentTrackBy(_index: number, content: NsContent.IContent) {
    if (!content) {
      return null
    }
    return content.identifier
  }

  public raiseTelemetry() {
    // if (this.forPreview) { return }
    if (this.content) {
      this.events.raiseInteractTelemetry(
        {
          type: 'click',
          subType: `card-tocContentCard`,
          // id: this.content.identifier || '',
        },
        {
          // contentId: this.content.identifier || '',
          // contentType: this.content.primaryCategory,
          id: this.content.identifier || '',
          type: this.content.primaryCategory,
          rollup: {
            l1: this.rootId || '',
          },
          ver: `${this.content.version}${''}`,
        },
        {
          pageIdExt: `${_.camelCase(this.content.primaryCategory)}-card`,
          module: _.camelCase(this.content.primaryCategory),
        })
    }
  }
  get isAllowed(): boolean {
    if (this.content) {
      return !(NsContent.UN_SUPPORTED_DATA_TYPES_FOR_NON_BATCH_USERS.indexOf(this.content.mimeType) >= 0)
    } return false
  }

  get isEnabled(): boolean {
    return false
  }
  openCertificateDialog(certData: any) {
    const cet = certData
    this.dialog.open(CertificateDialogComponent, {
      // height: '400px',
      width: '1300px',
      data: { cet },
      // panelClass: 'custom-dialog-container',
    })
  }
}
