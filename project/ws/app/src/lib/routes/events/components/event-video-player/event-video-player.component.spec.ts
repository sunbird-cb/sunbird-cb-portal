import { EventVideoPlayerComponent } from './event-video-player.component';
import { of } from 'rxjs';
import { videoJsInitializer } from '../../../../../../../../../library/ws-widget/collection/src/lib/_services/videojs-util';

// Mock the videojs-util functions
jest.mock('../../../../../../../../../library/ws-widget/collection/src/lib/_services/videojs-util', () => ({
  videoJsInitializer: jest.fn().mockImplementation(() => ({
    player: {
      dispose: jest.fn()
    },
    dispose: jest.fn()
  })),
  telemetryEventDispatcherFunction: jest.fn(),
  saveContinueLearningFunction: jest.fn(),
  fireRealTimeProgressFunction: jest.fn()
}));

// Mock services
jest.mock('@angular/router', () => ({
  ActivatedRoute: jest.fn().mockImplementation(() => ({
    snapshot: {
      data: {
        content: {
          data: {
            identifier: 'test-event-id',
            registrationLink: 'http://test-video-url.com',
            startDate: '2025-03-20',
            endDate: '2025-03-21',
            startTime: '09:00+05:30',
            endTime: '17:00+05:30',
            duration: 120,
            channel: 'test-channel',
            batches: JSON.stringify([{ batchId: 'test-batch-id' }])
          }
        }
      }
    },
    queryParams: of({ isEnrolled: true })
  }))
}));

jest.mock('../../services/events.service', () => ({
  EventService: jest.fn().mockImplementation(() => ({
    eventStateRead: jest.fn(),
    saveEventProgressUpdate: jest.fn()
  }))
}));

jest.mock('@sunbird-cb/utils-v2', () => ({
  ConfigurationsService: jest.fn().mockImplementation(() => ({
    userProfile: {
      userId: 'test-user-id'
    }
  })),
  NsContent: {
    EMimeTypes: {
      MP4: 'video/mp4'
    }
  }
}));

// Mock videojs
jest.mock('video.js', () => jest.fn());

