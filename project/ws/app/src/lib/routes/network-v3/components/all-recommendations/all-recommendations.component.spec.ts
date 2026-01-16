import { AllRecommendationsComponent } from './all-recommendations.component';
import { PageChangeEmitter } from '../../models/network-v3.model';
import { of, throwError, Subject } from 'rxjs';
import * as _ from 'lodash';

// Mock lodash to avoid import issues
jest.mock('lodash', () => ({
  get: jest.fn()
}));

describe('AllRecommendationsComponent', () => {
  let component: AllRecommendationsComponent;
  let mockSnackBar: any;
  let mockNetworkingService: any;
  let mockSubscription: any;

  beforeEach(() => {
    // Create comprehensive mocks
    mockSnackBar = {
      open: jest.fn()
    };

    mockNetworkingService = {
      getRecommendedUsers: jest.fn(),
      handleTranslateTo: jest.fn()
    };

    mockSubscription = {
      unsubscribe: jest.fn()
    };

    // Mock window.scrollTo
    Object.defineProperty(window, 'scrollTo', {
      value: jest.fn(),
      writable: true
    });

    // Initialize component
    component = new AllRecommendationsComponent(mockSnackBar, mockNetworkingService);
    
    // Set up default mock implementations
    mockNetworkingService.getRecommendedUsers.mockReturnValue(of({
      result: {
        response: [],
        count: 0
      }
    }));
    mockNetworkingService.handleTranslateTo.mockReturnValue('Translated text');
    (_.get as any).mockReturnValue([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create component with default values', () => {
      expect(component).toBeTruthy();
      expect(component.title).toBe('NetworkLandingPage.peopleYouMayKnow');
      expect(component.recommendationList).toEqual([]);
      expect(component.paginationSize).toBe(10);
      expect(component.paginationSizeOptions).toEqual([10, 20, 30, 40]);
      expect(component.paginationPage).toBe(1);
      expect(component.totalItemsCount).toBe(0);
      expect(component.recommendationListLoading).toBe(false);
      expect(component.defaultPaginationSize).toBe(10);
    });

    it('should call getRecommendationsList on ngOnInit', () => {
      const getRecommendationsListSpy = jest.spyOn(component, 'getRecommendationsList');
      
      component.ngOnInit();
      
      expect(getRecommendationsListSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getRecommendationsList', () => {
    it('should call networking service with correct parameters', () => {
      component.paginationSize = 20;
      component.paginationPage = 2;
      
      component.getRecommendationsList();
      
      expect(mockNetworkingService.getRecommendedUsers).toHaveBeenCalledWith({
        size: 20,
        offset: 1
      });
    });

    it('should unsubscribe from previous subscription if exists', () => {
      component.apiCallSubscription = mockSubscription;
      
      component.getRecommendationsList();
      
      expect(mockSubscription.unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should set loading state during API call', () => {
      const subject = new Subject<any>();
      mockNetworkingService.getRecommendedUsers.mockReturnValue(subject.asObservable());

      component.getRecommendationsList();

      expect(component.recommendationListLoading).toBe(true);

      // Complete the observable to clean up
      subject.next({ result: { response: [], count: 0 } });
      subject.complete();
    });

    it('should handle successful response', () => {
      const mockResponse = {
        result: {
          response: [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }],
          count: 25
        }
      };
      
      mockNetworkingService.getRecommendedUsers.mockReturnValue(of(mockResponse));
      (_.get as any).mockImplementation((path: string, defaultValue: any) => {
        if (path === 'result.response') return mockResponse.result.response;
        if (path === 'result.count') return mockResponse.result.count;
        return defaultValue;
      });
      
      component.getRecommendationsList();
      
      expect(component.recommendationListLoading).toBe(false);
      expect(component.recommendationList).toEqual('result.response');
      expect(component.totalItemsCount).toBe('result.count');
      expect(_.get).toHaveBeenCalledWith(mockResponse, 'result.response', []);
      expect(_.get).toHaveBeenCalledWith(mockResponse, 'result.count', 0);
    });

    it('should handle API error', () => {
      const mockError = new Error('API Error');
      mockNetworkingService.getRecommendedUsers.mockReturnValue(throwError(mockError));
      mockNetworkingService.handleTranslateTo.mockReturnValue('Error message');
      const openSnackbarSpy = jest.spyOn(component, 'openSnackbar');
      
      component.getRecommendationsList();
      
      expect(component.recommendationListLoading).toBe(false);
      expect(mockNetworkingService.handleTranslateTo).toHaveBeenCalledWith('NetworkLandingPage.errorWhileFetchingRecommendations');
      expect(openSnackbarSpy).toHaveBeenCalledWith('Error message');
    });

    it('should not call openSnackbar when error is null or undefined', () => {
      mockNetworkingService.getRecommendedUsers.mockReturnValue(throwError(null));
      const openSnackbarSpy = jest.spyOn(component, 'openSnackbar');
      
      component.getRecommendationsList();
      
      expect(component.recommendationListLoading).toBe(false);
      expect(openSnackbarSpy).not.toHaveBeenCalled();
    });
  });

  describe('onPageChange', () => {
    it('should update pagination values and call getRecommendationsList', async () => {
      const mockEvent: PageChangeEmitter = {
        currentPage: 3,
        previousPage: 2,
        limit: 30
      };
      const scrollToTopSpy = jest.spyOn(component, 'scrollToTop');
      const getRecommendationsListSpy = jest.spyOn(component, 'getRecommendationsList');
      
      await component.onPageChange(mockEvent);
      
      expect(scrollToTopSpy).toHaveBeenCalledTimes(1);
      expect(component.paginationPage).toBe(3);
      expect(component.paginationSize).toBe(30);
      expect(getRecommendationsListSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle page change with different values', async () => {
      const mockEvent: PageChangeEmitter = {
        currentPage: 1,
        previousPage: 0,
        limit: 10
      };
      const scrollToTopSpy = jest.spyOn(component, 'scrollToTop');
      const getRecommendationsListSpy = jest.spyOn(component, 'getRecommendationsList');
      
      await component.onPageChange(mockEvent);
      
      expect(scrollToTopSpy).toHaveBeenCalledTimes(1);
      expect(component.paginationPage).toBe(1);
      expect(component.paginationSize).toBe(10);
      expect(getRecommendationsListSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('scrollToTop', () => {
    it('should call window.scrollTo with correct parameters', () => {
      component.scrollToTop();
      
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
  });

  describe('handleTranslateTo', () => {
    it('should call networking service handleTranslateTo and return result', () => {
      const menuName = 'test.menu';
      const expectedResult = 'Translated Menu';
      mockNetworkingService.handleTranslateTo.mockReturnValue(expectedResult);
      
      const result = component.handleTranslateTo(menuName);
      
      expect(mockNetworkingService.handleTranslateTo).toHaveBeenCalledWith(menuName);
      expect(result).toBe(expectedResult);
    });

    it('should handle different menu names', () => {
      const testCases = [
        { input: 'menu.home', output: 'Home' },
        { input: 'menu.profile', output: 'Profile' },
        { input: 'error.network', output: 'Network Error' }
      ];
      
      testCases.forEach((testCase, index) => {
        mockNetworkingService.handleTranslateTo.mockReturnValue(testCase.output);
        
        const result = component.handleTranslateTo(testCase.input);
        
        expect(result).toBe(testCase.output);
        expect(mockNetworkingService.handleTranslateTo).toHaveBeenNthCalledWith(index + 1, testCase.input);
      });
    });
  });

  describe('openSnackbar', () => {
    it('should call snackBar.open with default duration', () => {
      const primaryMsg = 'Test message';
      
      component.openSnackbar(primaryMsg);
      
      expect(mockSnackBar.open).toHaveBeenCalledWith(primaryMsg, 'X', {
        duration: 5000
      });
    });

    it('should call snackBar.open with custom duration', () => {
      const primaryMsg = 'Test message';
      const customDuration = 3000;
      
      component.openSnackbar(primaryMsg, customDuration);
      
      expect(mockSnackBar.open).toHaveBeenCalledWith(primaryMsg, 'X', {
        duration: customDuration
      });
    });

    it('should handle empty message', () => {
      const primaryMsg = '';
      
      component.openSnackbar(primaryMsg);
      
      expect(mockSnackBar.open).toHaveBeenCalledWith('', 'X', {
        duration: 5000
      });
    });

    it('should handle zero duration', () => {
      const primaryMsg = 'Test message';
      const zeroDuration = 0;
      
      component.openSnackbar(primaryMsg, zeroDuration);
      
      expect(mockSnackBar.open).toHaveBeenCalledWith(primaryMsg, 'X', {
        duration: 0
      });
    });
  });

  describe('Component Properties', () => {
    it('should maintain correct pagination size options', () => {
      expect(component.paginationSizeOptions).toHaveLength(4);
      expect(component.paginationSizeOptions).toContain(10);
      expect(component.paginationSizeOptions).toContain(20);
      expect(component.paginationSizeOptions).toContain(30);
      expect(component.paginationSizeOptions).toContain(40);
    });

    it('should allow setting recommendation list', () => {
      const mockList = [{ id: 1, name: 'Test User' }];
      component.recommendationList = mockList;
      
      expect(component.recommendationList).toEqual(mockList);
    });

    it('should allow setting total items count', () => {
      const count = 100;
      component.totalItemsCount = count;
      
      expect(component.totalItemsCount).toBe(count);
    });

    it('should allow setting loading state', () => {
      component.recommendationListLoading = true;
      expect(component.recommendationListLoading).toBe(true);
      
      component.recommendationListLoading = false;
      expect(component.recommendationListLoading).toBe(false);
    });
  });

  describe('API Subscription Management', () => {
    it('should store subscription reference', () => {
      const mockObservable = of({ result: { response: [], count: 0 } });
      mockNetworkingService.getRecommendedUsers.mockReturnValue(mockObservable);
      
      component.getRecommendationsList();
      
      expect(component.apiCallSubscription).toBeDefined();
    });

    it('should handle multiple consecutive API calls', () => {
      const firstSubscription = { unsubscribe: jest.fn() };
      component.apiCallSubscription = firstSubscription;
      
      component.getRecommendationsList();
      
      expect(firstSubscription.unsubscribe).toHaveBeenCalledTimes(1);
      expect(component.apiCallSubscription).toBeDefined();
    });
  });

  describe('Integration Tests', () => {
    it('should complete full flow: init -> page change -> API call', async () => {
      const getRecommendationsListSpy = jest.spyOn(component, 'getRecommendationsList');
      
      // Initialize component
      component.ngOnInit();
      expect(getRecommendationsListSpy).toHaveBeenCalledTimes(1);
      
      // Change page
      const pageChangeEvent: PageChangeEmitter = {
        currentPage: 2,
        previousPage: 1,
        limit: 20
      };
      await component.onPageChange(pageChangeEvent);
      
      expect(component.paginationPage).toBe(2);
      expect(component.paginationSize).toBe(20);
      expect(getRecommendationsListSpy).toHaveBeenCalledTimes(2);
    });

    it('should handle error flow with snackbar', () => {
      const errorMessage = 'Network error occurred';
      mockNetworkingService.getRecommendedUsers.mockReturnValue(throwError(new Error('API Error')));
      mockNetworkingService.handleTranslateTo.mockReturnValue(errorMessage);
      
      component.getRecommendationsList();
      
      expect(mockNetworkingService.handleTranslateTo).toHaveBeenCalledWith('NetworkLandingPage.errorWhileFetchingRecommendations');
      expect(mockSnackBar.open).toHaveBeenCalledWith(errorMessage, 'X', { duration: 5000 });
      expect(component.recommendationListLoading).toBe(false);
    });
  });
});