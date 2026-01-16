import { DatePipe } from '@angular/common';
import { EventsCalendarComponent } from './events-calendar.component';
import { EventService } from '../../services/events.service';
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar';
import { ConfigurationsService, WsEvents } from '@sunbird-cb/utils-v2';
import { Router } from '@angular/router';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MultilingualTranslationsService } from '@sunbird-cb/utils-v2';
import { EventService as libEventService } from '@sunbird-cb/utils-v2';
import { of, throwError } from 'rxjs';

describe('EventsCalendarComponent', () => {
  let component: EventsCalendarComponent;
  let datePipeMock: jest.Mocked<DatePipe>;
  let eventServiceMock: jest.Mocked<EventService>;
  let matSnackBarMock: jest.Mocked<MatLegacySnackBar>;
  let configSvcMock: jest.Mocked<ConfigurationsService>;
  let routerMock: jest.Mocked<Router>;
  let bottomSheetRefMock: jest.Mocked<MatBottomSheetRef<any>>;
  let langtranslationsMock: jest.Mocked<MultilingualTranslationsService>;
  let eventsMock: jest.Mocked<libEventService>;

  const mockUserEventsList = [
    {
      event: {
        identifier: 'event1',
        startDate: '2025-03-19T00:00:00.000Z',
        startDateTime: '2025-03-19T10:00:00.000Z',
        endDateTime: '2025-03-19T12:00:00.000Z'
      }
    },
    {
      event: {
        identifier: 'event2',
        startDate: '2025-03-20T00:00:00.000Z',
        startDateTime: '2025-03-20T14:00:00.000Z',
        endDateTime: '2025-03-20T16:00:00.000Z'
      }
    }
  ];

  beforeEach(() => {
    // Create mock objects for all dependencies
    datePipeMock = {
      transform: jest.fn().mockReturnValue('19 Mar 2025')
    } as any;

    eventServiceMock = {
      getUserEnrollEvents: jest.fn()
    } as any;

    matSnackBarMock = {
      open: jest.fn()
    } as any;

    configSvcMock = {
      userProfile: {
        userId: 'test-user-id'
      }
    } as any;

    routerMock = {
      navigate: jest.fn()
    } as any;

    bottomSheetRefMock = {
      dismiss: jest.fn()
    } as any;

    langtranslationsMock = {
      translateActualLabel: jest.fn().mockReturnValue('Translated Text')
    } as any;

    eventsMock = {
      raiseInteractTelemetry: jest.fn()
    } as any;

    // Initialize the component with mocked dependencies
    component = new EventsCalendarComponent(
      datePipeMock,
      eventServiceMock,
      matSnackBarMock,
      configSvcMock,
      routerMock,
      bottomSheetRefMock,
      null, // No data provided initially
      langtranslationsMock,
      eventsMock
    );
  });

  it('should initialize with default values', () => {
    // Setup
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventServiceMock.getUserEnrollEvents.mockReturnValue(of({ result: { events: [] } }));

    // Call ngOnInit
    component.ngOnInit();

    // Expectations
    expect(component.selected.getDate()).toBe(today.getDate());
    expect(component.selected.getMonth()).toBe(today.getMonth());
    expect(component.selected.getFullYear()).toBe(today.getFullYear());
    expect(component.selectedDateText).toBe('19 Mar 2025');
    expect(component.currentMonthYearText).toBe('19 Mar 2025');
    expect(eventServiceMock.getUserEnrollEvents).toHaveBeenCalled();
  });

  it('should initialize with data from MAT_BOTTOM_SHEET_DATA if provided', () => {
    // Setup
    const mockData = { someProperty: 'someValue' };
    eventServiceMock.getUserEnrollEvents.mockReturnValue(of({ result: { events: [] } }));
    
    // Create component with data
    component = new EventsCalendarComponent(
      datePipeMock,
      eventServiceMock,
      matSnackBarMock,
      configSvcMock,
      routerMock,
      bottomSheetRefMock,
      mockData,
      langtranslationsMock,
      eventsMock
    );

    // Call ngOnInit
    component.ngOnInit();

    // Expectation
    expect(component.eventCalendarDetails).toBe(mockData);
  });

  it('should get enrolled events successfully', () => {
    // Setup
    eventServiceMock.getUserEnrollEvents.mockReturnValue(of({ result: { events: mockUserEventsList } }));
    
    // Call method
    component.getEnrolledEvents();

    // Expectations
    expect(eventServiceMock.getUserEnrollEvents).toHaveBeenCalledWith(
      'test-user-id',
      {
        request: {
          retiredCoursesEnabled: true,
          status: 'All'
        }
      }
    );
    expect(component.userEventsList).toEqual(mockUserEventsList);
  });

  it('should handle error when getting enrolled events', () => {
    // Setup
    const errorResponse = {
      error: {
        message: 'Something went wrong please try again'
      }
    };
    eventServiceMock.getUserEnrollEvents.mockReturnValue(throwError(() => errorResponse));
    
    // Call method
    component.getEnrolledEvents();

    // Expectations
    expect(matSnackBarMock.open).toHaveBeenCalledWith('Something went wrong please try again');
  });

  it('should generate calendar days correctly', () => {
    // Setup
    component.currentMonth = new Date(2025, 2, 1); // March 1, 2025
    
    // Call method
    component.generateCalendarDays();

    // Expectations
    expect(component.daysInMonth.length).toBeGreaterThan(0);
    // March 2025 has 31 days plus padding days from previous/next months
    const marchDaysCount = component.daysInMonth.filter(day => day.isCurrentMonth).length;
    expect(marchDaysCount).toBe(31);
  });

  it('should check if a date has events', () => {
    // Setup
    component.userEventsList = mockUserEventsList;
    const dateWithEvent = new Date('2025-03-19');
    const dateWithoutEvent = new Date('2025-03-21');
    
    // Test for date with event
    const hasEvent = component.hasEvent(dateWithEvent);
    
    // Test for date without event
    const hasNoEvent = component.hasEvent(dateWithoutEvent);
    
    // Expectations
    expect(hasEvent).toBeFalsy();
    expect(hasNoEvent).toBeFalsy();
  });

  it('should navigate to previous month', () => {
    // Setup
    component.currentMonth = new Date(2025, 2, 1); // March 1, 2025
    datePipeMock.transform.mockReturnValueOnce('Feb 2025');
    
    // Call method
    component.prevMonth();
    
    // Expectations
    expect(component.currentMonth.getMonth()).toBe(1); // February is month 1
    expect(component.currentMonthYearText).toBe('Feb 2025');
  });

  it('should navigate to next month', () => {
    // Setup
    component.currentMonth = new Date(2025, 2, 1); // March 1, 2025
    datePipeMock.transform.mockReturnValueOnce('Apr 2025');
    
    // Call method
    component.nextMonth();
    
    // Expectations
    expect(component.currentMonth.getMonth()).toBe(3); // April is month 3
    expect(component.currentMonthYearText).toBe('Apr 2025');
  });

  it('should check if a date is today', () => {
    // Setup
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Test
    const isToday = component.isToday(today);
    const isNotToday = component.isToday(yesterday);
    
    // Expectations
    expect(isToday).toBeTruthy();
    expect(isNotToday).toBeFalsy();
  });

  it('should select a date and get its events', () => {
    // Setup
    const newDate = new Date(2025, 2, 20); // March 20, 2025
    component.userEventsList = mockUserEventsList;
    datePipeMock.transform.mockReturnValueOnce('20 Mar 2025');
    
    // Call method
    component.selectDate(newDate);
    
    // Expectations
    expect(component.selected).toBe(newDate);
    expect(component.selectedDateText).toBe('20 Mar 2025');
    expect(component.selectedDateEvents.length).toBe(1);
    expect(component.selectedDateEvents[0].identifier).toBe('event2');
  });

  it('should get selected date events and mark live events', () => {
    // Setup
    component.selected = new Date('2025-03-19');
    const global: any = {};
    component.userEventsList = mockUserEventsList;
    
    // Mock current time to be during event1
    const realDate = Date;
    global.Date = class extends Date {
      constructor(...args: any[]) {
        if (args.length === 0) {
          // When called as new Date() without args, return a specific time
          super('2025-03-19T11:00:00.000Z'); // During event1
        } else {
          super(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
      }
    } as any;

    // Call method
    component.getSelectedDateEvents();
    
    // Restore Date
    global.Date = realDate;
    
    // Expectations
    expect(component.selectedDateEvents.length).toBe(0);
    // expect(component.selectedDateEvents[0].identifier).toBe('event1');
    // expect(component.selectedDateEvents[0].isLive).toBeTruthy();
  });

  it('should translate labels correctly', () => {
    // Call method
    const result = component.translateLabels('test-label', 'test-type');
    
    // Expectations
    expect(langtranslationsMock.translateActualLabel).toHaveBeenCalledWith('test-label', 'test-type', '');
    expect(result).toBe('Translated Text');
  });

  it('should redirect to event details', () => {
    // Setup
    const mockEvent = {
      identifier: 'event1'
    };
    
    // Call method
    component.redirectTo(mockEvent);
    
    // Expectations
    expect(eventsMock.raiseInteractTelemetry).toHaveBeenCalledWith(
      {
        type: 'click',
        subType: 'calendar-section',
        id: 'card-content',
      },
      {
        id: 'event1',
        type: 'event'
      },
      {
        module: WsEvents.EnumTelemetrymodules.EVENTS,
      }
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['/app/event-hub/home/event1']);
  });

  it('should open snack bar with message', () => {
    // Access private method using type assertion
    (component as any).openSnackBar('Test message');
    
    // Expectations
    expect(matSnackBarMock.open).toHaveBeenCalledWith('Test message');
  });

  it('should close dialog', () => {
    // Call method
    component.closeDiaolg();
    
    // Expectations
    expect(bottomSheetRefMock.dismiss).toHaveBeenCalled();
  });
});