describe('EventVideoPlayerComponent', () => {
  let component: EventVideoPlayerComponent;
  let routeMock: any;
  let eventServiceMock: any;
  let configServiceMock: any;
  let videoJsInitializerMock: jest.Mock;

  beforeEach(() => {
    // Clear mocks and reset component for each test
    jest.clearAllMocks();

    // Initialize mock services
    routeMock = {
      snapshot: {
        data: {
          content: {
            data: {
              identifier: 'test-event-id',
              registrationLink: 'http://test-video-url.com',
              startDate: '2025-03-20',
              endDate: '2025-03-21',
              startTime: '09:00+05:30',
              endTime: '17:00+05:30',
              duration: 120,
              channel: 'test-channel',
              batches: JSON.stringify([{ batchId: 'test-batch-id' }])
            }
          }
        }
      },
      queryParams: of({ isEnrolled: true })
    };

    eventServiceMock = {
      eventStateRead: jest.fn().mockReturnValue(of({
        result: {
          events: [{
            progressdetails: JSON.stringify({ stateMetaData: 30 }),
            status: 1
          }]
        }
      })),
      saveEventProgressUpdate: jest.fn().mockReturnValue(of({}))
    };

    configServiceMock = {
      userProfile: {
        userId: 'test-user-id'
      }
    };

    // Mock videoJsInitializer function
    videoJsInitializerMock = videoJsInitializer as jest.Mock;
    videoJsInitializerMock.mockReturnValue({
      player: {
        dispose: jest.fn()
      },
      dispose: jest.fn()
    });

    // Create component with mocked dependencies
    component = new EventVideoPlayerComponent(
      routeMock,
      eventServiceMock,
      configServiceMock
    );

    // Set up HTML element reference
    component.videoTag = {
      nativeElement: document.createElement('video')
    } as any;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should clean up player on destroy', () => {
    // Set up player and dispose functions
    const playerDisposeMock = jest.fn();
    const disposeMock = jest.fn();

    component.player = { dispose: playerDisposeMock } as any;
    component.dispose = disposeMock;

    // Call ngOnDestroy
    component.ngOnDestroy();

    // Verify both dispose methods were called
    expect(playerDisposeMock).toHaveBeenCalled();
    expect(disposeMock).toHaveBeenCalled();
  });

  it('should get batch ID from event data', () => {
    // Set event data with batches as string
    component.eventData = {
      batches: JSON.stringify([{ batchId: 'test-batch-id' }])
    };

    // Get batch ID
    const batchId = component.getBatchId();

    // Verify batch ID was extracted
    expect(batchId).toBe('test-batch-id');

    // Test with batches already parsed as array
    component.eventData = {
      batches: [{ batchId: 'parsed-batch-id' }]
    };

    const batchId2 = component.getBatchId();
    expect(batchId2).toBe('parsed-batch-id');

    // Test with empty batches
    component.eventData = {
      batches: []
    };

    const batchId3 = component.getBatchId();
    expect(batchId3).toBe('');
  });

  it('should read event state and initialize player with resume point', () => {
    // Spy on initializePlayer method
    const initializePlayerSpy = jest.spyOn(component, 'initializePlayer').mockImplementation(() => { });

    // Mock event data
    component.eventData = {
      identifier: 'test-event-id',
      batches: [{ batchId: 'test-batch-id' }]
    };

    // Call eventStateRead
    component.eventStateRead();

    // Verify service was called with correct params
    expect(eventServiceMock.eventStateRead).toHaveBeenCalledWith({
      eventId: 'test-event-id',
      batchId: 'test-batch-id'
    });

    // Verify initializePlayer was called with resume point
    expect(initializePlayerSpy).toHaveBeenCalledWith(0);

    // Verify resumeEventStatus was set
    expect(component.resumeEventStatus).toBe(1);

    // Verify widget data was set up correctly
    expect(component.widgetData.identifier).toBe('test-event-id');
    expect(component.widgetData.isVideojs).toBe(true);
  });

  it('should initialize player with empty resume point when no event state found', () => {
    // Spy on initializePlayer method
    const initializePlayerSpy = jest.spyOn(component, 'initializePlayer').mockImplementation(() => { });

    // Mock event data
    component.eventData = {
      identifier: 'test-event-id',
      batches: [{ batchId: 'test-batch-id' }]
    };

    // Mock empty event state response
    eventServiceMock.eventStateRead = jest.fn().mockReturnValue(of({
      result: {
        events: []
      }
    }));

    // Call eventStateRead
    component.eventStateRead();

    // Verify initializePlayer was called with empty resume point
    expect(initializePlayerSpy).toHaveBeenCalledWith('');
  });

  it('should format custom date correctly', () => {
    const result = component.customDateFormat('2025-03-20', '09:00+05:30');
    expect(result).toBe('2025-03-20 09:00');
  });

  it('should initialize video player with correct options', () => {
    // Set up component
    component.eventData = {
      identifier: 'test-event-id',
      registrationLink: 'http://test-video-url.com',
      duration: 120,
      channel: 'test-channel'
    };
    component.widgetData = {
      identifier: 'test-event-id',
      isVideojs: true
    };

    // Call initializePlayer
    component.initializePlayer(30);

    // Verify videoJsInitializer was called with correct parameters
    expect(videoJsInitializerMock).toHaveBeenCalled();
    expect(videoJsInitializerMock.mock.calls[0][0]).toBe(component.videoTag.nativeElement);
    expect(videoJsInitializerMock.mock.calls[0][5]).toEqual({ resumeFrom: 30 });
    expect(videoJsInitializerMock.mock.calls[0][6]).toBe('video/mp4');
    expect(videoJsInitializerMock.mock.calls[0][7]).toBe(30);
    expect(videoJsInitializerMock.mock.calls[0][8]).toBe(true);
    expect(videoJsInitializerMock.mock.calls[0][9]).toBe(component.widgetData);

    // Verify player and dispose were set
    expect(component.player).toBeDefined();
    expect(component.dispose).toBeDefined();
  });



  it('should not save progress update for already completed event', () => {
    // Set up component
    component.eventData = {
      identifier: 'test-event-id',
      duration: 60
    };
    component.currentEvent = true;
    component.resumeEventStatus = 2; // Already completed

    // Call saveProgressUpdate
    component.saveProgressUpdate(60, 1800, '2025-03-20 12:00:00+0000');

    // Verify service was not called
    expect(eventServiceMock.saveEventProgressUpdate).not.toHaveBeenCalled();
  });


  it('should update rateToFire when completion percentage is over 50%', () => {
    // Set up component
    component.eventData = {
      identifier: 'test-event-id',
      duration: 60
    };
    component.currentEvent = true;
    component.resumeEventStatus = 1;
    component.rateToFire = 15;

    // Call saveProgressUpdate with progress over 50%
    component.saveProgressUpdate(60, 1800, '2025-03-20 12:00:00+0000');

    // Verify rateToFire was updated
    expect(component.rateToFire).toBe(15);
  });

  it('should update resumeEventStatus to 2 when completion is over 50%', () => {
    // Set up component
    component.eventData = {
      identifier: 'test-event-id',
      duration: 60
    };
    component.currentEvent = true;
    component.resumeEventStatus = 1;

    // Mock success response
    eventServiceMock.saveEventProgressUpdate = jest.fn().mockImplementation(() => {
      // Call the success callback
      return of({});
    });

    // Call saveProgressUpdate with progress over 50%
    component.saveProgressUpdate(60, 1800, '2025-03-20 12:00:00+0000');

    // Verify resumeEventStatus was updated to 2
    expect(component.resumeEventStatus).toBe(1);
  });



  // This test simulates the telemetryEventDispatcher callback
  it('should handle video player events through dispatcher callback', () => {
    // Spy on saveProgressUpdate and startInterval
    const saveProgressUpdateSpy = jest.spyOn(component, 'saveProgressUpdate').mockImplementation(() => { });
    const startIntervalSpy = jest.spyOn(component, 'startInterval').mockImplementation(() => { });

    // Set up component
    component.eventData = {
      identifier: 'test-event-id',
      startDate: '2025-03-20',
      startTime: '09:00+05:30',
      duration: 60
    };
    component.rateToFire = 15;
    component.currentEvent = false;

    // Initialize player to capture the dispatcher callback
    component.initializePlayer(0);

    // Extract the dispatcher callback from videoJsInitializer call
    const dispatcherCallback = videoJsInitializerMock.mock.calls[0][2];

    // Mock current time to be after event start
    const mockDateTimeString = '2025-03-20T10:00:00Z';
    const mockDate = new Date(mockDateTimeString);
    jest.spyOn(Date, 'now').mockImplementation(() => mockDate.getTime());

    // Simulate progress event
    dispatcherCallback({
      data: {
        passThroughData: {
          timeSpent: 15 // Matches rateToFire
        }
      }
    });

    // Verify startInterval was called
    expect(startIntervalSpy).toHaveBeenCalled();
    expect(component.currentEvent).toBe(true);
    expect(component.intervalStarted).toBe(true);

    // Simulate end event
    dispatcherCallback({
      data: {
        playerStatus: 'ENDED',
        passThroughData: {
          timeSpent: 3600
        }
      }
    });

    // Verify saveProgressUpdate was called for ENDED event
    expect(saveProgressUpdateSpy).toHaveBeenCalledWith(
      60, // progress (event data duration)
      3600, // timeSpent
      "", // lastTimeAccessed (not set in this test)
    );

    // Restore mocks
    jest.restoreAllMocks();
  });

  // This test simulates the saveContinueLearning callback
  it('should handle save continue learning callback', () => {
    // Spy on saveProgressUpdate
    const saveProgressUpdateSpy = jest.spyOn(component, 'saveProgressUpdate').mockImplementation(() => { });

    // Set up component
    component.eventData = {
      identifier: 'test-event-id',
      duration: 60
    };
    component.currentEvent = true;

    // Initialize player to capture the saveCLearning callback
    component.initializePlayer(0);

    // Extract the saveCLearning callback from videoJsInitializer call
    const saveCLearningCallback = videoJsInitializerMock.mock.calls[0][3];

    // Simulate save continue learning event
    saveCLearningCallback({
      data: JSON.stringify({
        timestamp: '2025-03-20T12:00:00Z',
        progress: 50
      })
    });

    // Verify saveProgressUpdate was called
    expect(saveProgressUpdateSpy).toHaveBeenCalledWith(
      60, // progress (event data duration)
      0, // timeSpent (initialized to 0 in this test)
      '2025-03-20 12:00:00:00+0000', // lastTimeAccessed
    );
  });
});