import { NetworkingService } from './networking.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationsService } from '@sunbird-cb/utils-v2';
import { of } from 'rxjs';
import { connectionUpdates } from '../models/network-v3.model';

describe('NetworkingService', () => {
  let service: NetworkingService;
  let httpClientSpy: any;
  let translateServiceSpy: any;
  let configSvcSpy: any;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
      post: jest.fn()
    };

    translateServiceSpy = {
      instant: jest.fn()
    };

    configSvcSpy = {
      userProfileV2: {}
    };

    service = new NetworkingService(
      httpClientSpy as HttpClient,
      translateServiceSpy as TranslateService,
      configSvcSpy as ConfigurationsService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchProfile', () => {
    it('should fetch user profile and configure profile details', (done) => {
      const userId = 'test-user-id';
      const mockResponse = {
        result: {
          response: {
            profileDetails: {
              profileBannerUrl: 'test-banner-url'
            }
          }
        }
      };

      httpClientSpy.get.mockReturnValue(of(mockResponse));
      jest.spyOn(service, 'configulreProfileDetails');

      service.fetchProfile(userId).subscribe(result => {
        expect(httpClientSpy.get).toHaveBeenCalledWith(`/apis/proxies/v8/user/profile/v1/basic/${userId}`);
        expect(service.configulreProfileDetails).toHaveBeenCalledWith(mockResponse);
        expect(result).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('configulreProfileDetails', () => {
    it('should set profileBannerUrl when configSvc and userProfileV2 exist', () => {
      const requestBody = {
        result: {
          response: {
            profileDetails: {
              profileBannerUrl: 'test-banner-url'
            }
          }
        }
      };

      service.configulreProfileDetails(requestBody);

      expect(configSvcSpy.userProfileV2.profileBannerUrl).toBe('test-banner-url');
    });

    it('should set empty string when profileBannerUrl does not exist', () => {
      const requestBody = {
        result: {
          response: {
            profileDetails: {}
          }
        }
      };

      service.configulreProfileDetails(requestBody);

      expect(configSvcSpy.userProfileV2.profileBannerUrl).toBe('');
    });

    it('should handle when configSvc is null', () => {
      const requestBody = { result: { response: { profileDetails: {} } } };
      service['configSvc'] = null as any;

      expect(() => service.configulreProfileDetails(requestBody)).not.toThrow();
    });
  });

  describe('getCommunities', () => {
    it('should make POST request to get communities', (done) => {
      const formBody = { test: 'data' };
      const mockResponse = { communities: [] };

      httpClientSpy.post.mockReturnValue(of(mockResponse));

      service.getCommunities(formBody).subscribe(result => {
        expect(httpClientSpy.post).toHaveBeenCalledWith('/apis/proxies/v8/community/v1/popular', formBody);
        expect(result).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('getQueryString', () => {
    it('should return empty string when no parameters provided', () => {
      const result = service.getQueryString();
      expect(result).toBe('');
    });

    it('should return query string with pageNo only', () => {
      const result = service.getQueryString(1);
      expect(result).toBe('?pageNo=1');
    });

    it('should return query string with pageSize only', () => {
      const result = service.getQueryString(undefined, 10);
      expect(result).toBe('?pageSize=10');
    });

    it('should return query string with both pageNo and pageSize', () => {
      const result = service.getQueryString(1, 10);
      expect(result).toBe('?pageNo=1&pageSize=10');
    });

    it('should handle null values', () => {
      const result = service.getQueryString(null as any, null as any);
      expect(result).toBe('');
    });
  });

  describe('getConnectionRequests', () => {
    it('should get connection requests with pagination', (done) => {
      const mockResponse = {
        result: {
          data: [
            { id: 1, createdAt: '2023-01-01T00:00:00Z' },
            { id: 2, createdAt: '2023-01-02T00:00:00Z' }
          ],
          count: 2
        }
      };

      httpClientSpy.get.mockReturnValue(of(mockResponse));
      jest.spyOn(service, 'formatedConnectionRequests').mockReturnValue(mockResponse.result.data);

      service.getConnectionRequests(1, 10).subscribe(result => {
        expect(httpClientSpy.get).toHaveBeenCalledWith('/apis/protected/v8/connections/v2/connections/requests/received?pageNo=1&pageSize=10');
        expect(service.formatedConnectionRequests).toHaveBeenCalledWith(mockResponse.result.data);
        expect(result).toEqual({
          data: mockResponse.result.data,
          count: 2
        });
        done();
      });
    });

    it('should handle response without pagination parameters', (done) => {
      const mockResponse = {
        result: {
          data: [],
          count: 0
        }
      };

      httpClientSpy.get.mockReturnValue(of(mockResponse));
      jest.spyOn(service, 'formatedConnectionRequests').mockReturnValue([]);

      service.getConnectionRequests().subscribe(result => {
        expect(httpClientSpy.get).toHaveBeenCalledWith('/apis/protected/v8/connections/v2/connections/requests/received');
        expect(result).toEqual({
          data: [],
          count: 0
        });
        done();
      });
    });
  });

  describe('formatedConnectionRequests', () => {
    it('should format connection requests with timeAgo', () => {
      const requests = [
        { id: 1, createdAt: '2023-01-01T00:00:00Z' },
        { id: 2, createdAt: '2023-01-02T00:00:00Z' }
      ];

      jest.spyOn(service, 'getTimeAgo').mockReturnValue('1d');

      const result = service.formatedConnectionRequests(requests);

      expect(service.getTimeAgo).toHaveBeenCalledTimes(2);
      expect(result[0].timeAgo).toBe('1d');
      expect(result[1].timeAgo).toBe('1d');
    });

    it('should handle null requests', () => {
      const result = service.formatedConnectionRequests(null as any);
      expect(result).toBeNull();
    });

    it('should handle requests without createdAt', () => {
      const requests = [{ id: 1 }];
      const result = service.formatedConnectionRequests(requests);
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  describe('getTimeAgo', () => {
    beforeEach(() => {
      jest.spyOn(Date, 'now').mockImplementation(() => new Date('2023-01-02T00:00:00Z').getTime());
    });

    afterEach(() => {
      (Date.now as any).mockRestore();
    });

    it('should return seconds for time less than 1 minute', () => {
      const result = service.getTimeAgo('2023-01-01T23:59:30Z');
      expect(result).toBe('30s');
    });

    it('should return minutes for time less than 1 hour', () => {
      const result = service.getTimeAgo('2023-01-01T23:30:00Z');
      expect(result).toBe('30m');
    });

    it('should return hours for time less than 1 day', () => {
      const result = service.getTimeAgo('2023-01-01T12:00:00Z');
      expect(result).toBe('12h');
    });

    it('should return days for time less than 1 month', () => {
      const result = service.getTimeAgo('2023-01-01T00:00:00Z');
      expect(result).toBe('1d');
    });

    it('should return months for time less than 1 year', () => {
      const result = service.getTimeAgo('2022-11-01T00:00:00Z');
      expect(result).toBe('2m');
    });

    it('should return years for time more than 1 year', () => {
      const result = service.getTimeAgo('2021-01-01T00:00:00Z');
      expect(result).toBe('2y');
    });

    it('should return empty string for invalid date', () => {
      const result = service.getTimeAgo('invalid-date');
      expect(result).toBe('');
    });
  });

  describe('getRecommendedUsers', () => {
    it('should make POST request to get recommended users', (done) => {
      const formBody = { test: 'data' };
      const mockResponse = { users: [] };

      httpClientSpy.post.mockReturnValue(of(mockResponse));

      service.getRecommendedUsers(formBody).subscribe(result => {
        expect(httpClientSpy.post).toHaveBeenCalledWith('/apis/proxies/v8/connections/v3/connections/recommended', formBody);
        expect(result).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('getRecommendedMentors', () => {
    it('should make POST request to get recommended mentors', (done) => {
      const formBody = { test: 'data' };
      const mockResponse = { mentors: [] };

      httpClientSpy.post.mockReturnValue(of(mockResponse));

      service.getRecommendedMentors(formBody).subscribe(result => {
        expect(httpClientSpy.post).toHaveBeenCalledWith('/apis/proxies/v8/connections/v3/connections/recommended/mentors', formBody);
        expect(result).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('getConnections', () => {
    it('should make GET request to get connections', (done) => {
      const mockResponse = { connections: [] };

      httpClientSpy.get.mockReturnValue(of(mockResponse));

      service.getConnections(1, 10).subscribe(result => {
        expect(httpClientSpy.get).toHaveBeenCalledWith('/apis/protected/v8/connections/v2/connections/established?pageNo=1&pageSize=10');
        expect(result).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('getRequestSent', () => {
    it('should make GET request to get sent requests', (done) => {
      const mockResponse = { requests: [] };

      httpClientSpy.get.mockReturnValue(of(mockResponse));

      service.getRequestSent(1, 10).subscribe(result => {
        expect(httpClientSpy.get).toHaveBeenCalledWith('/apis/protected/v8/connections/v2/connections/requested?pageNo=1&pageSize=10');
        expect(result).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('getBlockedUsers', () => {
    it('should make POST request to get blocked users', (done) => {
      const formBody = { test: 'data' };
      const mockResponse = { blockedUsers: [] };

      httpClientSpy.post.mockReturnValue(of(mockResponse));

      service.getBlockedUsers(formBody).subscribe(result => {
        expect(httpClientSpy.post).toHaveBeenCalledWith('/apis/proxies/v8/connections/v2/connections/requests/blocked', formBody);
        expect(result).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('sendConnectionRequest', () => {
    it('should make POST request to send connection request', (done) => {
      const formBody = { userId: 'test-user' };
      const mockResponse = { success: true };

      httpClientSpy.post.mockReturnValue(of(mockResponse));

      service.sendConnectionRequest(formBody).subscribe(result => {
        expect(httpClientSpy.post).toHaveBeenCalledWith('/apis/protected/v8/connections/v2/add/connection', formBody);
        expect(result).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('updateConnectionRequest', () => {
    it('should make POST request to update connection request', (done) => {
      const formBody = { requestId: 'test-request', status: 'accepted' };
      const mockResponse = { success: true };

      httpClientSpy.post.mockReturnValue(of(mockResponse));

      service.updateConnectionRequest(formBody).subscribe(result => {
        expect(httpClientSpy.post).toHaveBeenCalledWith('/apis/protected/v8/connections/v2/update/connection', formBody);
        expect(result).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('getConnectionsCount', () => {
    it('should make POST request to get connections count', (done) => {
      const formBody = { userId: 'test-user' };
      const mockResponse = { count: 10 };

      httpClientSpy.post.mockReturnValue(of(mockResponse));

      service.getConnectionsCount(formBody).subscribe(result => {
        expect(httpClientSpy.post).toHaveBeenCalledWith('/apis/proxies/v8/connections/user/v1/network/connections/list', formBody);
        expect(result).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('sendConnectionUpdates', () => {
    it('should emit connection updates', () => {
      const connectionUpdate: connectionUpdates = {
        type: 'add',
        userId: 'test-user',
        status: 'pending'
      } as any;

      jest.spyOn(service.connectionsUpdates, 'next');

      service.sendConnectionUpdates(connectionUpdate);

      expect(service.connectionsUpdates.next).toHaveBeenCalledWith(connectionUpdate);
    });
  });

  describe('connectionsUpdates$', () => {
    it('should return observable from connectionsUpdates BehaviorSubject', (done) => {
      const connectionUpdate: connectionUpdates = {
        type: 'add',
        userId: 'test-user',
        status: 'pending'
      } as any;

      service.connectionsUpdates$.subscribe(value => {
        if (value !== null) {
          expect(value).toEqual(connectionUpdate);
          done();
        }
      });

      service.sendConnectionUpdates(connectionUpdate);
    });
  });

  describe('handleTranslateTo', () => {
    it('should return translated string for menu name', () => {
      const menuName = 'My Connections';
      const expectedKey = 'NetworkLandingPage.MyConnections';
      const expectedTranslation = 'My Connections Translated';

      translateServiceSpy.instant.mockReturnValue(expectedTranslation);

      const result = service.handleTranslateTo(menuName);

      expect(translateServiceSpy.instant).toHaveBeenCalledWith(expectedKey);
      expect(result).toBe(expectedTranslation);
    });

    it('should handle menu name with multiple spaces', () => {
      const menuName = 'My Network  Connections';
      const expectedKey = 'NetworkLandingPage.MyNetworkConnections';

      translateServiceSpy.instant.mockReturnValue('translated');

      service.handleTranslateTo(menuName);

      expect(translateServiceSpy.instant).toHaveBeenCalledWith(expectedKey);
    });

    it('should handle empty menu name', () => {
      const menuName = '';
      const expectedKey = 'NetworkLandingPage.';

      translateServiceSpy.instant.mockReturnValue('');

      service.handleTranslateTo(menuName);

      expect(translateServiceSpy.instant).toHaveBeenCalledWith(expectedKey);
    });
  });
});