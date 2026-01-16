import { of, throwError } from 'rxjs';
import { profileEntriesResolver } from './profile-entries.resolver';

// Mock implementations
const mockProfileV2RevampService = {
  fetchProfileEntries: jest.fn()
} as any;

const mockConfigurationsService = {
  userProfile: {
    userId: 'default-user-id'
  }
} as any;

const mockActivatedRouteSnapshot = {
  routeConfig: { path: '' },
  params: {},
  queryParams: {}
} as any;

const mockRouterStateSnapshot = {} as any;

describe('profileEntriesResolver', () => {
  let resolver: profileEntriesResolver;
  let profileService: any;
  let configService: any;
  let route: any;
  let state: any;

  beforeEach(() => {
    // Reset mocks
    profileService = { ...mockProfileV2RevampService };
    configService = { ...mockConfigurationsService };
    route = { ...mockActivatedRouteSnapshot };
    state = { ...mockRouterStateSnapshot };
    
    // Clear all mock calls
    jest.clearAllMocks();
    
    resolver = new profileEntriesResolver(profileService, configService);
  });

  describe('resolve method', () => {
    it('should resolve profile entries for "me" path using config service userId', (done) => {
      const mockResponse = {
        result: {
          response: {
            userId: 'default-user-id',
            firstName: 'John',
            lastName: 'Doe'
          }
        }
      };

      route.routeConfig = { path: 'me' };
      profileService.fetchProfileEntries = jest.fn().mockReturnValue(of(mockResponse));

      resolver.resolve(route, state).subscribe((result: any) => {
        expect(result.data).toEqual(mockResponse.result.response);
        expect(result.error).toBeNull();
        expect(profileService.fetchProfileEntries).toHaveBeenCalledWith('default-user-id');
        done();
      });
    });

    it('should resolve profile entries for non-"me" path using route params userId', (done) => {
      const mockResponse = {
        result: {
          response: {
            userId: 'route-param-user-id',
            firstName: 'Jane',
            lastName: 'Smith'
          }
        }
      };

      route.routeConfig = { path: 'profile/:userId' };
      route.params = { userId: 'route-param-user-id' };
      profileService.fetchProfileEntries = jest.fn().mockReturnValue(of(mockResponse));

      resolver.resolve(route, state).subscribe((result: any) => {
        expect(result.data).toEqual(mockResponse.result.response);
        expect(result.error).toBeNull();
        expect(profileService.fetchProfileEntries).toHaveBeenCalledWith('route-param-user-id');
        done();
      });
    });

    it('should resolve profile entries using query params userId when route params userId is not available', (done) => {
      const mockResponse = {
        result: {
          response: {
            userId: 'query-param-user-id',
            firstName: 'Bob',
            lastName: 'Johnson'
          }
        }
      };

      route.routeConfig = { path: 'profile' };
      route.params = {};
      route.queryParams = { userId: 'query-param-user-id' };
      profileService.fetchProfileEntries = jest.fn().mockReturnValue(of(mockResponse));

      resolver.resolve(route, state).subscribe((result: any) => {
        expect(result.data).toEqual(mockResponse.result.response);
        expect(result.error).toBeNull();
        expect(profileService.fetchProfileEntries).toHaveBeenCalledWith('query-param-user-id');
        done();
      });
    });

    it('should fallback to config service userId when route and query params are not available', (done) => {
      const mockResponse = {
        result: {
          response: {
            userId: 'default-user-id',
            firstName: 'Alice',
            lastName: 'Wilson'
          }
        }
      };

      route.routeConfig = { path: 'profile' };
      route.params = {};
      route.queryParams = {};
      profileService.fetchProfileEntries = jest.fn().mockReturnValue(of(mockResponse));

      resolver.resolve(route, state).subscribe((result: any) => {
        expect(result.data).toEqual(mockResponse.result.response);
        expect(result.error).toBeNull();
        expect(profileService.fetchProfileEntries).toHaveBeenCalledWith('default-user-id');
        done();
      });
    });

    it('should handle empty string userId gracefully', (done) => {
      const mockResponse = {
        result: {
          response: {
            userId: '',
            firstName: 'Test',
            lastName: 'User'
          }
        }
      };

      route.routeConfig = { path: 'profile' };
      route.params = {};
      route.queryParams = {};
      configService.userProfile = null;
      profileService.fetchProfileEntries = jest.fn().mockReturnValue(of(mockResponse));

      resolver.resolve(route, state).subscribe((result: any) => {
        expect(result.data).toEqual(mockResponse.result.response);
        expect(result.error).toBeNull();
        expect(profileService.fetchProfileEntries).toHaveBeenCalledWith('');
        done();
      });
    });

    it('should handle null routeConfig gracefully', (done) => {
      const mockResponse = {
        result: {
          response: {
            userId: 'default-user-id',
            firstName: 'Test',
            lastName: 'User'
          }
        }
      };

      route.routeConfig = null;
      route.params = { userId: 'param-user-id' };
      profileService.fetchProfileEntries = jest.fn().mockReturnValue(of(mockResponse));

      resolver.resolve(route, state).subscribe((result: any) => {
        expect(result.data).toEqual(mockResponse.result.response);
        expect(result.error).toBeNull();
        expect(profileService.fetchProfileEntries).toHaveBeenCalledWith('param-user-id');
        done();
      });
    });

    it('should handle error from profile service', (done) => {
      const mockError = new Error('Profile service error');

      route.routeConfig = { path: 'me' };
      profileService.fetchProfileEntries = jest.fn().mockReturnValue(throwError(mockError));

      resolver.resolve(route, state).subscribe((result: any) => {
        expect(result.data).toBeNull();
        expect(result.error).toEqual(mockError);
        expect(profileService.fetchProfileEntries).toHaveBeenCalledWith('default-user-id');
        done();
      });
    });

    it('should handle response with no result.response data', (done) => {
      const mockResponse = {
        result: {}
      };

      route.routeConfig = { path: 'me' };
      profileService.fetchProfileEntries = jest.fn().mockReturnValue(of(mockResponse));

      resolver.resolve(route, state).subscribe((result: any) => {
        expect(result.data).toBeUndefined();
        expect(result.error).toBeNull();
        expect(profileService.fetchProfileEntries).toHaveBeenCalledWith('default-user-id');
        done();
      });
    });

    it('should handle response with null result', (done) => {
      const mockResponse = {
        result: null
      };

      route.routeConfig = { path: 'me' };
      profileService.fetchProfileEntries = jest.fn().mockReturnValue(of(mockResponse));

      resolver.resolve(route, state).subscribe((result: any) => {
        expect(result.data).toBeUndefined();
        expect(result.error).toBeNull();
        expect(profileService.fetchProfileEntries).toHaveBeenCalledWith('default-user-id');
        done();
      });
    });

    it('should handle completely empty response', (done) => {
      const mockResponse = {};

      route.routeConfig = { path: 'me' };
      profileService.fetchProfileEntries = jest.fn().mockReturnValue(of(mockResponse));

      resolver.resolve(route, state).subscribe((result: any) => {
        expect(result.data).toBeUndefined();
        expect(result.error).toBeNull();
        expect(profileService.fetchProfileEntries).toHaveBeenCalledWith('default-user-id');
        done();
      });
    });

    it('should prioritize route params over query params', (done) => {
      const mockResponse = {
        result: {
          response: {
            userId: 'route-param-user-id',
            firstName: 'Priority',
            lastName: 'Test'
          }
        }
      };

      route.routeConfig = { path: 'profile/:userId' };
      route.params = { userId: 'route-param-user-id' };
      route.queryParams = { userId: 'query-param-user-id' };
      profileService.fetchProfileEntries = jest.fn().mockReturnValue(of(mockResponse));

      resolver.resolve(route, state).subscribe((result: any) => {
        expect(result.data).toEqual(mockResponse.result.response);
        expect(result.error).toBeNull();
        expect(profileService.fetchProfileEntries).toHaveBeenCalledWith('route-param-user-id');
        done();
      });
    });

    it('should handle undefined config service userProfile', (done) => {
      const mockResponse = {
        result: {
          response: {
            userId: '',
            firstName: 'Empty',
            lastName: 'User'
          }
        }
      };

      route.routeConfig = { path: 'profile' };
      route.params = {};
      route.queryParams = {};
      configService.userProfile = undefined;
      profileService.fetchProfileEntries = jest.fn().mockReturnValue(of(mockResponse));

      resolver.resolve(route, state).subscribe((result: any) => {
        expect(result.data).toEqual(mockResponse.result.response);
        expect(result.error).toBeNull();
        expect(profileService.fetchProfileEntries).toHaveBeenCalledWith('');
        done();
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});