import { MentorsComponent } from './mentors.component';
import { of, throwError } from 'rxjs';
import { PageChangeEmitter } from '../../models/network-v3.model';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';

// Mock environment
jest.mock('src/environments/environment', () => ({
  environment: {
    contentHost: 'https://test-content-host.com'
  }
}));

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true
});

// Mock window.open
Object.defineProperty(window, 'open', {
  value: jest.fn(),
  writable: true
});

describe('MentorsComponent', () => {
  let component: MentorsComponent;
  let mockSnackBar: any;
  let mockNetworkingService: any;

  beforeEach(() => {
    // Mock MatLegacySnackBar
    mockSnackBar = {
      open: jest.fn()
    };

    // Mock NetworkingService
    mockNetworkingService = {
      getRecommendedMentors: jest.fn(),
      handleTranslateTo: jest.fn()
    };

    // Create component instance
    component = new MentorsComponent(
      mockSnackBar,
      mockNetworkingService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create component with default values', () => {
      expect(component).toBeTruthy();
      expect(component.paginationSize).toBe(10);
      expect(component.paginationSizeOptions).toEqual([10, 20, 30, 40]);
      expect(component.paginationPage).toBe(1);
      expect(component.totalItemsCount).toBe(0);
      expect(component.defaultPaginationSize).toBe(10);
      expect(component.mentorsList).toEqual([]);
      expect(component.mentorsListLoading).toBe(false);
      expect(component.mentorsGetSubscription).toBeUndefined();
    });

    it('should initialize with correct pagination size options', () => {
      expect(component.paginationSizeOptions).toEqual([10, 20, 30, 40]);
    });

    it('should initialize with empty mentors list', () => {
      expect(component.mentorsList).toEqual([]);
    });
  });

  describe('ngOnInit', () => {
    it('should call getMentorsList on initialization', () => {
      const getMentorsListSpy = jest.spyOn(component, 'getMentorsList').mockImplementation();
      
      component.ngOnInit();
      
      expect(getMentorsListSpy).toHaveBeenCalled();
    });
  });

  describe('onPageChange', () => {
    const mockPageChangeEvent: PageChangeEmitter = {
      currentPage: 0,
      previousPage: 0,
      limit: 10,
    };

    it('should update pagination values and call getMentorsList', async () => {
      const scrollToTopSpy = jest.spyOn(component, 'scrollToTop').mockImplementation();
      const getMentorsListSpy = jest.spyOn(component, 'getMentorsList').mockImplementation();
      
      await component.onPageChange(mockPageChangeEvent);
      
      expect(scrollToTopSpy).toHaveBeenCalled();
      expect(component.paginationPage).toBe(0);
      expect(component.paginationSize).toBe(10);
      expect(getMentorsListSpy).toHaveBeenCalled();
    });

    it('should handle page change with different event values', async () => {
      const differentEvent: PageChangeEmitter = {
        currentPage: 1,
        previousPage: 0,
        limit: 40
      };
      const scrollToTopSpy = jest.spyOn(component, 'scrollToTop').mockImplementation();
      const getMentorsListSpy = jest.spyOn(component, 'getMentorsList').mockImplementation();
      
      await component.onPageChange(differentEvent);
      
      expect(scrollToTopSpy).toHaveBeenCalled();
      expect(component.paginationPage).toBe(1);
      expect(component.paginationSize).toBe(40);
      expect(getMentorsListSpy).toHaveBeenCalled();
    });
  });

  describe('scrollToTop', () => {
    it('should call window.scrollTo with correct parameters', () => {
      component.scrollToTop();
      
      expect(window.scrollTo).toHaveBeenCalledWith({ 
        top: 0, 
        behavior: 'smooth' 
      });
    });
  });

  describe('getMentorsList', () => {
    const mockSuccessResponse = {
      result: {
        response: [
          { id: 1, name: 'Mentor 1', expertise: 'JavaScript' },
          { id: 2, name: 'Mentor 2', expertise: 'Angular' }
        ],
        count: 25
      }
    };

    it('should fetch mentors list successfully', () => {
      mockNetworkingService.getRecommendedMentors.mockReturnValue(of(mockSuccessResponse));
      component.paginationPage = 2;
      component.paginationSize = 15;
      
      component.getMentorsList();
      
      expect(mockNetworkingService.getRecommendedMentors).toHaveBeenCalledWith({
        size: 15,
        offset: 1
      });
      expect(component.mentorsListLoading).toBe(false);
      expect(component.mentorsList).toEqual(mockSuccessResponse.result.response);
      expect(component.totalItemsCount).toBe(25);
    });

    it('should set loading state correctly during API call', () => {
      mockNetworkingService.getRecommendedMentors.mockReturnValue(of(mockSuccessResponse));
      
      component.getMentorsList();
      
      expect(component.mentorsListLoading).toBe(false); // Should be false after completion
    });

    it('should handle empty response gracefully', () => {
      const emptyResponse = {
        result: {
          response: [],
          count: 0
        }
      };
      mockNetworkingService.getRecommendedMentors.mockReturnValue(of(emptyResponse));
      
      component.getMentorsList();
      
      expect(component.mentorsList).toEqual([]);
      expect(component.totalItemsCount).toBe(0);
      expect(component.mentorsListLoading).toBe(false);
    });

    it('should handle missing result properties', () => {
      const incompleteResponse = {};
      mockNetworkingService.getRecommendedMentors.mockReturnValue(of(incompleteResponse));
      
      component.getMentorsList();
      
      expect(component.mentorsList).toEqual([]);
      expect(component.totalItemsCount).toBe(0);
      expect(component.mentorsListLoading).toBe(false);
    });

    it('should unsubscribe from previous subscription before making new request', () => {
      const mockSubscription = { unsubscribe: jest.fn() };
      component.mentorsGetSubscription = mockSubscription;
      mockNetworkingService.getRecommendedMentors.mockReturnValue(of(mockSuccessResponse));
      
      component.getMentorsList();
      
      expect(mockSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('should handle API error and show snackbar', () => {
      const errorMessage = 'Network error';
      mockNetworkingService.getRecommendedMentors.mockReturnValue(throwError(errorMessage));
      mockNetworkingService.handleTranslateTo.mockReturnValue('Translated error message');
      const openSnackbarSpy = jest.spyOn(component, 'openSnackbar').mockImplementation();
      
      component.getMentorsList();
      
      expect(component.mentorsListLoading).toBe(false);
      expect(mockNetworkingService.handleTranslateTo).toHaveBeenCalledWith('NetworkLandingPage.noMentorsFoundatTheMomentPleaseTryAgain');
      expect(openSnackbarSpy).toHaveBeenCalledWith('Translated error message');
    });

    it('should not show snackbar if error is falsy', () => {
      mockNetworkingService.getRecommendedMentors.mockReturnValue(throwError(null));
      const openSnackbarSpy = jest.spyOn(component, 'openSnackbar').mockImplementation();
      
      component.getMentorsList();
      
      expect(component.mentorsListLoading).toBe(false);
      expect(openSnackbarSpy).not.toHaveBeenCalled();
    });

    it('should handle undefined error gracefully', () => {
      mockNetworkingService.getRecommendedMentors.mockReturnValue(throwError(undefined));
      const openSnackbarSpy = jest.spyOn(component, 'openSnackbar').mockImplementation();
      
      component.getMentorsList();
      
      expect(component.mentorsListLoading).toBe(false);
      expect(openSnackbarSpy).not.toHaveBeenCalled();
    });
  });

  describe('descoverMentors', () => {
    it('should open mentor directory in new tab', () => {
      component.descoverMentors();
      
      expect(window.open).toHaveBeenCalledWith(
        `${environment.contentHost}/mentorship/tabs/mentor-directory`,
        '_blank'
      );
    });

    it('should use correct environment contentHost', () => {
      component.descoverMentors();
      
      expect(window.open).toHaveBeenCalledWith(
        'https://test-content-host.com/mentorship/tabs/mentor-directory',
        '_blank'
      );
    });
  });

  describe('handleTranslateTo', () => {
    it('should call networkingService handleTranslateTo with correct parameter', () => {
      const menuName = 'NetworkLandingPage.testMessage';
      const expectedTranslation = 'Translated message';
      mockNetworkingService.handleTranslateTo.mockReturnValue(expectedTranslation);
      
      const result = component.handleTranslateTo(menuName);
      
      expect(mockNetworkingService.handleTranslateTo).toHaveBeenCalledWith(menuName);
      expect(result).toBe(expectedTranslation);
    });

    it('should return translated string', () => {
      const menuName = 'NetworkLandingPage.error';
      const translatedText = 'Error occurred';
      mockNetworkingService.handleTranslateTo.mockReturnValue(translatedText);
      
      const result = component.handleTranslateTo(menuName);
      
      expect(result).toBe(translatedText);
    });
  });

  describe('openSnackbar', () => {
    it('should open snackbar with default duration', () => {
      const message = 'Test message';
      
      component.openSnackbar(message);
      
      expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'X', {
        duration: 5000
      });
    });

    it('should open snackbar with custom duration', () => {
      const message = 'Test message';
      const customDuration = 3000;
      
      component.openSnackbar(message, customDuration);
      
      expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'X', {
        duration: customDuration
      });
    });

    it('should handle empty message', () => {
      const emptyMessage = '';
      
      component.openSnackbar(emptyMessage);
      
      expect(mockSnackBar.open).toHaveBeenCalledWith(emptyMessage, 'X', {
        duration: 5000
      });
    });

    it('should handle zero duration', () => {
      const message = 'Test message';
      const zeroDuration = 0;
      
      component.openSnackbar(message, zeroDuration);
      
      expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'X', {
        duration: zeroDuration
      });
    });
  });

  describe('Pagination Logic', () => {
    it('should calculate correct offset for pagination', () => {
      mockNetworkingService.getRecommendedMentors.mockReturnValue(of({ result: { response: [], count: 0 } }));
      component.paginationPage = 3;
      component.paginationSize = 20;
      
      component.getMentorsList();
      
      expect(mockNetworkingService.getRecommendedMentors).toHaveBeenCalledWith({
        size: 20,
        offset: 2 // paginationPage - 1
      });
    });

    it('should handle first page correctly', () => {
      mockNetworkingService.getRecommendedMentors.mockReturnValue(of({ result: { response: [], count: 0 } }));
      component.paginationPage = 1;
      component.paginationSize = 10;
      
      component.getMentorsList();
      
      expect(mockNetworkingService.getRecommendedMentors).toHaveBeenCalledWith({
        size: 10,
        offset: 0
      });
    });
  });

  describe('Subscription Management', () => {
    it('should not unsubscribe if no previous subscription exists', () => {
      component.mentorsGetSubscription = undefined;
      mockNetworkingService.getRecommendedMentors.mockReturnValue(of({ result: { response: [], count: 0 } }));
      
      expect(() => component.getMentorsList()).not.toThrow();
    });

    it('should store subscription after API call', () => {
      const mockObservable = of({ result: { response: [], count: 0 } });
      mockNetworkingService.getRecommendedMentors.mockReturnValue(mockObservable);
      
      component.getMentorsList();
      
      expect(component.mentorsGetSubscription).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null response', () => {
      mockNetworkingService.getRecommendedMentors.mockReturnValue(of(null));
      
      expect(() => component.getMentorsList()).not.toThrow();
      expect(component.mentorsList).toEqual([]);
      expect(component.totalItemsCount).toBe(0);
    });

    it('should handle response with null result', () => {
      mockNetworkingService.getRecommendedMentors.mockReturnValue(of({ result: null }));
      
      expect(() => component.getMentorsList()).not.toThrow();
      expect(component.mentorsList).toEqual([]);
      expect(component.totalItemsCount).toBe(0);
    });

    it('should handle page change with undefined event properties', async () => {
      const incompleteEvent: any = { currentPage: 2 };
      const scrollToTopSpy = jest.spyOn(component, 'scrollToTop').mockImplementation();
      const getMentorsListSpy = jest.spyOn(component, 'getMentorsList').mockImplementation();
      
      await component.onPageChange(incompleteEvent);
      
      expect(scrollToTopSpy).toHaveBeenCalled();
      expect(component.paginationPage).toBe(2);
      expect(component.paginationSize).toBeUndefined();
      expect(getMentorsListSpy).toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('should set loading to true before API call', () => {
      let loadingStateDuringCall = false;
      mockNetworkingService.getRecommendedMentors.mockImplementation(() => {
        loadingStateDuringCall = component.mentorsListLoading;
        return of({ result: { response: [], count: 0 } });
      });
      
      component.getMentorsList();
      
      expect(loadingStateDuringCall).toBe(true);
    });

    it('should set loading to false after successful API call', () => {
      mockNetworkingService.getRecommendedMentors.mockReturnValue(of({ result: { response: [], count: 0 } }));
      
      component.getMentorsList();
      
      expect(component.mentorsListLoading).toBe(false);
    });

    it('should set loading to false after failed API call', () => {
      mockNetworkingService.getRecommendedMentors.mockReturnValue(throwError('API Error'));
      
      component.getMentorsList();
      
      expect(component.mentorsListLoading).toBe(false);
    });
  });

  describe('Environment Integration', () => {
    it('should use environment contentHost for mentor directory link', () => {
      expect(environment.contentHost).toBe('https://test-content-host.com');
      
      component.descoverMentors();
      
      expect(window.open).toHaveBeenCalledWith(
        'https://test-content-host.com/mentorship/tabs/mentor-directory',
        '_blank'
      );
    });
  });
});