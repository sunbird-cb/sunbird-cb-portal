import { TitleCasePipe } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { VIEWER_ROUTE_FROM_MIME } from '@sunbird-cb/collection/src/public-api'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { ViewerDataService } from '@ws/viewer/src/public-api'
import _ from 'lodash'

@Component({
  selector: 'ws-app-gyaan-player',
  templateUrl: './gyaan-player.component.html',
  styleUrls: ['./gyaan-player.component.scss'],
})
export class GyaanPlayerComponent implements OnInit {
  resourceData: any
  titles: any = []
  enableShare = false
  rootOrgId: any
  resourceLink: any = ''
  pageConfig: any
  relatedContentStrip: any
  displayContents = true
  collectionId: any = ''
  from: any = ''
  isInstructionsExpanded = false
  hasLongInstructions = false

  sectorsList: any[] = []
  subSectorsList: any[] = []
  userProfile: any = null
  subSectorDetailArr: any = []
  selectedSector = ''
  selectedSectorId = ''

  constructor(private viewerDataSvc: ViewerDataService,
              private configSvc: ConfigurationsService,
              private route: ActivatedRoute,
              public titleCasePipe: TitleCasePipe,
              public translate: TranslateService, private router: Router) {
    if (this.route.parent && this.route.parent.snapshot.data.pageData
      && this.route.parent.snapshot.data.pageData.data
      && this.route.parent.snapshot.data.pageData.data.stripConfig) {
        this.pageConfig = JSON.parse(JSON.stringify(this.route.parent && this.route.parent.snapshot.data.pageData.data))
        this.displayContents = this.route.parent.snapshot.queryParams.playerPreview ? false :  true
        this.collectionId = this.route.parent.snapshot.queryParams.collectionId ?
        this.route.parent.snapshot.queryParams.collectionId :  ''
      }
    this.router.events.subscribe(val => {
        // see also
        if (val instanceof NavigationEnd) {
          this.resourceData = _.cloneDeep(this.viewerDataSvc.resource)
          this.relatedContentStrip = {}
          this.updateSectorData()
          this.getRelatedContent()
        }
    })
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
    if (this.configSvc.userProfile) {
      this.rootOrgId = this.configSvc.userProfile.rootOrgId
    }
    this.resourceLink = `${window.location.pathname.substring(1)}${window.location.search}`
  }

  ngOnInit() {
    this.resourceData = _.cloneDeep(this.viewerDataSvc.resource)
    this.updateSectorData()
    this.getRelatedContent()
    if (!this.displayContents) {
      this.titles = [
        { title: 'Gyaan Karmayogi', url: '/app/amrit-gyaan-kosh/all', icon: 'menu_book' },
        { title: 'TOC page', disableTranslate: true,
          queryParams: {  }, url: `/app/toc/${this.collectionId}/overview`, icon: '' },
        { title: this.resourceData.name, url: `none`, icon: '' },
      ]
    } else {
      const _queryParams = { ...this.route.snapshot.queryParams }
      if (!_queryParams['content']) {
        _queryParams['content'] = 'agkCaseStudies'
      }
      if(this.resourceData.resourceCategory) {
        _queryParams['key'] = this.resourceData.resourceCategory.toLowerCase()
      }      
      this.titles = [
        { title: 'Gyaan Karmayogi', url: '/app/amrit-gyaan-kosh/all', icon: 'menu_book' },
        { title: this.titleCasePipe.transform(this.resourceData.resourceCategory), disableTranslate: true,
          queryParams: _queryParams, url: `/app/amrit-gyaan-kosh/view-all`, icon: '' },
        { title: this.resourceData.name, url: `none`, icon: '' },
      ]
    }

    this.route.queryParams.subscribe((params:any) => {
      console.log(params); // Print all query parameters
      this.from = params['from']; // Access a specific query param
      console.log('this.from', this.from);
    });

    // Set up observer to check if instructions are long enough to require "View More"
    setTimeout(() => {
      this.checkInstructionsLength();
    }, 100);
    
    this.handleSubsector(this.resourceData?.sectorDetails_v1?.[0] || []);
  }

