import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActivatedRoute } from '@angular/router'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { of, throwError } from 'rxjs'
import { SeeAllDynamicComponent } from './see-all-dynamic.component'
import { SeeAllService } from '../../services/see-all.service'

describe('SeeAllDynamicComponent', () => {
  let component: SeeAllDynamicComponent
  let fixture: ComponentFixture<SeeAllDynamicComponent>
  let mockSeeAllService: jasmine.SpyObj<SeeAllService>
  let mockActivatedRoute: any
  let mockTranslateService: jasmine.SpyObj<TranslateService>

  const mockConfig = {
    url: '/apis/proxies/v8/cios/v1/search/content',
    request: {
      filterCriteriaMap: { 'contentPartner.partnerCode': 'PEDGOG' },
      requestedFields: [],
      pageNumber: 0,
      pageSize: 10,
      facets: ['topic'],
      orderBy: 'createdOn',
      orderDirection: 'desc',
      searchString: ''
    }
  }

  const mockContent = [
    { id: 1, name: 'Content A', createdOn: '2024-01-01', avgRating: 4.5 },
    { id: 2, name: 'Content B', createdOn: '2024-01-02', avgRating: 3.8 },
    { id: 3, name: 'Content C', createdOn: '2024-01-03', avgRating: 4.2 },
  ]

  beforeEach(() => {
    mockSeeAllService = jasmine.createSpyObj('SeeAllService', [
      'getApiConfig',
      'fetchDynamicContent',
      'registerConfig'
    ])
    mockSeeAllService.getApiConfig.and.returnValue(mockConfig)

    mockActivatedRoute = {
      snapshot: {
        queryParams: {
          name: 'Test Content',
          key: 'ciosContent',
          provider: 'PEDGOG'
        }
      }
    }

    mockTranslateService = jasmine.createSpyObj('TranslateService', [
      'setDefaultLang',
      'use'
    ])

    TestBed.configureTestingModule({
      declarations: [SeeAllDynamicComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: SeeAllService, useValue: mockSeeAllService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: TranslateService, useValue: mockTranslateService }
      ]
    })

    fixture = TestBed.createComponent(SeeAllDynamicComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('ngOnInit', () => {
    it('should load configuration from URL parameters', () => {
      mockSeeAllService.fetchDynamicContent.and.returnValue(of({ content: mockContent }))

      fixture.detectChanges()

      expect(component.contentName).toBe('Test Content')
      expect(component.configKey).toBe('ciosContent')
      expect(component.filterProvider).toBe('PEDGOG')
    })

    it('should use default values if URL parameters are missing', () => {
      mockActivatedRoute.snapshot.queryParams = {}
      mockSeeAllService.fetchDynamicContent.and.returnValue(of({ content: mockContent }))

      fixture.detectChanges()

      expect(component.contentName).toBe('')
      expect(component.configKey).toBe('ciosContent')
      expect(component.filterProvider).toBe('PEDGOG')
    })

    it('should fetch content on initialization', () => {
      mockSeeAllService.fetchDynamicContent.and.returnValue(of({ content: mockContent }))

      fixture.detectChanges()

      expect(mockSeeAllService.fetchDynamicContent).toHaveBeenCalled()
    })
  })

  describe('loadConfiguration', () => {
    it('should load configuration from service', () => {
      component.configKey = 'ciosContent'
      component.loadConfiguration()

      expect(mockSeeAllService.getApiConfig).toHaveBeenCalledWith('ciosContent')
      expect(component.apiConfig).toEqual(mockConfig)
    })

    it('should update filter criteria with provider', () => {
      component.configKey = 'ciosContent'
      component.filterProvider = 'MYORG'
      component.loadConfiguration()

      expect(component.apiConfig.request.filterCriteriaMap['contentPartner.partnerCode']).toBe('MYORG')
    })

    it('should log error if configuration not found', () => {
      spyOn(console, 'error')
      mockSeeAllService.getApiConfig.and.returnValue(null)

      component.configKey = 'nonexistent'
      component.loadConfiguration()

      expect(console.error).toHaveBeenCalledWith('No configuration found for key:', 'nonexistent')
    })
  })

  describe('fetchContent', () => {
    beforeEach(() => {
      component.configKey = 'ciosContent'
      component.apiConfig = mockConfig
    })

    it('should fetch content successfully', (done) => {
      mockSeeAllService.fetchDynamicContent.and.returnValue(of({ content: mockContent }))

      component.fetchContent()

      setTimeout(() => {
        expect(component.contentItems).toEqual(mockContent)
        expect(component.loading).toBe(false)
        done()
      }, 0)
    })

    it('should handle different API response formats', (done) => {
      mockSeeAllService.fetchDynamicContent.and.returnValue(of({ result: { content: mockContent } }))

      component.fetchContent()

      setTimeout(() => {
        expect(component.contentItems).toEqual(mockContent)
        done()
      }, 0)
    })

    it('should handle API errors gracefully', (done) => {
      spyOn(console, 'error')
      mockSeeAllService.fetchDynamicContent.and.returnValue(throwError('API Error'))

      component.fetchContent()

      setTimeout(() => {
        expect(component.contentItems).toEqual([])
        expect(component.loading).toBe(false)
        expect(console.error).toHaveBeenCalled()
        done()
      }, 0)
    })

    it('should set loading to true during fetch', () => {
      mockSeeAllService.fetchDynamicContent.and.returnValue(of({ content: mockContent }))

      expect(component.loading).toBe(false)
      component.fetchContent()
      expect(component.loading).toBe(true)
    })

    it('should update search string in request', () => {
      mockSeeAllService.fetchDynamicContent.and.returnValue(of({ content: mockContent }))
      component.searchString = 'test search'

      component.fetchContent()

      expect(mockSeeAllService.fetchDynamicContent).toHaveBeenCalled()
    })
  })

  describe('applySort', () => {
    beforeEach(() => {
      component.contentItems = [...mockContent]
    })

    it('should sort by name ascending', () => {
      component.sortKey = 'name'
      component.sortOrder = 'asc'

      component.applySort()

      expect(component.contentItems[0].name).toBe('Content A')
      expect(component.contentItems[2].name).toBe('Content C')
    })

    it('should sort by name descending', () => {
      component.sortKey = 'name'
      component.sortOrder = 'desc'

      component.applySort()

      expect(component.contentItems[0].name).toBe('Content C')
      expect(component.contentItems[2].name).toBe('Content A')
    })

    it('should sort by rating', () => {
      component.sortKey = 'avgRating'
      component.sortOrder = 'desc'

      component.applySort()

      expect(component.contentItems[0].avgRating).toBe(4.5)
    })

    it('should sort by date', () => {
      component.sortKey = 'createdOn'
      component.sortOrder = 'desc'

      component.applySort()

      expect(component.contentItems[0].createdOn).toBe('2024-01-03')
    })

    it('should reset pagination after sort', () => {
      component.sortKey = 'name'
      component.sortOrder = 'asc'
      component.currentPage = 5

      component.applySort()

      expect(component.currentPage).toBe(1)
    })
  })

  describe('setSort', () => {
    it('should toggle sort order when key is same', () => {
      component.sortKey = 'name'
      component.sortOrder = 'asc'

      component.setSort('name')

      expect(component.sortOrder).toBe('desc')
    })

    it('should change sort key and reset to asc when different key', () => {
      component.sortKey = 'name'
      component.sortOrder = 'desc'

      component.setSort('rating')

      expect(component.sortKey).toBe('rating')
      expect(component.sortOrder).toBe('asc')
    })
  })

  describe('pagination', () => {
    beforeEach(() => {
      component.contentItems = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`
      }))
    })

    it('should set correct page data', () => {
      component.initialPaginationSize = 10

      component.setPage(1)

      expect(component.pagedItems.length).toBe(10)
      expect(component.pagedItems[0].id).toBe(1)
    })

    it('should calculate total pages correctly', () => {
      component.initialPaginationSize = 10

      component.setPage(1)

      expect(component.totalPages).toBe(3)
    })

    it('should handle last page with fewer items', () => {
      component.initialPaginationSize = 10

      component.setPage(3)

      expect(component.pagedItems.length).toBe(5)
    })

    it('should update pagination on page change', () => {
      component.initialPaginationSize = 10

      component.onPageChange({ currentPage: 2, limit: 10 })

      expect(component.currentPage).toBe(2)
    })

    it('should update page size on pagination change', () => {
      component.onPageChange({ currentPage: 1, limit: 20 })

      expect(component.initialPaginationSize).toBe(20)
    })
  })

  describe('sort search options', () => {
    beforeEach(() => {
      component.contentItems = [...mockContent]
    })

    it('should handle most_relevant sort', () => {
      component.onChangeSortSearch('most_relevant')
      // Most relevant doesn't change sort
      expect(component.sortKey).toBeDefined()
    })

    it('should handle recently_added_newest sort', () => {
      component.onChangeSortSearch('recently_added_newest')
      expect(component.sortKey).toBe('createdOn')
      expect(component.sortOrder).toBe('desc')
    })

    it('should handle highest_rated sort', () => {
      component.onChangeSortSearch('highest_rated')
      expect(component.sortKey).toBe('avgRating')
      expect(component.sortOrder).toBe('desc')
    })

    it('should handle a-z sort', () => {
      component.onChangeSortSearch('a-z')
      expect(component.sortKey).toBe('name')
      expect(component.sortOrder).toBe('asc')
    })

    it('should handle z-a sort', () => {
      component.onChangeSortSearch('z-a')
      expect(component.sortKey).toBe('name')
      expect(component.sortOrder).toBe('desc')
    })
  })

  describe('search functionality', () => {
    it('should update search string and fetch content', () => {
      mockSeeAllService.fetchDynamicContent.and.returnValue(of({ content: mockContent }))

      component.onSearch('new search term')

      expect(component.searchString).toBe('new search term')
      expect(mockSeeAllService.fetchDynamicContent).toHaveBeenCalled()
    })
  })

  describe('ngOnDestroy', () => {
    it('should complete destroy subject', () => {
      spyOn(component['destroy$'], 'next')
      spyOn(component['destroy$'], 'complete')

      component.ngOnDestroy()

      expect(component['destroy$'].next).toHaveBeenCalled()
      expect(component['destroy$'].complete).toHaveBeenCalled()
    })
  })
})
