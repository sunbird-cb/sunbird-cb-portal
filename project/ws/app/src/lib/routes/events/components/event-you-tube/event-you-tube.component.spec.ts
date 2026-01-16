import { EventYouTubeComponent } from './event-you-tube.component';
import * as videoJsUtil from '../../../../../../../../../library/ws-widget/collection/src/lib/_services/videojs-util';

// Mock dependencies
jest.mock('@angular/router');
jest.mock('./../../services/events.service');
jest.mock('@sunbird-cb/utils-v2');
jest.mock('moment', () => {
  const mockMoment = (date: any) => ({
    valueOf: () => typeof date === 'string' ? new Date(date).getTime() : date.getTime()
  });
  mockMoment.mockReturnValue = jest.fn();
  return mockMoment;
});
jest.mock('../../../../../../../../../library/ws-widget/collection/src/lib/_services/videojs-util', () => ({
  fireRealTimeProgressFunction: jest.fn(),
  saveContinueLearningFunction: jest.fn(),
  telemetryEventDispatcherFunction: jest.fn(),
  youtubeInitializer: jest.fn().mockReturnValue({ dispose: jest.fn() })
}));

describe('EventYouTubeComponent', () => {
  let component: EventYouTubeComponent;
  let activatedRouteMock: any;
  let eventServiceMock: any;
  let configSvcMock: any;
  let elementRefMock: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup mocks
    activatedRouteMock = {
      snapshot: {
        data: {
          content: {
            data: {
              identifier: 'test-event-id',
              startDate: '2025-03-18',
              startTime: '10:00+0000',
              endDate: '2025-03-18',
              endTime: '12:00+0000',
              duration: 120,
              batches: [{ batchId: 'test-batch-id' }]
            }
          },
          pageData: {
            data: {
              fireUpdate: 200
            }
          }
        },
        params: {
          videoId: 'test-video-id'
        }
      },
      params: {
        subscribe: jest.fn().mockImplementation(callback => {
          callback({ videoId: 'test-video-id' });
          return { unsubscribe: jest.fn() };
        })
      },
      queryParams: {
        subscribe: jest.fn().mockImplementation(callback => {
          callback({ isEnrolled: true });
          return { unsubscribe: jest.fn() };
        })
      }
    };

    eventServiceMock = {
      eventStateRead: jest.fn().mockReturnValue({
        subscribe: jest.fn().mockImplementation(callback => {
          callback({
            result: {
              events: [{
                progressdetails: JSON.stringify({ stateMetaData: 30 }),
                status: 1
              }]
            }
          });
          return { unsubscribe: jest.fn() };
        })
      }),
      saveEventProgressUpdate: jest.fn().mockReturnValue({
        subscribe: jest.fn().mockImplementation(callback => {
          callback({ success: true });
          return { unsubscribe: jest.fn() };
        })
      })
    };

    configSvcMock = {
      userProfile: {
        userId: 'test-user-id'
      }
    };

    elementRefMock = {
      nativeElement: document.createElement('div')
    };

    // Create component instance
    component = new EventYouTubeComponent(
      activatedRouteMock as any,
      eventServiceMock as any,
      configSvcMock as any
    );
    component.youtubeTag = elementRefMock;
    component.eventData = activatedRouteMock.snapshot.data.content.data;
    component.videoId = 'test-video-id';
  });

  describe('eventStateRead', () => {
    it('should initialize player with empty string if no state data', () => {
      eventServiceMock.eventStateRead.mockReturnValue({
        subscribe: jest.fn().mockImplementation(callback => {
          callback({
            result: {
              events: []
            }
          });
          return { unsubscribe: jest.fn() };
        })
      });

      const spyInitializePlayer = jest.spyOn(component, 'initializePlayer');
      component.eventStateRead();

      expect(spyInitializePlayer).toHaveBeenCalledWith('');
    });
  });

  describe('initializePlayer', () => {
    it('should initialize the YouTube player', () => {
      const youtubeInitializerSpy = jest.spyOn(videoJsUtil, 'youtubeInitializer');

      component.initializePlayer(30);

      expect(youtubeInitializerSpy).toHaveBeenCalled();
      expect(component.dispose).toBeTruthy();
    });

    it('should handle player ended event', () => {
      // Setup
      const youtubeInitializerSpy = jest.spyOn(videoJsUtil, 'youtubeInitializer');
      component.initializePlayer(30);

      // Extract the dispatcher function that was passed
      const dispatcherFn = youtubeInitializerSpy.mock.calls[0][2];

      // Setup spy
      const saveProgressUpdateSpy = jest.spyOn(component, 'saveProgressUpdate');
      component.currentEvent = true;

      // Trigger ended event
      dispatcherFn({
        data: {
          playerStatus: 'ENDED',
          passThroughData: { timeSpent: 180 }
        }
      });

      expect(saveProgressUpdateSpy).toHaveBeenCalled();
    });
  });

  describe('getBatchId', () => {
    it('should return batchId from eventData batches', () => {
      component.eventData = {
        batches: [{ batchId: 'test-batch-id' }]
      };

      const result = component.getBatchId();

      expect(result).toBe('test-batch-id');
    });

    it('should handle string batches by parsing JSON', () => {
      component.eventData = {
        batches: JSON.stringify([{ batchId: 'test-batch-id' }])
      };

      const result = component.getBatchId();

      expect(result).toBe('test-batch-id');
    });

    it('should return empty string if no batches found', () => {
      component.eventData = {
        batches: []
      };

      const result = component.getBatchId();

      expect(result).toBe('');
    });
  });

  describe('customDateFormat', () => {
    it('should format date and time correctly', () => {
      const result = component.customDateFormat('2025-03-18', '10:00+0000');

      expect(result).toBe('2025-03-18 10:00');
    });
  });

  describe('saveProgressUpdate', () => {
    it('should call saveEventProgressUpdate with correct parameters for normal update', () => {
      // Setup
      component.eventData = {
        identifier: 'test-event-id',
        duration: 120,
        batches: [{ batchId: 'test-batch-id' }]
      };
      component.resumeEventStatus = 1;

      // Act
      component.saveProgressUpdate(60, 3600, '2025-03-18 10:30:00+0000', true);

      // Assert
      expect(eventServiceMock.saveEventProgressUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          request: expect.objectContaining({
            userId: 'test-user-id',
            events: expect.arrayContaining([
              expect.objectContaining({
                eventId: 'test-event-id',
                status: 2,
                completionPercentage: 100
              })
            ])
          })
        })
      );
      expect(component.rateToFire).toBe(300); // should update rateToFire when completion > 50%
    });

    it('should not call saveEventProgressUpdate if resumeEventStatus is 2', () => {
      // Setup
      component.eventData = {
        identifier: 'test-event-id',
        duration: 120,
        batches: [{ batchId: 'test-batch-id' }]
      };
      component.resumeEventStatus = 2;

      // Act
      component.saveProgressUpdate(60, 3600, '2025-03-18 10:30:00+0000');

      // Assert
      expect(eventServiceMock.saveEventProgressUpdate).not.toHaveBeenCalled();
    });

    it('should calculate completionPercentage correctly for normal update', () => {
      // Setup
      component.eventData = {
        identifier: 'test-event-id',
        duration: 120,
        batches: [{ batchId: 'test-batch-id' }]
      };
      component.resumeEventStatus = 1;

      // Create spy to capture the request
      const saveSpy = jest.spyOn(eventServiceMock, 'saveEventProgressUpdate');

      // Act - normal update
      component.saveProgressUpdate(60, 3600, '2025-03-18 10:30:00+0000', true);

      // Assert - completionPercentage should be 100%
      const requestArg: any = saveSpy.mock.calls[0][0];
      expect(requestArg.request.events[0].completionPercentage).toBe(100);
    });

    it('should calculate completionPercentage correctly for time-based update', () => {
      // Setup
      component.eventData = {
        identifier: 'test-event-id',
        duration: 120, // 120 minutes
        batches: [{ batchId: 'test-batch-id' }]
      };
      component.resumeEventStatus = 1;

      // Create spy to capture the request
      const saveSpy = jest.spyOn(eventServiceMock, 'saveEventProgressUpdate');

      // Act - time-based update (30 minutes watched of 120 minute video)
      component.saveProgressUpdate(60, 1800, '2025-03-18 10:30:00+0000', false);

      // Assert - completionPercentage should be 25%
      const requestArg: any = saveSpy.mock.calls[0][0];
      expect(requestArg.request.events[0].completionPercentage).toBe(25);
    });
  });

  describe('ngOnDestroy', () => {
    it('should clean up resources', () => {
      // Setup
      const disposeSpy = jest.fn();
      component.dispose = disposeSpy;
      component.player = { dispose: jest.fn() } as any;
      component.intervalStarted = true;

      // Act
      component.ngOnDestroy();

      // Assert
      expect(disposeSpy).toHaveBeenCalled();
      expect(component.intervalStarted).toBe(false);
    });
  });
});