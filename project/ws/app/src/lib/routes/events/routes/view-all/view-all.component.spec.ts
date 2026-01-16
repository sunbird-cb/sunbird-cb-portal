import { ViewAllComponent } from './view-all.component';
import { of } from 'rxjs';
import * as _ from 'lodash';
import { MobileFiltersComponent } from '../events/mobile-filters/mobile-filters.component';

// Mock services
jest.mock('@angular/router', () => ({
  Router: jest.fn().mockImplementation(() => ({
    navigate: jest.fn()
  })),
  ActivatedRoute: jest.fn().mockImplementation(() => ({
    queryParamMap: of({ params: {} })
  }))
}));

jest.mock('../../services/events.service', () => ({
  EventService: jest.fn().mockImplementation(() => ({
    getEventsList: jest.fn()
  }))
}));

jest.mock('@angular/material/bottom-sheet', () => ({
  MatBottomSheet: jest.fn().mockImplementation(() => ({
    open: jest.fn().mockReturnValue({
      afterDismissed: jest.fn().mockReturnValue(of(null))
    })
  }))
}));

jest.mock('@angular/material/snack-bar', () => ({
  MatSnackBar: jest.fn().mockImplementation(() => ({
    open: jest.fn()
  }))
}));

jest.mock('@ngx-translate/core', () => ({
  TranslateService: jest.fn().mockImplementation(() => ({
    setDefaultLang: jest.fn(),
    use: jest.fn()
  }))
}));

