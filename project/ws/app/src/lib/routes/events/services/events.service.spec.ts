import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventService } from './events.service';
import { FormExtService } from '../../../../../../../../src/app/services/form-ext.service';
import { environment } from '../../../../../../../../src/environments/environment';
import { of } from 'rxjs';

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;
  let formExtServiceMock: any;

  const mockUserId = 'test-user-id';
  const mockEventId = 'test-event-id';
  const mockBatchId = 'test-batch-id';
  const mockRequest = { data: 'test-data' };
  const mockResponse = { result: 'success' };
  const mockKeySpeakerConfig = { data: 'key-speaker-config' };

  beforeEach(() => {
    formExtServiceMock = {
      homeFormReadData: jest.fn().mockReturnValue(of(mockKeySpeakerConfig))
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EventService,
        { provide: FormExtService, useValue: formExtServiceMock }
      ]
    });

    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEventData', () => {
    it('should get event data by event ID', () => {
      service.getEventData(mockEventId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`/apis/proxies/v8/event/v4/read/${mockEventId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getEventsList', () => {
    it('should get events list based on request', () => {
      service.getEventsList(mockRequest).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/apis/proxies/v8/sunbirdigot/search');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);
      req.flush(mockResponse);
    });
  });

  describe('getPublicUrl', () => {
    it('should transform URL to public URL', () => {
      const inputUrl = 'some/path/to/content/abc/xyz.jpg';
      const expectedUrl = `${environment.contentHost}/${environment.contentBucket}/content/abc/xyz.jpg`;
      
      const result = service.getPublicUrl(inputUrl);
      expect(result).toEqual(expectedUrl);
    });

    it('should handle URL without content segment', () => {
      const inputUrl = 'some/path/without/content/segment';
      const expectedUrl = `${environment.contentHost}/${environment.contentBucket}/content/segment`;
      
      const result = service.getPublicUrl(inputUrl);
      expect(result).toEqual(expectedUrl);
    });
  });

  describe('AllEventEnrollList', () => {
    it('should get all event enrollment list for a user', () => {
      service.AllEventEnrollList(mockUserId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`/apis/proxies/v8/v1/user/events/list/${mockUserId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getUserEnrollEvents', () => {
    it('should get user enrolled events based on request', () => {
      service.getUserEnrollEvents(mockUserId, mockRequest).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`/apis/proxies/v8/user/events/list/${mockUserId}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);
      req.flush(mockResponse);
    });
  });

  describe('getIsEnrolled', () => {
    it('should check if user is enrolled in an event with batch ID', () => {
      service.getIsEnrolled(mockUserId, mockEventId, mockBatchId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `/apis/proxies/v8/user/event/read/${mockUserId}?eventId=${mockEventId}&batchId=${mockBatchId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should check if user is enrolled in an event without batch ID', () => {
      service.getIsEnrolled(mockUserId, mockEventId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `/apis/proxies/v8/user/event/read/${mockUserId}?eventId=${mockEventId}&batchId=undefined`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('enrollEvent', () => {
    it('should enroll user in an event', () => {
      service.enrollEvent(mockRequest).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/apis/proxies/v8/event/batch/enroll');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);
      req.flush(mockResponse);
    });
  });

  describe('contentStateUpdate', () => {
    // it('should update content state', () => {
    //   service.contentStateUpdate(mockRequest).subscribe(response => {
    //     expect(response).toEqual(mockResponse);
    //   });

    //   const req = httpMock.expectOne('/apis/proxies/v8/event-progres/undefined');
    // //   expect(req.request.method).toBe('PATCH');
    //   expect(req.request.body).toEqual(mockRequest);
    //   req.flush(mockResponse);
    // });
  });

  describe('saveEventProgressUpdate', () => {
    it('should save event progress update', () => {
      service.saveEventProgressUpdate(mockRequest).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('apis/proxies/v8/eventprogress/v1/event/state/update');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(mockRequest);
      req.flush(mockResponse);
    });
  });

  describe('eventStateRead', () => {
    it('should read event state', () => {
      const eventStateRequest = {
        batchId: mockBatchId,
        eventId: mockEventId,
        data: 'additional-data'
      };

      service.eventStateRead(eventStateRequest).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `apis/proxies/v8/user/event/state/read?batchId=${mockBatchId}&eventId=${mockEventId}`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(eventStateRequest);
      req.flush(mockResponse);
    });
  });

  describe('getEventEngagements', () => {
    it('should get event engagements', () => {
      service.getEventEngagements().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('apis/proxies/v8/user/events/enroll/summary');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getTrendingEvents', () => {
    it('should get trending events', () => {
      service.getTrendingEvents().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/apis/proxies/v8/user/mdo/trending/events');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getFeaturedEvents', () => {
    it('should get featured events', () => {
      service.getFeaturedEvents().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/apis/proxies/v8/user/featured/events');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getKeySpeakerJson', () => {
    it('should get key speaker configuration from cache if available', async () => {
      // Set cache
      service.getKeySpeakerConfig = mockKeySpeakerConfig;

      const result = await service.getKeySpeakerJson();
      expect(result).toEqual(mockKeySpeakerConfig);
      expect(formExtServiceMock.homeFormReadData).not.toHaveBeenCalled();
    });

    it('should fetch key speaker configuration if not in cache', async () => {
      // Clear cache
      service.getKeySpeakerConfig = null;

      const result = await service.getKeySpeakerJson();
      expect(result).toEqual(mockKeySpeakerConfig);
      
      const expectedRequestData = {
        'request': {
          'type': 'page',
          'subType': 'events',
          'action': 'page-configuration',
          'component': 'portal',
          'rootOrgId': '*',
        },
      };
      
      expect(formExtServiceMock.homeFormReadData).toHaveBeenCalledWith(expectedRequestData);
    });
  });

  describe('eventEnrollEvent Subject', () => {
    it('should have a Subject for event enrollment', () => {
      expect(service.eventEnrollEvent).toBeDefined();
    });
  });
});