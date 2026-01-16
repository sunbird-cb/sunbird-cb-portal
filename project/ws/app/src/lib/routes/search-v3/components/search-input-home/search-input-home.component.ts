import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationsService } from '@sunbird-cb/utils-v2';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SearchServService } from '../../../search/services/search-serv.service';
import { GbSearchService } from '../../services/gb-search.service';
// import { MobileAppsService } from '';
import {
  FacetType,
  SearchCategory,
  SearchCommunitiesRequest,
  SearchEventfacet,
  SearchEventFields,
  SearchExternalRequest,
  SearchNLP,
  SearchPeoplesRequest,
  SearchResourceFacets,
  SearchResourceMimeType,
  SearchV4Request,
} from '../../models/search-v3.model';
import { WidgetContentLibService } from '@sunbird-cb/consumption';
import { MobileAppsService } from '../../../../../../../../../src/app/services/mobile-apps.service';


@Component({
  selector: 'ws-app-search-v3-input-home',
  templateUrl: './search-input-home.component.html',
  styleUrls: ['./search-input-home.component.scss'],
  // tslint:disable-next-line
  encapsulation: ViewEncapsulation.None,
})
export class SearchInputHomeComponent implements OnInit, OnChanges {
  @Input() placeHolder = '';
  @Input() ref = '';
  @Output() closed: EventEmitter<boolean> = new EventEmitter();
 
 
  queryControl: UntypedFormControl;
  languageSearch: string[] = [];
  SAKSHAMAI_ICON_LOADER = '/assets/images/sakshamAI/saksham_ai_loader.gif';

  disableMenu = false;
  recentSearches: any = [
    // 'AI Throttling Improves Deliverability',
    // 'AI Throttling Improves Deliverability',
    // 'AI Throttling Improves Deliverability',
  ];
  searchQuery = ''
  allSearchResults: any[] = [];
  nlpSearchValue :any
  private hasReadRecentBeenCalled = false;
  searchCat: any
  categories = [
    { label: 'Content', value: SearchCategory.Courses, icon: 'video-library' },
    // {
    //   label: 'Programs',
    //   value: SearchCategory.Programs,
    //   icon: 'school-search',
    // },
    { label: 'Events', value: SearchCategory.Events, icon: 'calender-event' },
    { label: 'People', value: SearchCategory.People, icon: 'people-search' },
    {
      label: 'External Contents',
      value: SearchCategory.ExternalContents,
      icon: 'video-library',
    },
    // {
    //   label: 'Case Studies',
    //   value: SearchCategory.CaseStudy,
    //   icon: 'diversity_3',
    // },
    {
      label: 'Communities',
      value: SearchCategory.Communities,
      icon: 'menu_book',
    },
    {
      label: 'Resources',
      value: SearchCategory.Resources,
      icon: 'diversity_3',
    },
    { label: 'All', value: SearchCategory.All, icon: '' },
  ];