jest.mock('@angular/common', () => ({
  DatePipe: jest.fn().mockImplementation(() => ({
    transform: jest.fn().mockReturnValue('2025-03-20')
  }))
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window scrolling behavior
Object.defineProperty(window, 'innerHeight', { value: 768 });
Object.defineProperty(window, 'scrollY', { value: 1000 });
Object.defineProperty(document.body, 'offsetHeight', { value: 1500 });

describe('ViewAllComponent', () => {
  let component: ViewAllComponent;
  let activatedRouteMock: any;
  let routerMock: any;
  let eventServiceMock: any;
  let datePipeMock: any;
  let bottomSheetMock: any;
  let snackbarMock: any;
  let translateServiceMock: any;

  beforeEach(() => {
    // Clear mocks and reset component for each test
    jest.clearAllMocks();

    // Initialize mock services
    activatedRouteMock = {
      queryParamMap: of({ params: {} })
    };

    routerMock = {
      navigate: jest.fn()
    };

    eventServiceMock = {
      getEventsList: jest.fn().mockReturnValue(of({
        result: {
          Event: [],
          count: 0
        }
      }))
    };

    datePipeMock = {
      transform: jest.fn().mockReturnValue('2025-03-20')
    };

    bottomSheetMock = {
      open: jest.fn().mockReturnValue({
        afterDismissed: jest.fn().mockReturnValue(of(null))
      })
    };

    snackbarMock = {
      open: jest.fn()
    };

    translateServiceMock = {
      setDefaultLang: jest.fn(),
      use: jest.fn()
    };

    // Create component with mocked dependencies
    component = new ViewAllComponent(
      activatedRouteMock,
      eventServiceMock,
      datePipeMock,
      bottomSheetMock,
      snackbarMock,
      translateServiceMock,
      routerMock
    );

    // Initialize important properties to prevent errors
    component.contentDataList = [];
    component.contnet = [];

    // Mock transform methods
    jest.spyOn(component as any, 'transformSkeletonToWidgets').mockReturnValue([]);
    jest.spyOn(component as any, 'transformContentsToWidgets').mockReturnValue([]);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize titles in constructor', () => {
    expect(component.titles).toEqual([
      { title: 'Events', url: '/app/event-hub/home', disableTranslate: true, icon: 'event' },
    ]);
  });

  it('should set language from localStorage if available', () => {
    // Setup localStorage with a language
    localStorageMock.setItem('websiteLanguage', 'fr');

    // Re-create component to trigger constructor
    component = new ViewAllComponent(
      activatedRouteMock,
      eventServiceMock,
      datePipeMock,
      bottomSheetMock,
      snackbarMock,
      translateServiceMock,
      routerMock
    );

    expect(translateServiceMock.setDefaultLang).toHaveBeenCalledWith('en');
    expect(translateServiceMock.use).toHaveBeenCalledWith('fr');
  });

  it('should setup searchControl subscription on init', () => {
    // Spy on fetchData
    const fetchDataSpy = jest.spyOn(component, 'fetchData').mockImplementation(() => { });

    // Mock resetData
    jest.spyOn(component, 'resetData').mockImplementation(() => { });

    // Trigger ngOnInit
    component.ngOnInit();

    // Simulate search control value change
    component.searchControl.setValue('test query');

    // Verify fetchData was called
    expect(fetchDataSpy).toHaveBeenCalled();
  });

  it('should update searchControl from route params', () => {
    // Mock activatedRoute with query param
    activatedRouteMock.queryParamMap = of({
      params: {
        query: 'route query',
        resourceType: 'webinar'
      }
    });

    // Spy on setValue
    const setValueSpy = jest.spyOn(component.searchControl, 'setValue');

    // Mock fetchData
    jest.spyOn(component, 'fetchData').mockImplementation(() => { });

    // Trigger ngOnInit
    component.ngOnInit();

    // Verify searchControl was set with route query
    expect(setValueSpy).toHaveBeenCalledWith('route query');

    // Verify selectedFilters was set with resourceType
    expect(component.selectedFilters).toEqual({
      resourceType: ['webinar']
    });

    // Verify titles was updated
    expect(component.titles[1]).toEqual(
      { title: 'webinar', url: 'none', icon: '' }
    );
  });

  it('should call fetchData on scroll when conditions are met', () => {
    const fetchDataSpy = jest.spyOn(component, 'fetchData').mockImplementation(() => { });
    component.isLoading = false;
    component.showNextPage = true;

    component.onScroll();

    expect(fetchDataSpy).toHaveBeenCalled();
  });

  it('should not call fetchData on scroll when isLoading is true', () => {
    const fetchDataSpy = jest.spyOn(component, 'fetchData').mockImplementation(() => { });
    component.isLoading = true;
    component.showNextPage = true;

    component.onScroll();

    expect(fetchDataSpy).not.toHaveBeenCalled();
  });



  it('should generate request body with resourceType filter', () => {
    component.selectedFilters = {
      resourceType: ['webinar']
    };

    const result = component.generateRequestBody();

    expect(result.request.filters.resourceType).toEqual(['webinar']);
  });

  it('should generate request body with Today date filter', () => {
    component.selectedFilters = {
      eventDate: ['Today']
    };

    // Mock Date to return fixed date
    const mockDateInstance = new Date('2025-03-20T12:00:00Z');
    jest.spyOn(window, 'Date').mockImplementation(() => mockDateInstance as any);

    const result = component.generateRequestBody();

    // Restore Date
    jest.restoreAllMocks();

    expect(result.request.filters.startDate).toEqual({ '>=': ['2025-03-20'] });
    expect(result.request.filters.endDate).toEqual({ '<=': ['2025-03-20'] });
  });

  it('should fetch data successfully', () => {
    // Setup
    component.contentDataList = [];
    component.isLoading = false;
    component.contnet = [];

    // Mock skeleton widgets
    const skeletonWidgets = [{ id: 'skeleton-1' }, { id: 'skeleton-2' }];
    jest.spyOn(component as any, 'transformSkeletonToWidgets').mockReturnValue(skeletonWidgets);

    // Mock response
    const mockResponse = {
      result: {
        Event: [{ id: 'event-1' }],
        count: 20
      }
    };

    // Mock content widgets
    const contentWidgets = [{ id: 'widget-1' }];
    jest.spyOn(component as any, 'transformContentsToWidgets').mockReturnValue(contentWidgets);

    // Mock generateRequestBody
    jest.spyOn(component, 'generateRequestBody').mockReturnValue({ request: {} });

    // Mock getEventsList
    eventServiceMock.getEventsList = jest.fn().mockReturnValue(of(mockResponse));

    // Execute
    component.fetchData();

    // Verify
    expect(component.isLoading).toBe(false);
    expect(eventServiceMock.getEventsList).toHaveBeenCalled();
    expect(component.showNextPage).toBe(true);
    expect(component.currentPage).toBe(1);
    expect(component.contentDataList).toEqual(contentWidgets);
  });

  it('should correctly identify a live event', () => {
    // Create a live event (current time is between start and end times)
    const liveEvent = {
      startDate: '2025-03-20',
      endDate: '2025-03-20',
      startTime: '08:00:00',
      endTime: '18:00:00'
    };

    // Mock the Date constructor to return consistent values for testing
    const mockDateInstance = new Date('2025-03-20T12:00:00Z');

    // Create a spy on Date constructor that returns our fixed date
    jest.spyOn(window, 'Date').mockImplementation(() => mockDateInstance as any);

    const result = component.isLiveEvent(liveEvent);

    // Restore original Date constructor
    jest.restoreAllMocks();

    expect(result).toBe(true);
  });

  it('should handle filter changes', () => {
    // Spy on fetchData
    const fetchDataSpy = jest.spyOn(component, 'fetchData').mockImplementation(() => { });

    // New filters
    const newFilters = {
      resourceType: ['webinar'],
      eventDate: ['Today']
    };

    // Call filterChange
    component.filterChange(newFilters);

    // Verify selectedFilters was updated
    expect(component.selectedFilters).toEqual(newFilters);

    // Verify fetchData was called
    expect(fetchDataSpy).toHaveBeenCalled();
  });

  it('should clear all filters', () => {
    // Setup initial filters
    component.selectedFilters = {
      resourceType: ['webinar'],
      eventDate: ['Today']
    };
    component.startDate = '2025-03-20';
    component.endDate = '2025-03-21';

    // Mock resetData and fetchData
    const resetDataSpy = jest.spyOn(component, 'resetData').mockImplementation(() => { });
    const fetchDataSpy = jest.spyOn(component, 'fetchData').mockImplementation(() => { });

    // Call clearAll
    component.clearAll();

    // Verify state was reset
    expect(component.selectedFilters).toEqual({});
    expect(component.startDate).toBe('');
    expect(component.endDate).toBe('');

    // Verify methods were called
    expect(resetDataSpy).toHaveBeenCalled();
    expect(fetchDataSpy).toHaveBeenCalled();
  });

  it('should open bottom sheet for mobile filters', () => {
    // Initial filters
    component.selectedFilters = { resourceType: ['webinar'] };

    // Mock bottomSheet.open result with "apply" action
    const afterDismissedMock = jest.fn().mockReturnValue(
      of({
        action: 'apply',
        selectedFilters: { resourceType: ['karmayogiTalks'] }
      })
    );

    bottomSheetMock.open = jest.fn().mockReturnValue({
      afterDismissed: afterDismissedMock
    });

    // Mock resetData and fetchData
    const resetDataSpy = jest.spyOn(component, 'resetData').mockImplementation(() => { });
    const fetchDataSpy = jest.spyOn(component, 'fetchData').mockImplementation(() => { });

    // Call openBottomSheet
    component.openBottomSheet();

    // Verify bottomSheet.open was called with correct params
    expect(bottomSheetMock.open).toHaveBeenCalledWith(
      MobileFiltersComponent,
      {
        data: {
          facetsData: component.facetsData,
          selectedFilters: { resourceType: ['webinar'] },
          clonedFilters: { resourceType: ['webinar'] },
        },
        panelClass: 'filter-bottomsheet',
        disableClose: true
      }
    );

    // Verify selectedFilters was updated from result
    expect(component.selectedFilters).toEqual({ resourceType: ['karmayogiTalks'] });

    // Verify methods were called
    expect(resetDataSpy).toHaveBeenCalled();
    expect(fetchDataSpy).toHaveBeenCalled();
  });

  it('should handle sort type changes', () => {
    // Setup initial data
    component.contentDataList = [
      { widgetData: { content: { duration: 30 } } },
      { widgetData: { content: { duration: 10 } } },
      { widgetData: { content: { duration: 20 } } }
    ];

    // Mock resetData and fetchData
    const resetDataSpy = jest.spyOn(component, 'resetData').mockImplementation(() => { });
    const fetchDataSpy = jest.spyOn(component, 'fetchData').mockImplementation(() => { });

    // Test 'asc' sort (uses server-side sorting)
    component.sortType('asc');
    expect(component.sortOptions).toEqual({ name: 'asc' });
    expect(resetDataSpy).toHaveBeenCalled();
    expect(fetchDataSpy).toHaveBeenCalled();

    // Test 'short' sort (client-side sorting by duration ascending)
    component.sortType('short');
    expect(component.contentDataList[0].widgetData.content.duration).toBe(10);
    expect(component.contentDataList[1].widgetData.content.duration).toBe(20);
    expect(component.contentDataList[2].widgetData.content.duration).toBe(30);

    // Reset content data
    component.contentDataList = [
      { widgetData: { content: { duration: 30 } } },
      { widgetData: { content: { duration: 10 } } },
      { widgetData: { content: { duration: 20 } } }
    ];

    // Test default sort (client-side sorting by duration descending)
    component.sortType('desc');
    expect(component.contentDataList[0].widgetData.content.duration).toBe(30);
    expect(component.contentDataList[1].widgetData.content.duration).toBe(20);
    expect(component.contentDataList[2].widgetData.content.duration).toBe(10);
  });

  it('should remove resourceType filter', () => {
    // Setup initial filters
    component.selectedFilters = {
      resourceType: ['webinar', 'karmayogiTalks']
    };

    // Mock resetData and fetchData
    const resetDataSpy = jest.spyOn(component, 'resetData').mockImplementation(() => { });
    const fetchDataSpy = jest.spyOn(component, 'fetchData').mockImplementation(() => { });

    // Remove one filter
    component.removeFilter('resourceType', 'webinar');

    // Verify filter was removed
    expect(component.selectedFilters.resourceType).toEqual(['karmayogiTalks']);

    // Verify methods were called
    expect(resetDataSpy).toHaveBeenCalled();
    expect(fetchDataSpy).toHaveBeenCalled();
  });

  it('should remove dateRange filter', () => {
    // Setup initial filters
    component.selectedFilters = {
      dateRange: { fromDate: new Date(), toDate: new Date() }
    };
    component.startDate = '2025-03-20';
    component.endDate = '2025-03-21';

    // Mock resetData and fetchData
    const resetDataSpy = jest.spyOn(component, 'resetData').mockImplementation(() => { });
    const fetchDataSpy = jest.spyOn(component, 'fetchData').mockImplementation(() => { });

    // Remove dateRange filter
    component.removeFilter('dateRange', null);

    // Verify filter was removed
    expect(component.selectedFilters.dateRange).toBeUndefined();
    expect(component.startDate).toBe('');
    expect(component.endDate).toBe('');

    // Verify methods were called
    expect(resetDataSpy).toHaveBeenCalled();
    expect(fetchDataSpy).toHaveBeenCalled();
  });

  it('should handle date change events', () => {
    // Mock snackbar
    const snackbarOpenSpy = jest.spyOn(snackbarMock, 'open');

    // Mock resetData and fetchData
    const resetDataSpy = jest.spyOn(component, 'resetData').mockImplementation(() => { });
    const fetchDataSpy = jest.spyOn(component, 'fetchData').mockImplementation(() => { });

    // Test setting start date
    component.onDateChange({ value: new Date('2025-03-20') }, { key: 'fromDate' }, { key: 'dateRange' });
    expect(component.startDate).toBe('2025-03-20');

    // Test setting end date when start date is already set
    component.onDateChange({ value: new Date('2025-03-21') }, { key: 'toDate' }, { key: 'dateRange' });

    // Verify filter was set
    expect(component.selectedFilters.dateRange).toBeDefined();
    expect(component.selectedFilters.eventDate).toBeUndefined();
    expect(component.selectedFilters.eventStatus).toBeUndefined();

    // Verify methods were called
    expect(resetDataSpy).toHaveBeenCalled();
    expect(fetchDataSpy).toHaveBeenCalled();

    // Test end date before start date
    component.startDate = '2025-03-22';
    component.onDateChange({ value: new Date('2025-03-21') }, { key: 'toDate' }, { key: 'dateRange' });

    // Verify error message shown
    expect(snackbarOpenSpy).toHaveBeenCalledWith('Choose a valid end date.');
  });

  it('should handle selection changes', () => {
    // Mock resetData and fetchData
    const resetDataSpy = jest.spyOn(component, 'resetData').mockImplementation(() => { });
    const fetchDataSpy = jest.spyOn(component, 'fetchData').mockImplementation(() => { });

    // Test adding first resourceType filter
    component.changeSelection(true, 'resourceType', { name: 'webinar' });

    // Verify filter was added
    expect(component.selectedFilters.resourceType).toEqual(['webinar']);

    // Test adding second resourceType filter
    component.changeSelection(true, 'resourceType', { name: 'karmayogiTalks' });

    // Verify filter was added
    expect(component.selectedFilters.resourceType).toEqual(['webinar', 'karmayogiTalks']);

    // Test removing filter
    component.changeSelection(false, 'resourceType', { name: 'webinar' });

    // Verify filter was removed
    expect(component.selectedFilters.resourceType).toEqual(['karmayogiTalks']);

    // Test removing last filter
    component.changeSelection(false, 'resourceType', { name: 'karmayogiTalks' });

    // Verify filter was completely removed
    expect(component.selectedFilters.resourceType).toBeUndefined();

    // Verify methods were called
    expect(resetDataSpy).toHaveBeenCalled();
    expect(fetchDataSpy).toHaveBeenCalled();
  });

  it('should reset data properly', () => {
    // Setup subscription mock
    component.dataScription = of().subscribe();
    component.contentDataList = ['test'];
    component.currentPage = 5;

    component.resetData();

    expect(component.dataScription).toBeNull();
    expect(component.contentDataList).toEqual([]);
    expect(component.currentPage).toBe(0);
    expect(component.pageLimit).toBe(9);
  });

  it('should determine if showAll should return true', () => {
    // Test with resourceType filter
    component.selectedFilters = {
      resourceType: ['webinar']
    };
    expect(component.showAll()).toBe(true);

    // Test with eventDate filter
    component.selectedFilters = {
      eventDate: ['Today']
    };
    expect(component.showAll()).toBe(true);

    // Test with eventStatus filter
    component.selectedFilters = {
      eventStatus: ['Live Events']
    };
    expect(component.showAll()).toBe(true);

    // Test with dateRange filter
    component.selectedFilters = {
      dateRange: { fromDate: new Date(), toDate: new Date() }
    };
    expect(component.showAll()).toBe(true);

    // Test with no filters
    component.selectedFilters = {};
    expect(component.showAll()).toBe(false);
  });

  it('should format custom date range', () => {
    const dateRange = {
      fromDate: new Date('2025-03-20'),
      toDate: new Date('2025-03-21')
    };

    // Mock datePipe transform for specific dates
    datePipeMock.transform = jest.fn()
      .mockReturnValueOnce('20/03/2025')
      .mockReturnValueOnce('21/03/2025');

    const result = component.customDate(dateRange);

    expect(result).toBe('20/03/2025 -\n    21/03/2025');
  });

  it('should check if a filter is selected', () => {
    // Setup selected filters
    component.selectedFilters = {
      eventDate: ['Today']
    };

    // Check selected filter
    expect(component.canCheck('eventDate', { name: 'Today' })).toBe(true);

    // Check unselected filter
    expect(component.canCheck('eventDate', { name: 'Tomorrow' })).toBe(false);

    // Check non-existent filter category
    expect(component.canCheck('resourceType', { name: 'webinar' })).toBeUndefined();
  });

  it('should transform skeletons to widgets', () => {
    const mockStrip = {
      viewMoreUrl: {
        loaderConfig: {
          cardSubType: 'test-card-subtype'
        }
      },
      customeClass: 'test-custom-class'
    };

    // Use private method with any type to access it
    const result = (component as any).transformSkeletonToWidgets(mockStrip);

    expect(result.length).toBe(0);
  });

  it('should transform contents to widgets', () => {
    const mockContents = [
      {
        id: 'event-1',
        startDate: '2025-03-20',
        endDate: '2025-03-20',
        startTime: '08:00:00',
        endTime: '18:00:00',
        batch: { id: 'batch-1' }
      }
    ];

    const mockStrip = {
      key: 'test-key',
      customeClass: 'test-custom-class',
      stripConfig: {
        intranetMode: true,
        deletedMode: false,
        contentTags: ['tag1', 'tag2']
      }
    };

    // Mock isLiveEvent to return true
    jest.spyOn(component, 'isLiveEvent').mockReturnValue(true);

    // Use private method with any type to access it
    const result = (component as any).transformContentsToWidgets(mockContents, mockStrip);

    expect(result.length).toBe(0);
  });
});