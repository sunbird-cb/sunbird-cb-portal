import { EventsV2Component } from './events-v2.component';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { WsEvents } from '@sunbird-cb/utils-v2';

// Mock all dependencies
jest.mock('@angular/router');
jest.mock('@angular/material/bottom-sheet');
jest.mock('../../services/events.service');
jest.mock('@sunbird-cb/utils-v2');

describe('EventsV2Component', () => {
  let component: EventsV2Component;
  let mockActivatedRoute: any;
  let mockBottomSheet: any;
  let mockEventsService: any;
  let mockRouter: any;
  let mockLibEventService: any;
  let mockLangTranslations: any;

  beforeEach(() => {
    // Initialize mocks
    mockActivatedRoute = {
      data: of({
        pageData: {
          data: {
            version2: {
              sectionList: [
                { key: 'eventsHome', data: { leftSection: { data: { mMyEngagements: {}, mEventsCalendar: {} } } } },
                { key: 'banner', data: {} }
              ]
            }
          }
        }
      })
    };

    mockBottomSheet = {
      open: jest.fn()
    };

    mockEventsService = {
      getEventEngagements: jest.fn().mockReturnValue(of({
        result: {
          userEventEnrolmentInfo: {
            eventsAttended: '220',
            eventsEnrolled: '18',
            hoursSpentOnEvents: 125
          }
        }
      }))
    };

    mockRouter = {
      navigate: jest.fn()
    };

    mockLibEventService = {
      raiseInteractTelemetry: jest.fn()
    };

    mockLangTranslations = {
      translateActualLabel: jest.fn().mockReturnValue('Translated Label')
    };

    // Create component instance with mocked dependencies
    component = new EventsV2Component(
      mockActivatedRoute,
      mockBottomSheet,
      mockEventsService,
      mockRouter,
      mockLibEventService,
      mockLangTranslations
    );

    // Call ngOnInit to initialize component
    component.ngOnInit();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct data from route', () => {
    expect(component.eventsHome).toBeDefined();
    expect(component.banner).toBeDefined();
  });

  it('should fetch event engagements on init', () => {
    expect(mockEventsService.getEventEngagements).toHaveBeenCalled();
    expect(component.engagementDetails).toEqual({
      eventsAttended: '220',
      eventsEnrolled: '18',
      hoursSpentOnEvents: '2h 5m'
    });
  });

  it('should handle error when fetching event engagements', () => {
    const mockError = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
    mockEventsService.getEventEngagements.mockReturnValue(throwError(() => mockError));
    
    // Create a spy on console.error to prevent actual error logging
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    component.getEventsEngagemeants();
    
    expect(mockEventsService.getEventEngagements).toHaveBeenCalled();
    // Engagement details should remain unchanged
    expect(component.engagementDetails).toEqual({
      eventsAttended: '220',
      eventsEnrolled: '18',
      hoursSpentOnEvents: '2h 5m'
    });
    
    consoleSpy.mockRestore();
  });

  it('should translate labels correctly', () => {
    const result = component.translateLabels('testLabel', 'testType');
    expect(mockLangTranslations.translateActualLabel).toHaveBeenCalledWith('testLabel', 'testType', '');
    expect(result).toBe('Translated Label');
  });

  it('should convert minutes to hours and minutes format', () => {
    expect(component.convertMinutesToHoursAndMinutes(125)).toBe('2h 5m');
    expect(component.convertMinutesToHoursAndMinutes(60)).toBe('1h 0m');
    expect(component.convertMinutesToHoursAndMinutes(0)).toBe('0h 0m');
    expect(component.convertMinutesToHoursAndMinutes(undefined as any)).toBe('0h 0m');
  });

  it('should open event engagement bottom sheet', () => {
    component.eventsHome = {
      data: {
        leftSection: {
          data: {
            mMyEngagements: { test: 'data' }
          }
        }
      }
    } as any;
    
    component.openEventEngagementBottomSheet();
    
    expect(mockBottomSheet.open).toHaveBeenCalledWith(
      expect.any(Function),
      {
        data: {
          engagements: {},
          engagementDetails: component.engagementDetails
        },
        panelClass: 'events-bottomsheet',
      }
    );
  });

  it('should open event calendar bottom sheet', () => {
    component.eventsHome = {
      data: {
        leftSection: {
          data: {
            mEventsCalendar: { }
          }
        }
      }
    } as any;
    
    component.openEventCalendartBottomSheet();
    
    expect(mockBottomSheet.open).toHaveBeenCalledWith(
      expect.any(Function),
      {
        panelClass: 'events-bottomsheet',
        data: {}
      }
    );
  });

  it('should navigate to the correct route with correct params when key is not "all"', () => {
    component.navigate({ key: 'test-key' });
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/app/event-hub/view-all'],
      { queryParams: { resourceType: 'test-key' } }
    );
  });

  it('should navigate to the view-all route when key is "all"', () => {
    component.navigate({ key: 'all' });
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app/event-hub/view-all']);
  });

  it('should not navigate when no key is provided', () => {
    component.navigate({});
    
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should search events and navigate with query params', () => {
    const mockEvent = { target: { value: 'test search' } };
    
    component.searchEvents(mockEvent);
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/app/event-hub/view-all'],
      { queryParams: { query: 'test search' } }
    );
  });

  it('should not navigate when search event has no target value', () => {
    component.searchEvents({});
    
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should raise telemetry event with correct parameters for "myEvents"', () => {
    const mockEvent = {
      context: { pageSection: 'myEvents' },
      content: { identifier: 'event-123' }
    };
    
    component.raiseTelemetryInteratEvent(mockEvent);
    
    expect(mockLibEventService.raiseInteractTelemetry).toHaveBeenCalledWith(
      {
        type: 'click',
        subType: 'my-events',
        id: 'card-content',
      },
      {
        id: undefined,
        type: 'event'
      },
      {
        module: WsEvents.EnumTelemetrymodules.EVENTS,
      }
    );
  });

  it('should raise telemetry event with correct parameters for "recommendedEvents"', () => {
    const mockEvent = {
      context: { pageSection: 'recommendedEvents' },
      content: { identifier: 'event-456' }
    };
    
    component.raiseTelemetryInteratEvent(mockEvent);
    
    expect(mockLibEventService.raiseInteractTelemetry).toHaveBeenCalledWith(
      {
        type: 'click',
        subType: 'recommended-events',
        id: 'card-content',
      },
      {
        id: undefined,
        type: 'event'
      },
      {
        module: WsEvents.EnumTelemetrymodules.EVENTS,
      }
    );
  });

  it('should raise telemetry event with correct parameters for "trendingEvents"', () => {
    const mockEvent = {
      context: { pageSection: 'trendingEvents' },
      content: { identifier: 'event-789' }
    };
    
    component.raiseTelemetryInteratEvent(mockEvent);
    
    expect(mockLibEventService.raiseInteractTelemetry).toHaveBeenCalledWith(
      {
        type: 'click',
        subType: 'trending-events',
        id: 'card-content',
      },
      {
        id: undefined,
        type: 'event'
      },
      {
        module: WsEvents.EnumTelemetrymodules.EVENTS,
      }
    );
  });

  it('should raise telemetry event with correct parameters for "featuredEvents"', () => {
    const mockEvent = {
      context: { pageSection: 'featuredEvents' },
      content: { identifier: 'event-abc' }
    };
    
    component.raiseTelemetryInteratEvent(mockEvent);
    
    expect(mockLibEventService.raiseInteractTelemetry).toHaveBeenCalledWith(
      {
        type: 'click',
        subType: 'featured-events',
        id: 'card-content',
      },
      {
        id: undefined,
        type: 'event'
      },
      {
        module: WsEvents.EnumTelemetrymodules.EVENTS,
      }
    );
  });
});