  // this method is used to close the share popup
  resetEnableShare() {
    this.enableShare = false
  }
// the below method is used to get resource type
  get getMimeType() {
    if (this.resourceData) {
      const mimetype = this.resourceData && this.resourceData.mimeType
      return VIEWER_ROUTE_FROM_MIME(mimetype)
    }
    return ''
  }
  // the below method is used to form releated content request
  getRelatedContent() {
    if (this.resourceData && this.pageConfig.stripConfig) {
      const negetContent: any = {
        'name': {
          '!=': [
              this.resourceData.name,
          ],
        },
      }
      const stripData = JSON.parse(JSON.stringify(this.pageConfig.stripConfig))
      stripData.strips[0].title = 'Related resources'
      stripData.strips[0].request.searchV6.request.limit = 3
      stripData.strips[0].request.searchV6.request.filters = {
          ...stripData.strips[0].request.searchV6.request.filters,
          ...(this.resourceData.sectorName ? { sectorName: this.resourceData.sectorName } : null),
          ...(this.resourceData.subSectorName ? { subSectorName: this.resourceData.subSectorName } : null),
          ...(this.resourceData.resourceCategory ? { resourceCategory: this.resourceData.resourceCategory } : null),
          ...negetContent,
      }
      this.relatedContentStrip = stripData
    }
  }

  updateSectorData() {
    if (this.resourceData?.sectorDetails_v1) {
      // Parse string to array if needed
      let sectorDetailsArray = this.resourceData.sectorDetails_v1
  
      // If it's a string, try to parse it into an array
      if (typeof sectorDetailsArray === 'string') {
        try {
          sectorDetailsArray = JSON.parse(sectorDetailsArray)
          this.resourceData.sectorDetails_v1 = sectorDetailsArray
        } catch (e) {
          console.error('Error parsing sectorDetails_v1:', e)
          sectorDetailsArray = []
        }
      }
  
      // Process only if we have a valid array with items
      if (Array.isArray(sectorDetailsArray) && sectorDetailsArray.length > 0) {
        // Extract unique sectors using lodash
        this.resourceData['sectorsList'] = _.uniqBy(
          sectorDetailsArray
            .filter((item: any) => item?.sectorName && item?.sectorId)
            .map((item: any) => ({
              sectorId: item.sectorId,
              sectorName: item.sectorName
            })),
          'sectorName'
        )
  
        // Extract unique subsectors using lodash
        this.resourceData['subSectorsList'] = _.uniqBy(
          sectorDetailsArray
            .filter((item: any) => item?.subSectorName && item?.subSectorId)
            .map((item: any) => ({
              subSectorId: item.subSectorId,
              subSectorName: item.subSectorName
            })),
          'subSectorName'
        )
      }
    }
  }

  checkInstructionsLength() {
    if (!this.resourceData?.instructions) {
      return;
    }
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.resourceData.instructions;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Rough estimate: 200 characters would typically require more than 4 lines
    this.hasLongInstructions = textContent.length > 200;
  }

  toggleInstructions() {
    this.isInstructionsExpanded = !this.isInstructionsExpanded;
  }

  handleSubsector(item: any): void {
    // Reset previous state
    this.subSectorDetailArr = [];
    this.selectedSector = item.sectorName;
    this.selectedSectorId = item.sectorId;

    if (!this.resourceData?.sectorDetails_v1?.length) {
      return;
    }

    // Filter subsectors for the selected sector
    const relevantSubSectors = this.resourceData.sectorDetails_v1.filter(
      (sector: any) => sector.sectorId === this.selectedSectorId && sector.subSectorName
    );

    // Process subsector data
    if (relevantSubSectors.length) {
      // Map to the required structure
      this.subSectorDetailArr = relevantSubSectors.map((sector: any) => ({
        sectorId: sector.sectorId,
        sectorName: sector.sectorName,
        key: sector.subSectorName,
        value: [sector.subSectorName]
      }));

      // Create card data for each subsector
      this.subSectorsList = this.getUniqueArray(relevantSubSectors).map((sector: any) => ({
        widgetType: "card",
        widgetSubType: "competencyCard",
        widgetHostClass: "mr-4",
        widgetData: {
          content: {
            sectorId: this.selectedSectorId,
            sectorName: this.selectedSector,
            key: sector.subSectorName,
            value: [sector.subSectorName]
          },
          competencyArea: "Behavioural",
          cardCustomeClass: "",
          context: {
            pageSection: "blendedPrograms",
            position: 0
          }
        }
      }));
    } else {
      this.subSectorsList = [];
    }
  }

  /**
   * Returns an array with unique objects based on a specific property
   */
  getUniqueArray(arrayData: any[]): any[] {
    if (!arrayData?.length) {
      return [];
    }
    
    return _.uniqBy(arrayData, 'subSectorName');
  }
}
