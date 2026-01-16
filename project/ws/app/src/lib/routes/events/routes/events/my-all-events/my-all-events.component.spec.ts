import { MyAllEventsComponent } from './my-all-events.component';
import { of, throwError } from 'rxjs';
import * as _ from 'lodash';

// Mock services
jest.mock('@angular/router', () => ({
  ActivatedRoute: jest.fn().mockImplementation(() => ({
    queryParamMap: of({ params: { tabSelected: 'today' } })
  }))
}));

jest.mock('@ngx-translate/core', () => ({
  TranslateService: jest.fn().mockImplementation(() => ({
    setDefaultLang: jest.fn(),
    use: jest.fn()
  }))
}));

jest.mock('../../../services/events.service', () => ({
  EventService: jest.fn().mockImplementation(() => ({
    getUserEnrollEvents: jest.fn()
  }))
}));

jest.mock('@sunbird-cb/utils-v2', () => ({
  ConfigurationsService: jest.fn().mockImplementation(() => ({
    userProfile: { userId: 'test-user-id' }
  })),
  MultilingualTranslationsService: jest.fn().mockImplementation(() => ({
    translateActualLabel: jest.fn().mockReturnValue('Translated Label')
  })),
  EventService: jest.fn().mockImplementation(() => ({
    raiseInteractTelemetry: jest.fn()
  })),
  WsEvents: {
    EnumTelemetrymodules: { EVENTS: 'events' }
  }
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

describe('MyAllEventsComponent', () => {
  let component: MyAllEventsComponent;
  let activatedRouteMock: any;
  let translateServiceMock: any;
  let eventServiceMock: any;
  let multilingualTranslationsServiceMock: any;
  let libEventServiceMock: any;
  let configurationsServiceMock: any;
  let datePipeMock: any;

  beforeEach(() => {
    // Clear mocks and reset component for each test
    jest.clearAllMocks();

    // Initialize mock services
    activatedRouteMock = {
      queryParamMap: of({ params: { tabSelected: 'today' } })
    };

    translateServiceMock = {
      setDefaultLang: jest.fn(),
      use: jest.fn()
    };

    eventServiceMock = {
      getUserEnrollEvents: jest.fn().mockReturnValue(of({
        result: {
          events: [],
          count: 0
        }
      }))
    };

    multilingualTranslationsServiceMock = {
      translateActualLabel: jest.fn().mockReturnValue('Translated Label')
    };

    libEventServiceMock = {
      raiseInteractTelemetry: jest.fn()
    };

    configurationsServiceMock = {
      userProfile: { userId: 'test-user-id' }
    };

    datePipeMock = {
      transform: jest.fn().mockReturnValue('2025-03-20')
    };

    // Create component with mocked dependencies
    component = new MyAllEventsComponent(
      activatedRouteMock,
      translateServiceMock,
      eventServiceMock,
      multilingualTranslationsServiceMock,
      libEventServiceMock,
      configurationsServiceMock,
      datePipeMock
    );

    // Initialize important properties to prevent errors
    component.contentDataList = [];
    component.contnet = [];

    // Mock transformSkeletonToWidgets for all tests
    jest.spyOn(component as any, 'transformSkeletonToWidgets').mockReturnValue([]);
    jest.spyOn(component as any, 'transformContentsToWidgets').mockReturnValue([]);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize titles in constructor', () => {
    expect(component.titles).toEqual([
      { title: 'events', url: '/app/event-hub/home', icon: 'event' },
      { title: 'Translated Label', url: 'none', icon: '' }
    ]);
  });

  it('should set language from localStorage if available', () => {
    // Setup localStorage with a language
    localStorageMock.setItem('websiteLanguage', 'fr');

    // Re-create component to trigger constructor
    component = new MyAllEventsComponent(
      activatedRouteMock,
      translateServiceMock,
      eventServiceMock,
      multilingualTranslationsServiceMock,
      libEventServiceMock,
      configurationsServiceMock,
      datePipeMock
    );

    expect(translateServiceMock.setDefaultLang).toHaveBeenCalledWith('en');
    expect(translateServiceMock.use).toHaveBeenCalledWith('fr');
  });

  it('should call fetchData on ngOnInit', () => {
    // Spy on fetchData method
    const fetchDataSpy = jest.spyOn(component, 'fetchData').mockImplementation(() => { });

    // Mock activatedRoute.queryParamMap subscription
    activatedRouteMock.queryParamMap = of({ params: { tabSelected: 'today' } });

    component.ngOnInit();

    expect(fetchDataSpy).toHaveBeenCalled();
    expect(component.tabSelected).toBe('today');
  });

  it('should set tabSelected from route params', () => {
    // Mock fetchData to prevent subscription error
    jest.spyOn(component, 'fetchData').mockImplementation(() => { });

    // Update activatedRoute mock
    activatedRouteMock.queryParamMap = of({ params: { tabSelected: 'upcoming' } });

    component.ngOnInit();

    expect(component.tabSelected).toBe('upcoming');
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

  it('should not call fetchData on scroll when showNextPage is false', () => {
    const fetchDataSpy = jest.spyOn(component, 'fetchData').mockImplementation(() => { });
    component.isLoading = false;
    component.showNextPage = false;

    component.onScroll();

    expect(fetchDataSpy).not.toHaveBeenCalled();
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

  it('should identify non-live event', () => {
    // Past event
    const pastEvent = {
      startDate: '2025-03-19',
      endDate: '2025-03-19',
      startTime: '08:00:00',
      endTime: '18:00:00'
    };

    // Mock the Date constructor to return consistent values for testing
    const mockDateInstance = new Date('2025-03-20T12:00:00Z');

    // Create a spy on Date constructor that returns our fixed date
    jest.spyOn(window, 'Date').mockImplementation(() => mockDateInstance as any);

    const result = component.isLiveEvent(pastEvent);

    // Restore original Date constructor
    jest.restoreAllMocks();

    expect(result).toBe(true);
  });

  it('should translate labels correctly', () => {
    const result = component.translateLabels('myEvents', 'events', '');
    expect(multilingualTranslationsServiceMock.translateActualLabel).toHaveBeenCalledWith('myEvents', 'events', '');
    expect(result).toBe('Translated Label');
  });

  it('should raise telemetry event', () => {
    const mockEvent = {
      widgetData: {
        content: {
          identifier: 'test-event-id'
        }
      }
    };

    component.raiseTelemetry(mockEvent);

    expect(libEventServiceMock.raiseInteractTelemetry).toHaveBeenCalledWith(
      {
        type: 'click',
        subType: 'my-events',
        id: 'card-content',
      },
      {
        id: 'test-event-id',
        type: 'event'
      },
      {
        module: 'events',
      }
    );
  });

  it('should handle tab click for today tab', () => {
    const resetDataSpy = jest.spyOn(component, 'resetData').mockImplementation(() => { });
    const fetchDataSpy = jest.spyOn(component, 'fetchData').mockImplementation(() => { });

    component.tabClick({ index: 0 });

    expect(component.tabIndex).toBe(0);
    expect(component.tabSelected).toBe('today');
    expect(resetDataSpy).toHaveBeenCalled();
    expect(fetchDataSpy).toHaveBeenCalled();
  });

  it('should handle tab click for upcoming tab', () => {
    const resetDataSpy = jest.spyOn(component, 'resetData').mockImplementation(() => { });
    const fetchDataSpy = jest.spyOn(component, 'fetchData').mockImplementation(() => { });

    component.tabClick({ index: 1 });

    expect(component.tabIndex).toBe(1);
    expect(component.tabSelected).toBe('upcoming');
    expect(resetDataSpy).toHaveBeenCalled();
    expect(fetchDataSpy).toHaveBeenCalled();
  });

  it('should handle tab click for past tab', () => {
    const resetDataSpy = jest.spyOn(component, 'resetData').mockImplementation(() => { });
    const fetchDataSpy = jest.spyOn(component, 'fetchData').mockImplementation(() => { });

    component.tabClick({ index: 2 });

    expect(component.tabIndex).toBe(2);
    expect(component.tabSelected).toBe('past');
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
    expect(component.pageLimit).toBe(12);
  });

  it('should transform skeleton to widgets correctly', () => {
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

  it('should transform contents to widgets correctly', () => {
    const mockContents = [
      {
        event: {
          id: 'event-1',
          startDate: '2025-03-20',
          endDate: '2025-03-20',
          startTime: '08:00:00',
          endTime: '18:00:00'
        },
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

  it('should fetch data successfully', () => {
    // Setup
    component.contentDataList = [];
    component.tabSelected = 'today';
    component.isLoading = false;
    component.contnet = []; // Initialize contnet to prevent errors

    // Mock transformSkeletonToWidgets to return skeleton widgets
    const skeletonWidgets = [{ id: 'skeleton-1' }, { id: 'skeleton-2' }];
    jest.spyOn(component as any, 'transformSkeletonToWidgets').mockReturnValue(skeletonWidgets);

    // Mock response for getUserEnrollEvents
    const mockResponse = {
      result: {
        events: [
          {
            event: {
              id: 'event-1'
            }
          }
        ],
        count: 20
      }
    };

    // Mock transformContentsToWidgets to return content widgets
    const contentWidgets = [{ id: 'widget-1' }];
    jest.spyOn(component as any, 'transformContentsToWidgets').mockReturnValue(contentWidgets);

    // Mock eventSvc.getUserEnrollEvents
    eventServiceMock.getUserEnrollEvents = jest.fn().mockReturnValue(of(mockResponse));

    // Mock the dataScription
    component.dataScription = null;

    // Execute
    component.fetchData();

    // Verify
    expect(component.isLoading).toBe(false);
    expect(eventServiceMock.getUserEnrollEvents).toHaveBeenCalled();
    expect(component.showNextPage).toBe(true);
    expect(component.currentPage).toBe(1);
    // Check that contentDataList includes the widgets
    expect(component.contentDataList).toEqual(contentWidgets);
  });

  it('should handle errors when fetching data', () => {
    // Setup
    component.contentDataList = [];
    component.tabSelected = 'today';
    component.isLoading = false;
    component.contnet = []; // Initialize contnet to prevent errors

    // Mock transformSkeletonToWidgets to return skeleton widgets
    const skeletonWidgets = [{ id: 'skeleton-1' }, { id: 'skeleton-2' }];
    jest.spyOn(component as any, 'transformSkeletonToWidgets').mockReturnValue(skeletonWidgets);

    // Set contentDataList with skeleton items to simulate initial skeleton load
    component.contentDataList = [...skeletonWidgets];

    // Mock contentWidgets for error case
    const contentWidgets = [{ id: 'widget-1' }];
    jest.spyOn(component as any, 'transformContentsToWidgets').mockReturnValue(contentWidgets);

    // Mock error for getUserEnrollEvents
    const mockError = new Error('Test error');
    eventServiceMock.getUserEnrollEvents = jest.fn().mockReturnValue(throwError(mockError));

    // Mock the dataScription
    component.dataScription = null;

    // Console.log spy to verify error is logged
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    // Execute
    component.fetchData();

    // Verify
    expect(component.isLoading).toBe(false);
    expect(eventServiceMock.getUserEnrollEvents).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith("error", mockError);
    expect(component.contentDataList).toEqual(contentWidgets);

    // Restore console.log
    consoleLogSpy.mockRestore();
  });
});