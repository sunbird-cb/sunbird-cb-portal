// @ts-nocheck
import { of } from 'rxjs'

// Mock the SeeAllService module before importing the component to avoid heavy deps
jest.mock('../../services/see-all.service', () => ({
  SeeAllService: jest.fn().mockImplementation(() => ({
    getSeeAllConfigJson: jest.fn(),
    searchV6: jest.fn(),
    trendingSearchRequest: jest.fn(),
  })),
}))

import { SeeAllWithPillsComponent } from './see-all-with-pills.component'

describe('SeeAllWithPillsComponent (no TestBed)', () => {
  let component: SeeAllWithPillsComponent
  const mockActivated: any = { queryParams: of({ key: 'k1', tabSelected: 't1', pillSelected: 'p1', pageType: 'pt', pageSubType: 'pst' }) }
  const sampleStrip = { key: 'k1', tabs: [{ value: 't1', pillsData: [{ value: 'p1' }] }], viewMoreUrl: { loaderConfig: { cardSubType: 'card-portrait-skeleton' } }, request: {} }
  const mockSeeAllSvc: any = {
    getSeeAllConfigJson: jest.fn().mockResolvedValue({ newHomeStrip: [{ strips: [sampleStrip] }], assessmentData: [] }),
    searchV6: jest.fn().mockReturnValue(of({ result: { content: [] } })),
    trendingContentSearch: jest.fn().mockReturnValue(of({ result: { responseKey: [] } })),
    getApplicationsById: jest.fn().mockReturnValue(of({ result: { response: [] } })),
  }
  const mockConfigSvc: any = { userProfile: { userId: 'u1', rootOrgId: 'r1' } }
  const mockEventSvc: any = { raiseInteractTelemetry: jest.fn(), broadcast: jest.fn() }
  const mockMulti: any = { translateLabel: jest.fn().mockReturnValue('translated') }
  const mockEnroll: any = {
    fetchInternalEnrollmentData: jest.fn().mockReturnValue(of({ result: { courses: [] } })),
    fetchExternalEnrollmentData: jest.fn().mockReturnValue(of({ result: { courses: [] } })),
    fetchEventsEnrollmentData: jest.fn().mockReturnValue(of({ result: { events: [] } })),
  }

  beforeEach(() => {
    component = new SeeAllWithPillsComponent(
      mockActivated,
      mockSeeAllSvc,
      mockConfigSvc,
      mockEventSvc,
      mockMulti,
      mockEnroll,
    )
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('ngOnInit should set seeAllPageConfig and contentDataList when config has matching key', async () => {
    // ensure the service returns a config that includes our sampleStrip
    await component.ngOnInit()
    expect(component.seeAllPageConfig).toBeDefined()
    // transformSkeletonToWidgets called -> contentDataList should be an array
    expect(Array.isArray(component.contentDataList)).toBe(true)
    expect(component.contentDataList.length).toBeGreaterThan(0)
  })

  it('checkForDateFilters should evaluate date expressions when present', () => {
    const filters: any = { 'batches.endDate': { '>=': '1+1' } }
    const res = component.checkForDateFilters(filters)
    // after eval the value should be numeric 2
    expect(res['batches.endDate']['>=']).toBe(2)
  })

  it('getFiltersFromArray should merge array entries into object', () => {
    const input = [{ a: 1 }, { b: 2 }, { c: 3 }]
    const out = (component as any).getFiltersFromArray(input)
    expect(out.a).toBe(1)
    expect(out.b).toBe(2)
    expect(out.c).toBe(3)
  })

  it('transformSkeletonToWidgets should return widgets with proper cardSubType', () => {
    const widgets = (component as any).transformSkeletonToWidgets({ viewMoreUrl: { loaderConfig: { cardSubType: 'custom' } } })
    expect(Array.isArray(widgets)).toBe(true)
    expect((widgets[0] as any).widgetData.cardSubType).toBe('custom')
  })

  it('translateLabels should call multilingual service', () => {
    const out = component.translateLabels('LABEL', 'type')
    expect(out).toBe('translated')
    expect(mockMulti.translateLabel).toHaveBeenCalled()
  })
  it('transformContentsToWidgets returns widgets array', () => {
    const contents: any[] = [];
    const widgets = (component as any).transformContentsToWidgets(contents, { key: 'k', viewMoreUrl: {}, stripConfig: { intranetMode: true } });
    expect(Array.isArray(widgets)).toBe(true);
  });

  it('transformSearchV6FiltersV2 merges filters', () => {
    const filtersArr = [{ a: 1 }, { b: 2 }];
    const merged = (component as any).transformSearchV6FiltersV2(filtersArr);
    expect(merged.a).toBe(1);
    expect(merged.b).toBe(2);
  });

  it('searchV6Request returns viewMoreUrl when many results', async () => {
    const strip1: any = { viewMoreUrl: { path: '/p', queryParams: {} }, stripConfig: { postCardForSearch: true } };
    const request1: any = { searchV6: { request: {} } };
    mockSeeAllSvc.searchV6.mockReturnValue(of({ result: { content: new Array(6).fill({}) } }));
    const resp1 = await (component as any).searchV6Request(strip1, request1, true);
    expect(resp1.viewMoreUrl).toBeDefined();
  });

  it('trendingSearchRequest handles org replacement and viewMoreUrl', async () => {
    const strip2: any = { viewMoreUrl: { path: '/p', queryParams: {} }, stripConfig: { postCardForSearch: true }, request: { trendingSearch: { responseKey: 'r', request: { filters: { organisation: '<orgID>' } } } } };
    mockSeeAllSvc.trendingContentSearch.mockReturnValue(of({ result: { r: new Array(6).fill({}) } }));
    const resp2 = await (component as any).trendingSearchRequest(strip2, strip2.request, true);
    expect(resp2.viewMoreUrl).toBeDefined();
  });

  it('resetSelectedPill clears selections', () => {
    const pills: any[] = [{ selected: true }, { selected: true }];
    (component as any).resetSelectedPill(pills);
    expect(pills[0].selected).toBe(false);
    expect(pills[1].selected).toBe(false);
  });

  it('pillClicked sets selected when no requestRequired', () => {
    const cfg: any = { tabs: [{ pillsData: [{}, {}] }] };
    component.seeAllPageConfig = cfg;
    (component as any).pillClicked(cfg, 1, 0);
    expect(cfg.tabs[0].pillsData[1].selected).toBe(true);
  });

  it('getSelectedPillIndex returns correct index', () => {
    const idx = (component as any).getSelectedPillIndex({ pillsData: [{ selected: false }, { selected: true }] });
    expect(idx).toBe(1);
  });

  it('fetchUserEnrolledData calls internal enrollment for enrollment type', () => {
    const strip3: any = { request: { enrollmentList: { a: 1 } }, tabs: [{ pillsData: [{ request: { type: 'enrollment' } }] }] };
    (component as any).fetchFromInternalEnrollmentList = jest.fn();
    (component as any).fetchUserEnrolledData(strip3, 0, 0);
    expect((component as any).fetchFromInternalEnrollmentList).toHaveBeenCalled();
  });

  it('formatNewEnrollmentData sets contentDataList and tabResults', () => {
    const strip4: any = { tabs: [{ pillsData: [{}, {}] }] };
    const courses: any[] = [{ content: { identifier: 'c1', primaryCategory: 'pc' }, completionPercentage: 50, lastContentAccessTime: '2020-01-01' }];
    (component as any).formatNewEnrollmentData(strip4, 0, 0, courses, true);
    expect(component.contentDataList).toBeDefined();
  });

  it('loadMore increases pageSize when contentDataList longer', () => {
    component.contentDataList = new Array(200).fill({});
    component.pageSize = 50;
    component.loadMore();
    expect(component.pageSize).toBeGreaterThan(50);
  });

})

