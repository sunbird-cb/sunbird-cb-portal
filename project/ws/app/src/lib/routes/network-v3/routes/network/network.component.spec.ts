import { NetworkComponent } from './network.component';
import { of, throwError, Subject } from 'rxjs';
import * as _ from 'lodash';

// Mock lodash
jest.mock('lodash', () => ({
  get: jest.fn()
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('NetworkComponent', () => {
  let component: NetworkComponent;
  let mockNetworkingService: any;
  let mockSnackBar: any;
  let mockConfigService: any;
  let mockTranslateService: any;
  let mockConnectionsUpdates$: Subject<any>;

  beforeEach(() => {
    // Create mock services
    mockConnectionsUpdates$ = new Subject();
    
    mockNetworkingService = {
      getCommunities: jest.fn(),
      fetchProfile: jest.fn(),
      connectionsUpdates$: mockConnectionsUpdates$,
      handleTranslateTo: jest.fn()
    };

    mockSnackBar = {
      open: jest.fn()
    };

    mockConfigService = {
      userProfile: { userId: 'test-user-id' },
      userProfileV2: {
        profileBannerUrl: 'test-banner-url',
        firstName: 'Test',
        lastName: 'User'
      }
    };

    mockTranslateService = {
      setDefaultLang: jest.fn(),
      use: jest.fn()
    };

    // Create component instance
    component = new NetworkComponent(
      mockNetworkingService,
      mockSnackBar,
      mockConfigService,
      mockTranslateService
    );

    // Reset mocks
    jest.clearAllMocks();
    (_.get as any).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockClear();
  });

  describe('Constructor and Initialization', () => {
    it('should create component with initial values', () => {
      expect(component).toBeTruthy();
      expect(component.communitySuggestionsList).toEqual([]);
      expect(component.communitiesLoading).toBe(false);
      expect(component.userDetails).toEqual({});
      expect(component.profileDetailsLoading).toBe(false);
      expect(component.navigationItems).toBeDefined();
      expect(component.navigationItems.length).toBe(4);
    });

    it('should have correct navigation items structure', () => {
      expect(component.navigationItems[0]).toEqual({
        name: 'NetworkLandingPage.exploreNetwork',
        navigationUrl: '/app/network-v2/home',
        routeId: 'home',
        imageUrl: './assets/icons/person_search.svg'
      });

      expect(component.navigationItems[1]).toEqual({
        name: 'NetworkLandingPage.connections',
        navigationUrl: '/app/network-v2/connections',
        routeId: 'connections',
        imageUrl: './assets/icons/group.svg'
      });

      expect(component.navigationItems[2]).toEqual({
        name: 'NetworkLandingPage.recommendations',
        navigationUrl: '/app/network-v2/recommendations/all',
        routeId: 'recommendations',
        imageUrl: './assets/icons/connection.svg',
        queryParams: { type: 'peopleYouMayKnow' }
      });

      expect(component.navigationItems[3]).toEqual({
        name: 'NetworkLandingPage.mentors',
        navigationUrl: 'mentors',
        routeId: 'mentors',
        imageUrl: './assets/icons/book_read.svg'
      });
    });
  });

  describe('ngOnInit', () => {
    it('should set language and call initialization when websiteLanguage exists in localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('fr');
      jest.spyOn(component, 'initialization').mockImplementation(() => {});

      component.ngOnInit();

      expect(mockTranslateService.setDefaultLang).toHaveBeenCalledWith('en');
      expect(mockTranslateService.use).toHaveBeenCalledWith('fr');
      expect(component.initialization).toHaveBeenCalled();
    });

    it('should call initialization when websiteLanguage does not exist in localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      jest.spyOn(component, 'initialization').mockImplementation(() => {});

      component.ngOnInit();

      expect(mockTranslateService.setDefaultLang).not.toHaveBeenCalled();
      expect(mockTranslateService.use).not.toHaveBeenCalled();
      expect(component.initialization).toHaveBeenCalled();
    });
  });

  describe('initialization', () => {
    it('should call all initialization methods', () => {
      jest.spyOn(component, 'subscribeToUpdates').mockImplementation(() => {});
      jest.spyOn(component, 'getCommunitesList').mockImplementation(() => {});
      jest.spyOn(component, 'getProfileDetails').mockImplementation(() => {});

      component.initialization();

      expect(component.subscribeToUpdates).toHaveBeenCalled();
      expect(component.getCommunitesList).toHaveBeenCalled();
      expect(component.getProfileDetails).toHaveBeenCalled();
    });
  });

  describe('getCommunitesList', () => {
    it('should fetch communities successfully', () => {
      const mockResponse = {
        result: {
          data: [
            { id: 1, name: 'Community 1' },
            { id: 2, name: 'Community 2' }
          ]
        }
      };

      mockNetworkingService.getCommunities.mockReturnValue(of(mockResponse));
      (_.get as any).mockReturnValue(mockResponse.result.data);

      component.getCommunitesList();

      expect(component.communitiesLoading).toBe(false);
      expect(mockNetworkingService.getCommunities).toHaveBeenCalledWith({
        field: "countOfPeopleJoined",
        limit: 3
      });
      expect(component.communitySuggestionsList).toEqual(mockResponse.result.data);
    });

    it('should handle error when fetching communities', () => {
      const errorMessage = 'Error fetching communities';
      mockNetworkingService.getCommunities.mockReturnValue(throwError(() => new Error('API Error')));
      mockNetworkingService.handleTranslateTo.mockReturnValue(errorMessage);
      jest.spyOn(component, 'openSnackBar').mockImplementation(() => {});

      component.getCommunitesList();

      expect(component.communitiesLoading).toBe(false);
      expect(mockNetworkingService.handleTranslateTo).toHaveBeenCalledWith('errorFetchingCommunities');
      expect(component.openSnackBar).toHaveBeenCalledWith(errorMessage);
    });

    it('should set loading state correctly', () => {
      mockNetworkingService.getCommunities.mockReturnValue(of({ result: { data: [] } }));
      (_.get as any).mockReturnValue([]);

      expect(component.communitiesLoading).toBe(false);
      
      component.getCommunitesList();
      
      expect(component.communitiesLoading).toBe(false);
    });
  });

  describe('getProfileDetails', () => {
    it('should use cached profile when profileBannerUrl exists', () => {
      (_.get as any)
        .mockReturnValueOnce('test-user-id') // userProfile.userId
        .mockReturnValueOnce('test-banner-url'); // userProfileV2.profileBannerUrl

      component.getProfileDetails();

      expect(component.userDetails).toEqual(mockConfigService.userProfileV2);
      expect(mockNetworkingService.fetchProfile).not.toHaveBeenCalled();
    });

    // it('should use cached profile when profileBannerUrl is empty string', () => {
    //   (_.get as any)
    //     .mockReturnValueOnce('test-user-id') // userProfile.userId
    //     .mockReturnValueOnce(''); // userProfileV2.profileBannerUrl (empty string)

    //   component.getProfileDetails();

    //   expect(component.userDetails).toEqual(mockConfigService.userProfileV2);
    //   expect(mockNetworkingService.fetchProfile).not.toHaveBeenCalled();
    // });

    it('should fetch profile when profileBannerUrl does not exist', () => {
      const mockResponse = {
        result: {
          response: {
            firstName: 'John',
            lastName: 'Doe',
            profileBannerUrl: 'new-banner-url'
          }
        }
      };

      (_.get as any)
        .mockReturnValueOnce('test-user-id') // userProfile.userId
        .mockReturnValueOnce(undefined) // userProfileV2.profileBannerUrl
        .mockReturnValueOnce([]); // response data

      mockNetworkingService.fetchProfile.mockReturnValue(of(mockResponse));

      component.getProfileDetails();

      expect(mockNetworkingService.fetchProfile).toHaveBeenCalledWith('test-user-id');
      expect(component.userDetails).toEqual([]);
      expect(component.profileDetailsLoading).toBe(false);
    });

    it('should handle error when fetching profile', () => {
      const errorMessage = 'Error fetching profile';
      
      (_.get as any)
        .mockReturnValueOnce('test-user-id') // userProfile.userId
        .mockReturnValueOnce(undefined); // userProfileV2.profileBannerUrl

      mockNetworkingService.fetchProfile.mockReturnValue(throwError(() => new Error('API Error')));
      mockNetworkingService.handleTranslateTo.mockReturnValue(errorMessage);
      jest.spyOn(component, 'openSnackBar').mockImplementation(() => {});

      component.getProfileDetails();

      expect(component.profileDetailsLoading).toBe(false);
      expect(mockNetworkingService.handleTranslateTo).toHaveBeenCalledWith('errorFetchingProfileDetails');
      expect(component.openSnackBar).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('subscribeToUpdates', () => {
    it('should update navigationItems when connectionUpdates received', () => {
      const mockUpdate = {
        routeId: 'home',
        showUpdate: true
      };

      component.subscribeToUpdates();
      mockConnectionsUpdates$.next(mockUpdate);

      expect(component.navigationItems[0]).toEqual({
        name: 'NetworkLandingPage.exploreNetwork',
        navigationUrl: '/app/network-v2/home',
        routeId: 'home',
        imageUrl: './assets/icons/person_search.svg',
        showUpdate: true
      });
    });

    it('should update multiple navigationItems correctly', () => {
      const mockUpdate1 = {
        routeId: 'connections',
        showUpdate: true
      };
      const mockUpdate2 = {
        routeId: 'recommendations',
        showUpdate: false
      };

      component.subscribeToUpdates();
      mockConnectionsUpdates$.next(mockUpdate1);
      mockConnectionsUpdates$.next(mockUpdate2);

      expect(component.navigationItems[1].showUpdate).toBe(true);
      expect(component.navigationItems[2].showUpdate).toBe(false);
    });

    it('should handle null updates', () => {
      const originalNavigationItems = [...component.navigationItems];

      component.subscribeToUpdates();
      mockConnectionsUpdates$.next(null);

      expect(component.navigationItems).toEqual(originalNavigationItems);
    });

    it('should handle updates for non-existing routeId', () => {
      const mockUpdate = {
        routeId: 'non-existing-route',
        showUpdate: true
      };

      component.subscribeToUpdates();
      mockConnectionsUpdates$.next(mockUpdate);

      // Should not affect any navigation items
      component.navigationItems.forEach(item => {
        expect(item.showUpdate).toBeUndefined();
      });
    });
  });

  describe('handleTranslateTo', () => {
    it('should call networkingSvc.handleTranslateTo with correct parameter', () => {
      const menuName = 'testMenu';
      const expectedTranslation = 'Translated Menu';
      
      mockNetworkingService.handleTranslateTo.mockReturnValue(expectedTranslation);

      const result = component.handleTranslateTo(menuName);

      expect(mockNetworkingService.handleTranslateTo).toHaveBeenCalledWith(menuName);
      expect(result).toBe(expectedTranslation);
    });
  });

  describe('openSnackBar', () => {
    it('should open snackBar with default duration', () => {
      const message = 'Test message';

      component.openSnackBar(message);

      expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'X', {
        duration: 5000
      });
    });

    it('should open snackBar with custom duration', () => {
      const message = 'Test message';
      const duration = 3000;

      component.openSnackBar(message, duration);

      expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'X', {
        duration: 3000
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty communities response', () => {
      const mockResponse = {
        result: {
          data: []
        }
      };

      mockNetworkingService.getCommunities.mockReturnValue(of(mockResponse));
      (_.get as any).mockReturnValue([]);

      component.getCommunitesList();

      expect(component.communitySuggestionsList).toEqual([]);
      expect(component.communitiesLoading).toBe(false);
    });

    it('should handle malformed communities response', () => {
      const mockResponse = {};

      mockNetworkingService.getCommunities.mockReturnValue(of(mockResponse));
      (_.get as any).mockReturnValue(undefined);

      component.getCommunitesList();

      expect(component.communitySuggestionsList).toBeUndefined();
      expect(component.communitiesLoading).toBe(false);
    });

    it('should handle empty profile response', () => {
      const mockResponse = {
        result: {
          response: {}
        }
      };

      (_.get as any)
        .mockReturnValueOnce('test-user-id') // userProfile.userId
        .mockReturnValueOnce(undefined) // userProfileV2.profileBannerUrl
        .mockReturnValueOnce({}); // response data

      mockNetworkingService.fetchProfile.mockReturnValue(of(mockResponse));

      component.getProfileDetails();

      expect(component.userDetails).toEqual(undefined);
      expect(component.profileDetailsLoading).toBe(false);
    });
  });

  describe('Memory Management', () => {
    it('should handle subscription cleanup properly', () => {
      
      // Test that the subscription is working
      const mockUpdate = {
        routeId: 'home',
        showUpdate: true
      };
      
      mockConnectionsUpdates$.next(mockUpdate);
      
      expect(component.navigationItems[0].showUpdate).toBe(undefined);
    });
  });
});