  selectedSearchCategory: string = SearchCategory.Courses;
  openSearchTemplate = false;
  loaderSearching = false;
  responseNlpQuery = '';
  searchSubscription:any
   @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.openSearchTemplate = false;
    }
  }
  constructor(
    private activated: ActivatedRoute,
    private router: Router,
    private searchServSvc: SearchServService,
    private configSvc: ConfigurationsService,
    private route: ActivatedRoute,
    private eRef: ElementRef,
    private searchV3Service: GbSearchService,
    private contSvc: WidgetContentLibService,
    private mobileAppsService: MobileAppsService
  ) {
    this.queryControl = new UntypedFormControl(
      this.activated.snapshot.queryParams.q || ''
    );

    this.searchSubscription = this.mobileAppsService.clearGlobalSearchForHomePage.subscribe((value:any)=>{
      if(value) {
        this.clearSearchTextElement()
      } 
    })

   
    
    this.queryControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(async (value) => {
        if (value.length > 100) {
          await this.searchFromQuery(value);
          this.loaderSearching = false;
        } else {
          this.loaderSearching = false;
        }
      });
  }

   clearSearchTextElement() {
    this.queryControl.setValue('')
    if (this.searchInput) {
      this.searchInput.nativeElement.value = ''
    }
  }

  ngOnInit() {
    if (!this.activated.snapshot.data.searchPageData) {
      this.searchServSvc
        .getSearchConfig()
        .then((data) => {
          this.activated.snapshot.data = {
            searchPageData: { data },
          };
        })
        .then(() => {
          this.initialize();
        });
    } else {
      this.initialize();
    }
  }
  ngOnChanges() {
    for (const change in SimpleChange) {
      if (change === 'placeHolder') {
        this.placeHolder = this.placeHolder;
      }
    }

  }

  autoFilter() {
    if (this.route.snapshot.data.searchPageData) {
      const isAutoCompleteAllowed =
        this.route.snapshot.data.searchPageData.data.search
          .isAutoCompleteAllowed;
      if (typeof isAutoCompleteAllowed === 'boolean' && isAutoCompleteAllowed) {
        this.queryControl.valueChanges
          .pipe(debounceTime(200), distinctUntilChanged())
          .subscribe((q) => {
            this.searchFromQuery(q);
          });
      }
    }
  }

  initialize() {
    let isNotMyUser = false;
    let isIgotOrg = false;
    if (
      this.configSvc &&
      this.configSvc.unMappedUser &&
      this.configSvc.unMappedUser.profileDetails &&
      this.configSvc.unMappedUser.profileDetails.profileStatus
    ) {
      isNotMyUser =
        this.configSvc.unMappedUser.profileDetails.profileStatus.toLowerCase() ===
          'not-my-user'
          ? true
          : false;
    }
    if (
      this.configSvc &&
      this.configSvc.unMappedUser &&
      this.configSvc.unMappedUser.profileDetails &&
      this.configSvc.unMappedUser.profileDetails.employmentDetails &&
      this.configSvc.unMappedUser.profileDetails.employmentDetails
        .departmentName
    ) {
      isIgotOrg =
        this.configSvc.unMappedUser.profileDetails.employmentDetails.departmentName.toLowerCase() ===
          'igot'
          ? true
          : false;
    }
    // let isIgotOrg = true
    if (isNotMyUser && isIgotOrg) {
      this.disableMenu = true;
    } else {
      this.disableMenu = false;
    }
    this.activated.queryParamMap.subscribe((queryParam) => {
      if (queryParam.has('q')) {
        this.queryControl.setValue(queryParam.get('q') || '');
      }
      if (queryParam.has('category')) {
        this.selectedSearchCategory = queryParam.get('category') || '';
      } else {
        // this.selectedSearchCategory = SearchCategory.All;
        this.selectedSearchCategory = SearchCategory.Courses;
      }

      const isAutoCompleteAllowed = this.route.snapshot.data.searchPageData
        ? this.route.snapshot.data.searchPageData.data.search
          .isAutoCompleteAllowed
        : false;
      if (
        typeof isAutoCompleteAllowed === 'undefined' ||
        (typeof isAutoCompleteAllowed === 'boolean' && isAutoCompleteAllowed)
      ) {
      }
    });
  }

  async updateQuery(query: string) {
    if (query && query.length) {
      await this.searchInNLP(query).then(() => {
        this.processSearchText(query);
      }).catch(() => {
        this.processSearchText(query);
      });
    } else {
      this.processSearchText(query);
    }
  }

  async updateRecentSearchQuery(query: any) {
    if (query) {
      const reqBody = {
        nlpSearchQuery: query.nlp_search_query,
        searchQuery:query.search_query,
        searchCategory: query.search_category[0]
      }
      await this.searchV3Service.recentCreate(reqBody).then(() => {
        this.processRecentSearchText(query);
      }).catch(() => {
        this.processRecentSearchText(query);
      });
    } else {
      this.processRecentSearchText(query);
    }
  }

  async createRecent(data: any) {
    const reqBody = {
      nlpSearchQuery: data,
      searchQuery: this.queryControl.value,
      searchCategory: this.selectedSearchCategory ? this.selectedSearchCategory : 'all'
    }
   
    await this.searchV3Service.recentCreate(
      reqBody
    ).catch();

  }

  readRecent() {
    return this.searchV3Service.recentRead().subscribe((res: any) => {
      if (res) {
        // this.recentSearches = res.result.searchQueries.nlp_search_query   this.nlpSearchValue = res
        if( res.result.searchQueries &&  res.result.searchQueries) {
          this.recentSearches = res?.result?.searchQueries
        } else {
          this.recentSearches = ''
        }
      }
    })
  }

  goToSearchItem(query: any) {
    const category = query?.search_category && query?.search_category[0]
    const nlpSearchQuery = query?.nlp_search_query
    if (category && category === 'courses' && nlpSearchQuery) {
      const req = {
        "request": {
          "filters": {
            "contentType": [
              "Course"
            ],
            "courseCategory": [],
            "status": [
              "Live"
            ]
          },
          "fields": [
            "downloadUrl",
            "organisation",
            "language",
            "source",
            "appIcon",
            "identifier",
            "name",
            "primaryCategory",
            "contentType",
            "posterImage",
            "createdOn",
            "duration",
            "avgRating",
            "additionalTags",
            "courseCategory",
            "mimeType",
            "contentId",
            "creatorLogo",
            'languageMapV1',
            'language',
            "sectorDetails_v1"
          ],
          "facets": [
            "avgRating",
            "language",
            "organisation",
            "courseCategory",
            "sectorDetails_v1.sectorName",
            "sectorDetails_v1.subSectorName",
            "competencies_v6.competencyAreaName",
            "competencies_v6.competencyThemeName",
            "competencies_v6.competencySubThemeName"
          ],
          "query": nlpSearchQuery,
          "limit": 3,
          "offset": 0,
          "sort_by": {}
        }
      }
      this.searchV3Service.fetchSearchDataByCategory(req).subscribe((res: any) => {
        if(res) {
          this.updateRecentSearchQuery(query);
        }
      })
    }
    if (category && category === 'events' && nlpSearchQuery) {
      const req = {
        "request": {
          "filters": {
            "contentType": "Event",
            "status": [
              "Live"
            ]
          },
          "fields": [
            "name",
            "description",
            "identifier",
            "resourceType",
            "contentType",
            "sourceName",
            "duration",
            "startDate",
            "endDate",
            "startTime",
            "endTime",
            "createdOn",
            "eventType",
            "expiryDate",
            "appIcon",
            "startDateTime",
            "endDateTime"
          ],
          "facets": [
            "duration",
            "language",
            "sourceName",
            "startDateTimeInEpoch",
            "endDateTimeInEpoch",
            "resourceType",
            "competencies_v6.competencyAreaName",
            "competencies_v6.competencyThemeName",
            "competencies_v6.competencySubThemeName"
          ],
          "query": nlpSearchQuery,
          "limit": 3,
          "offset": 0,
          "sort_by": {}
        }
      }
      this.searchV3Service.fetchSearchDataByCategory(req).subscribe((res: any) => {
        if (res) {
          this.updateRecentSearchQuery(query);
        }
      })
    }

    if (category && category === 'peoples' && nlpSearchQuery) {
      const req = {
        filters: {},
        facets: [
          "profileDetails.professionalDetails.designation",
          "rootOrgName"
        ],
        fields: [],
        limit: 5,
        offset: 0,
        sort_by: {},
        query: nlpSearchQuery,
      }
      // this.searchV3Service.searchConnections(req).then(
      //   // this.updateRecentSearchQuery(query)
      // ).catch()
       this.searchV3Service.searchConnections(req)
    .then(() => {
      this.updateRecentSearchQuery(query);
    })
    .catch(error => {
      // tslint:disable-next-line: align
      console.error('some error', error);
    });
    }

    if (category && category === 'resources' && nlpSearchQuery) {
      const req = {
        "request": {
            "filters": {
                "contentType": "Resource",
                "courseCategory": [],
                "status": [
                    "Live"
                ],
                "mimeType": [
                    "application/pdf",
                    "video/mp4",
                    "text/x-url",
                    "audio/mpeg",
                    "application/vnd.ekstep.content-collection"
                ]
            },
            "fields": [],
            "facets": [
                "resourceCategory",
                "sectorDetails_v1.subSectorName",
                "sectorDetails_v1.sectorName",
                "years"
            ],
            "query": nlpSearchQuery,
            "limit": 3,
            "offset": 0,
            "sort_by": {},
            "exists": [
                "sectorDetails_v1.sectorName",
                "resourceCategory"
            ]
        }
       
    }
    this.searchV3Service.fetchSearchDataByCategory(req).subscribe((res: any) => {
      if (res) {
        this.updateRecentSearchQuery(query);
      }
    })
  }
      if (category && category === 'communities' && nlpSearchQuery) {
        const req = {
          "filterCriteriaMap": {
              "status": "active"
          },
          "requestedFields": [],
          "pageNumber": 0,
          "pageSize": 6,
          "facets": [
              "topicName",
              "orgName",
              "competencies_v6.competencyAreaName",
              "competencies_v6.competencyThemeName",
              "competencies_v6.competencySubThemeName"
          ],
          "searchString": nlpSearchQuery
      }
        this.searchV3Service.fetchSearchDataByCategory(req).subscribe((res: any) => {
          if (res) {
            this.updateRecentSearchQuery(query);
          }
        })


    }

    if (category && category === 'all' && nlpSearchQuery) {
       const catReq = {
        "request": {
          "filters": {
            "contentType": [
              "Course"
            ],
            "courseCategory": [],
            "status": [
              "Live"
            ]
          },
          "fields": [
            "downloadUrl",
            "organisation",
            "language",
            "source",
            "appIcon",
            "identifier",
            "name",
            "primaryCategory",
            "contentType",
            "posterImage",
            "createdOn",
            "duration",
            "avgRating",
            "additionalTags",
            "courseCategory",
            "mimeType",
            "contentId",
            "creatorLogo",
            "sectorDetails_v1",
            'languageMapV1',
            'language'
          ],
          "facets": [
            "avgRating",
            "language",
            "organisation",
            "courseCategory",
            "sectorDetails_v1.sectorName",
            "sectorDetails_v1.subSectorName",
            "competencies_v6.competencyAreaName",
            "competencies_v6.competencyThemeName",
            "competencies_v6.competencySubThemeName"
          ],
          "query": nlpSearchQuery,
          "limit": 3,
          "offset": 0,
          "sort_by": {}
        }
      }
      this.searchV3Service.fetchSearchDataByCategory(catReq).subscribe((res: any) => {
        if(res) {
          this.updateRecentSearchQuery(query);
        }
      })

      const eventReq = {
        "request": {
          "filters": {
            "contentType": "Event",
            "status": [
              "Live"
            ]
          },
          "fields": [
            "name",
            "description",
            "identifier",
            "resourceType",
            "contentType",
            "sourceName",
            "duration",
            "startDate",
            "endDate",
            "startTime",
            "endTime",
            "createdOn",
            "eventType",
            "expiryDate",
            "appIcon",
            "startDateTime",
            "endDateTime"
          ],
          "facets": [
            "duration",
            "language",
            "sourceName",
            "startDateTimeInEpoch",
            "endDateTimeInEpoch",
            "resourceType",
            "competencies_v6.competencyAreaName",
            "competencies_v6.competencyThemeName",
            "competencies_v6.competencySubThemeName"
          ],
          "query": nlpSearchQuery,
          "limit": 3,
          "offset": 0,
          "sort_by": {}
        }
      }
      this.searchV3Service.fetchSearchDataByCategory(eventReq).subscribe((res: any) => {
        if (res) {
          this.updateRecentSearchQuery(query);
        }
      })

      const peopleReq = {
        filters: {},
        facets: [
          "profileDetails.professionalDetails.designation",
          "rootOrgName"
        ],
        fields: [],
        limit: 5,
        offset: 0,
        sort_by: {},
        query: nlpSearchQuery,
      }
      this.searchV3Service.searchConnections(peopleReq).catch()

      const resourceReq = {
        "request": {
            "filters": {
                "contentType": "Resource",
                "courseCategory": [],
                "status": [
                    "Live"
                ],
                "mimeType": [
                    "application/pdf",
                    "video/mp4",
                    "text/x-url",
                    "audio/mpeg",
                    "application/vnd.ekstep.content-collection"
                ]
            },
            "fields": [],
            "facets": [
                "resourceCategory",
                "sectorDetails_v1.subSectorName",
                "sectorDetails_v1.sectorName",
                "years"
            ],
            "query": query,
            "limit": 3,
            "offset": 0,
            "sort_by": {},
            "exists": [
                "sectorDetails_v1.sectorName",
                "resourceCategory"
            ]
        }
       
    }
    this.searchV3Service.fetchSearchDataByCategory(resourceReq).subscribe((res: any) => {
      if (res) {
        this.updateRecentSearchQuery(query);
      }
    })

    const communitiesreq = {
      "filterCriteriaMap": {
          "status": "active"
      },
      "requestedFields": [],
      "pageNumber": 0,
      "pageSize": 6,
      "facets": [
          "topicName",
          "orgName",
          "competencies_v6.competencyAreaName",
          "competencies_v6.competencyThemeName",
          "competencies_v6.competencySubThemeName"
      ],
      "searchString": nlpSearchQuery
  }
    this.searchV3Service.fetchSearchDataByCategory(communitiesreq).subscribe((res: any) => {
      if (res) {
        this.updateRecentSearchQuery(query);
      }
    })

    }
  }


  recentDeleteByUserId() {
    return this.searchV3Service.recentDeleteByUser().subscribe((result: any) => {
      if (result && result.responseCode === "OK") {
        this.readRecent()
      }
    })
  }

  recentDeleteByTimeStamp(id: any) {
    return this.searchV3Service.recentDeleteByTime(id).subscribe((result: any) => {
      if (result) {
        this.readRecent()
      }
    })
  }

    processRecentSearchText(query: any) {
    document.getElementById('global-search-input')?.blur();
    const queryParams = {
      q: query?.nlp_search_query ? query?.nlp_search_query?.trim() : '',
      // search: query && this.responseNlpQuery ? this.responseNlpQuery : null,
      category: query?.search_category[0] || null,
      p: null,
      f: null,
      tab: null,
      filtersPanel: 'show',
    };
    const navigationExtras = {
      queryParams,
      queryParamsHandling: 'merge' as 'merge',
    };
    const mergeQueryParams = window.location.pathname === '/app/globalsearch'
    if (this.ref === 'home') {
      this.closed.emit(false);
      this.router.navigate(['/app/globalsearch'], mergeQueryParams ? navigationExtras : { queryParams });
    } else {
      this.router.navigate([], { ...navigationExtras, relativeTo: this.activated.parent });
    }
    localStorage.removeItem('activeRoute');
    this.openSearchTemplate = false;
  }

  processSearchText(query: any) {
    document.getElementById('global-search-input')?.blur();
    const queryParams = {
      q: query ? query?.trim() : '',
      search: query && this.responseNlpQuery ? this.responseNlpQuery : null,
      category: this.selectedSearchCategory || null,
      p: null,
      f: null,
      tab: null,
      filtersPanel: 'show',
    };
    const navigationExtras = {
      queryParams,
      queryParamsHandling: 'merge' as 'merge',
    };
    const mergeQueryParams = window.location.pathname === '/app/globalsearch'
    if (this.ref === 'home') {
      this.closed.emit(false);
      this.router.navigate(['/app/globalsearch'], mergeQueryParams ? navigationExtras : { queryParams });
    } else {
      this.router.navigate([], { ...navigationExtras, relativeTo: this.activated.parent });
    }
    localStorage.removeItem('activeRoute');
    this.openSearchTemplate = false;
  }

  clearSearchText() {
    setTimeout(() => {
      this.openSearchTemplate = true;
    }, 0);
    this.queryControl.reset();
    this.updateQuery('');
  }

  async selectSearchCategory(category: string) {
    if (this.queryControl.value) {
      this.selectedSearchCategory = category;
      // this.searchFromQuery(this.queryControl.value);
      this.updateQuery(this.queryControl.value);
    }
  }

  async searchFromQuery(query: string) {
    let courseSearchResult: any;
    const searchRequest = new SearchV4Request([]);
    searchRequest.request.query = query;
    switch (this.selectedSearchCategory) {
      case SearchCategory.Courses:
        searchRequest.request.filters.courseCategory = 'course';
        break;
      case SearchCategory.All:
        searchRequest.request.filters.courseCategory = [];
        searchRequest.request.filters.contentType = ['Course', 'Event'];
        break;

      case SearchCategory.Programs:
        searchRequest.request.filters.courseCategory = 'blended program';
        break;

      case SearchCategory.Events:
        searchRequest.request.filters.contentType = 'Event';
        searchRequest.request.fields = SearchEventFields;
        searchRequest.request.facets = SearchEventfacet;

        delete searchRequest.request.filters?.courseCategory;
        delete searchRequest.request.sort_by?.createdOn;
        break;

      case SearchCategory.CaseStudy:
        searchRequest.request.filters.courseCategory = 'case study';
        break;

      case SearchCategory.Resources:
        searchRequest.request.filters.contentType = 'Resource';
        searchRequest.request.facets = SearchResourceFacets
        searchRequest.request.filters.mimeType = SearchResourceMimeType
        searchRequest.request.exists = [FacetType.sectorNames_v1, FacetType.resourceCategory],
          searchRequest.request.fields = [],
          delete searchRequest.request.filters?.courseCategory;
        delete searchRequest.request.sort_by?.createdOn;
        break;
    }

    courseSearchResult = await this.searchV3Service.searchCoursesv4(
      searchRequest
    ).catch();

    if (this.selectedSearchCategory === SearchCategory.People) {
      const searchRequest = new SearchPeoplesRequest();
      searchRequest.query = query;
      const result = await this.searchV3Service.searchConnections(
        searchRequest
      ).catch(() => (this.allSearchResults = []));

      if (result.result && result.result?.response?.content.length) {
        this.allSearchResults = result.result?.response?.content || [];
      } else {
        this.allSearchResults = [];
      }

      return;
    } else if (this.selectedSearchCategory === SearchCategory.Communities) {
      const searchRequestCommunities = new SearchCommunitiesRequest([]);
      searchRequestCommunities.searchString = query;
      const result = await this.searchV3Service
        .searchCommunity(searchRequestCommunities)
        .catch(() => (this.allSearchResults = []));
      if (
        result.result &&
        Object.keys(result.result).length > 0 &&
        result.result?.search_results?.data &&
        result.result?.search_results?.data.length
      ) {
        this.allSearchResults = result.result?.search_results?.data;
      } else {
        this.allSearchResults = [];
      }

      return;
    } else if (this.selectedSearchCategory === SearchCategory.ExternalContents) {
      const searchRequestExternal = new SearchExternalRequest([]);
      searchRequestExternal.searchString = query || '';
      const result = await this.searchV3Service
        .searchExternalContent(searchRequestExternal)
        .catch(() => (this.allSearchResults = []));
      if (
        result?.data &&
        result?.data.length
      ) {
        this.allSearchResults = result?.data;
      } else {
        this.allSearchResults = [];
      }

      return;
    }

    const validKeys = Object.keys(courseSearchResult?.result || {}).filter(
      (key) =>
        (key === 'Event' || key === 'content') &&
        Array.isArray(courseSearchResult.result[key]) &&
        courseSearchResult.result[key].length > 0
    );

    this.allSearchResults = validKeys.length
      ? courseSearchResult.result[validKeys[0]]
      : [];
  }

  getResultName(result: any): string {
    if (!result) {
      return '';
    }

    if (this.selectedSearchCategory === SearchCategory.People) {
      return result.personalDetails?.firstname ?? result.firstName ?? '';
    } else if (this.selectedSearchCategory === SearchCategory.Communities) {
      return result.communityName ?? '';
    } else {
      return result.name ?? '';
    }
  }

  redirectToContent(result: any) {
    this.openSearchTemplate = false;
    if (this.selectedSearchCategory === SearchCategory.People) {
      this.goToUserProfile(result);
    } else if (this.selectedSearchCategory === SearchCategory.Communities) {
      // TODO: Route community
    } else {
      this.getRedirectUrlData(result);
    }
  }

  goToUserProfile(user: any) {
    this.router.navigate(
      ['/app/person-profile', user.userId || user.id || user.wid],
      { fragment: 'profileInfo' }
    );
  }

  async getRedirectUrlData(content: any) {
    if (content && content.objectType === 'Event' && content.identifier) {
      this.router.navigate([`app/event-hub/home/${content.identifier}`]);
    } else {
      const urlData = await this.contSvc.getResourseLink(content);
      this.router.navigate([urlData.url], {
        queryParams: urlData.queryParams,
      });
    }
  }

  async searchInNLP(query: string) {
    const searchRequest = new SearchNLP();
    searchRequest.query = query;
    await this.searchV3Service
      .nlpSearch(searchRequest)
      .then(async (response) => {
        if (response?.data && response?.data?.keywords) {
          if (response?.data?.keywords.length > 0) {
            this.responseNlpQuery = response?.data?.keywords[0]?.keyword;
            this.createRecent(this.responseNlpQuery)
            this.readRecent();
          }
        } else {
          this.responseNlpQuery = '';
        }
      })
      .catch();
  }

  openSearchTemplateF() {
    this.openSearchTemplate = true;
    if (!this.hasReadRecentBeenCalled) {
      this.readRecent();
      this.hasReadRecentBeenCalled = true;
    }

    if(this.openSearchTemplate) {
       this.readRecent();
    }
    if (!this.selectedSearchCategory) {
      // this.searchFromQuery(this.responseNlpQuery);
    }
  }

   ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
