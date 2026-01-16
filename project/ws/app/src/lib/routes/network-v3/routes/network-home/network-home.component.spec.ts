import { NetworkHomeComponent } from './network-home.component';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import * as _ from 'lodash';

// Mock lodash
jest.mock('lodash', () => ({
  get: jest.fn()
}));

describe('NetworkHomeComponent', () => {
  let component: NetworkHomeComponent;
  let mockRouter: any;
  let mockSnackBar: any;
  let mockNetworkingService: any;

  beforeEach(() => {
    // Create mock services
    mockRouter = {
      navigate: jest.fn()
    };

    mockSnackBar = {
      open: jest.fn()
    };

    mockNetworkingService = {
      getConnectionRequests: jest.fn(),
      getRecommendedUsers: jest.fn(),
      getRecommendedMentors: jest.fn(),
      sendConnectionUpdates: jest.fn(),
      handleTranslateTo: jest.fn()
    };

    // Create component instance
    component = new NetworkHomeComponent(
      mockRouter,
      mockSnackBar,
      mockNetworkingService
    );

    // Reset mocks
    jest.clearAllMocks();
    (_.get as any).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor and Initialization', () => {
    it('should create component with initial values', () => {
      expect(component).toBeTruthy();
      expect(component.connectionRequestsList).toEqual([]);
      expect(component.connectionsLoading).toBe(false);
      expect(component.connectionRequestsCount).toBe(0);
      expect(component.peopleYouMayKnowList).toEqual([]);
      expect(component.peopleYouMayKnowCount).toBe(0);
      expect(component.suggestionsLoading).toBe(false);
      expect(component.mentorSuggestionsList).toEqual([]);
      expect(component.mentorsLoading).toBe(false);
    });

    it('should have correct sliderConfig', () => {
      expect(component.sliderConfig).toEqual({
        showNavs: true,
        showDots: true,
        cerificateCardMargin: false,
        showNavsSpacing: true,
        dotsAlign: true,
        responsive: {
          dotsAlign: true,
          showDots: true,
        }
      });
    });
  });

  describe('ngOnInit', () => {
    it('should call initialization method', () => {
      jest.spyOn(component, 'initialization').mockImplementation(() => {});

      component.ngOnInit();

      expect(component.initialization).toHaveBeenCalled();
    });
  });

  describe('initialization', () => {
    it('should call all initialization methods', () => {
      jest.spyOn(component, 'getConnectionRequests').mockImplementation(() => {});
      jest.spyOn(component, 'getPeopleYouMayKnow').mockImplementation(() => {});
      jest.spyOn(component, 'getMentorSuggestions').mockImplementation(() => {});

      component.initialization();

      expect(component.getConnectionRequests).toHaveBeenCalled();
      expect(component.getPeopleYouMayKnow).toHaveBeenCalled();
      expect(component.getMentorSuggestions).toHaveBeenCalled();
    });
  });

  describe('getConnectionRequests', () => {
    it('should fetch connection requests successfully', () => {
      const mockResponse = {
        data: [
          { id: 1, name: 'User 1' },
          { id: 2, name: 'User 2' }
        ],
        count: 2
      };

      mockNetworkingService.getConnectionRequests.mockReturnValue(of(mockResponse));
      (_.get as any)
        .mockReturnValueOnce(mockResponse.data) // for data
        .mockReturnValueOnce(mockResponse.count); // for count

      component.getConnectionRequests();

      expect(mockNetworkingService.getConnectionRequests).toHaveBeenCalledWith(0, 3);
      expect(component.connectionsLoading).toBe(false);
      expect(component.connectionRequestsList).toEqual(mockResponse.data);
      expect(component.connectionRequestsCount).toBe(2);
      expect(mockNetworkingService.sendConnectionUpdates).toHaveBeenCalledWith({
        routeId: 'connections',
        showUpdate: true
      });
    });

    it('should handle empty connection requests response', () => {
      const mockResponse = {
        data: [],
        count: 0
      };

      mockNetworkingService.getConnectionRequests.mockReturnValue(of(mockResponse));
      (_.get as any)
        .mockReturnValueOnce([]) // for data
        .mockReturnValueOnce(0); // for count

      component.getConnectionRequests();

      expect(component.connectionRequestsList).toEqual([]);
      expect(component.connectionRequestsCount).toBe(0);
      expect(mockNetworkingService.sendConnectionUpdates).toHaveBeenCalledWith({
        routeId: 'connections',
        showUpdate: false
      });
    });

    it('should handle error when fetching connection requests', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'API Error',
        status: 500,
        statusText: 'Internal Server Error'
      });
      const errorMessage = 'Failed to fetch connection requests';

      mockNetworkingService.getConnectionRequests.mockReturnValue(throwError(() => errorResponse));
      mockNetworkingService.handleTranslateTo.mockReturnValue(errorMessage);
      jest.spyOn(component, 'openSnackbar').mockImplementation(() => {});

      component.getConnectionRequests();

      expect(component.connectionsLoading).toBe(false);
      expect(mockNetworkingService.handleTranslateTo).toHaveBeenCalledWith('NetworkLandingPage.failedToFetchConnectionRequests');
      expect(component.openSnackbar).toHaveBeenCalledWith(errorMessage, 3000);
    });

    it('should handle undefined response properties', () => {
      const mockResponse = {};

      mockNetworkingService.getConnectionRequests.mockReturnValue(of(mockResponse));
      (_.get as any)
        .mockReturnValueOnce([]) // for data with default
        .mockReturnValueOnce(0); // for count with default

      component.getConnectionRequests();

      expect(component.connectionRequestsList).toEqual([]);
      expect(component.connectionRequestsCount).toBe(0);
    });
  });

  describe('getPeopleYouMayKnow', () => {
    it('should fetch people you may know successfully', () => {
      const mockResponse = {
        result: {
          response: [
            { id: 1, name: 'Person 1' },
            { id: 2, name: 'Person 2' }
          ],
          count: 2
        }
      };

      mockNetworkingService.getRecommendedUsers.mockReturnValue(of(mockResponse));
      (_.get as any)
        .mockReturnValueOnce(mockResponse.result.response) // for response
        .mockReturnValueOnce(mockResponse.result.count); // for count

      component.getPeopleYouMayKnow();

      expect(mockNetworkingService.getRecommendedUsers).toHaveBeenCalledWith({
        size: 6,
        offset: 0
      });
      expect(component.suggestionsLoading).toBe(false);
      expect(component.peopleYouMayKnowList).toEqual(mockResponse.result.response);
      expect(component.peopleYouMayKnowCount).toBe(2);
    });

    it('should handle empty people you may know response', () => {
      const mockResponse = {
        result: {
          response: [],
          count: 0
        }
      };

      mockNetworkingService.getRecommendedUsers.mockReturnValue(of(mockResponse));
      (_.get as any)
        .mockReturnValueOnce([]) // for response
        .mockReturnValueOnce(0); // for count

      component.getPeopleYouMayKnow();

      expect(component.peopleYouMayKnowList).toEqual([]);
      expect(component.peopleYouMayKnowCount).toBe(0);
    });

    it('should handle error when fetching people you may know', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'API Error',
        status: 500,
        statusText: 'Internal Server Error'
      });
      const errorMessage = 'Failed to fetch people you may know';

      mockNetworkingService.getRecommendedUsers.mockReturnValue(throwError(() => errorResponse));
      mockNetworkingService.handleTranslateTo.mockReturnValue(errorMessage);
      jest.spyOn(component, 'openSnackbar').mockImplementation(() => {});

      component.getPeopleYouMayKnow();

      expect(component.suggestionsLoading).toBe(false);
      expect(mockNetworkingService.handleTranslateTo).toHaveBeenCalledWith('NetworkLandingPage.failedToFetchPeopleYouMayKnow');
      expect(component.openSnackbar).toHaveBeenCalledWith(errorMessage, 3000);
    });

    it('should handle undefined response properties', () => {
      const mockResponse = {};

      mockNetworkingService.getRecommendedUsers.mockReturnValue(of(mockResponse));
      (_.get as any)
        .mockReturnValueOnce([]) // for response with default
        .mockReturnValueOnce(0); // for count with default

      component.getPeopleYouMayKnow();

      expect(component.peopleYouMayKnowList).toEqual([]);
      expect(component.peopleYouMayKnowCount).toBe(0);
    });
  });

  describe('getMentorSuggestions', () => {
    it('should fetch mentor suggestions successfully', () => {
      const mockResponse = {
        result: {
          response: [
            { id: 1, name: 'Mentor 1' },
            { id: 2, name: 'Mentor 2' }
          ]
        }
      };

      mockNetworkingService.getRecommendedMentors.mockReturnValue(of(mockResponse));
      (_.get as any).mockReturnValueOnce(mockResponse.result.response);

      component.getMentorSuggestions();

      expect(mockNetworkingService.getRecommendedMentors).toHaveBeenCalledWith({
        size: 15,
        offset: 0
      });
      expect(component.mentorsLoading).toBe(false);
      expect(component.mentorSuggestionsList).toEqual(mockResponse.result.response);
    });

    it('should handle empty mentor suggestions response', () => {
      const mockResponse = {
        result: {
          response: []
        }
      };

      mockNetworkingService.getRecommendedMentors.mockReturnValue(of(mockResponse));
      (_.get as any).mockReturnValueOnce([]);

      component.getMentorSuggestions();

      expect(component.mentorSuggestionsList).toEqual([]);
    });

    it('should handle error when fetching mentor suggestions', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'API Error',
        status: 500,
        statusText: 'Internal Server Error'
      });
      const errorMessage = 'Failed to fetch mentor suggestions';

      mockNetworkingService.getRecommendedMentors.mockReturnValue(throwError(() => errorResponse));
      mockNetworkingService.handleTranslateTo.mockReturnValue(errorMessage);
      jest.spyOn(component, 'openSnackbar').mockImplementation(() => {});

      component.getMentorSuggestions();

      expect(component.mentorsLoading).toBe(false);
      expect(mockNetworkingService.handleTranslateTo).toHaveBeenCalledWith('NetworkLandingPage.failedToFetchMentorSuggestions');
      expect(component.openSnackbar).toHaveBeenCalledWith(errorMessage, 3000);
    });

    it('should handle undefined response properties', () => {
      const mockResponse = {};

      mockNetworkingService.getRecommendedMentors.mockReturnValue(of(mockResponse));
      (_.get as any).mockReturnValueOnce([]);

      component.getMentorSuggestions();

      expect(component.mentorSuggestionsList).toEqual([]);
    });
  });

  describe('showAll', () => {
    it('should navigate to connections page for connectionRequests', () => {
      component.showAll('connectionRequests');

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/app/network-v2/connections'], {
        queryParams: { tab: 'request' }
      });
    });

    it('should navigate to recommendations page for peopleYouMayKnow', () => {
      component.showAll('peopleYouMayKnow');

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/app/network-v2/recommendations/all'], {
        queryParams: { type: 'peopleYouMayKnow' }
      });
    });

    it('should navigate to mentors page for showAllMentors', () => {
      component.showAll('showAllMentors');

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/app/network-v2/mentors']);
    });

    it('should not navigate for unknown type', () => {
      component.showAll('unknownType');

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should not navigate for empty type', () => {
      component.showAll('');

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should not navigate for null type', () => {
      component.showAll(null as any);

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should not navigate for undefined type', () => {
      component.showAll(undefined as any);

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('showEmptyData getter', () => {
    it('should return true when all lists are empty and loading is false', () => {
      component.connectionRequestsList = [];
      component.connectionsLoading = false;
      component.peopleYouMayKnowList = [];
      component.suggestionsLoading = false;
      component.mentorSuggestionsList = [];
      component.mentorsLoading = false;

      expect(component.showEmptyData).toBe(true);
    });

    it('should return false when connectionRequestsList has items', () => {
      component.connectionRequestsList = [{ id: 1 }];
      component.connectionsLoading = false;
      component.peopleYouMayKnowList = [];
      component.suggestionsLoading = false;
      component.mentorSuggestionsList = [];
      component.mentorsLoading = false;

      expect(component.showEmptyData).toBe(false);
    });

    it('should return false when peopleYouMayKnowList has items', () => {
      component.connectionRequestsList = [];
      component.connectionsLoading = false;
      component.peopleYouMayKnowList = [{ id: 1 }];
      component.suggestionsLoading = false;
      component.mentorSuggestionsList = [];
      component.mentorsLoading = false;

      expect(component.showEmptyData).toBe(false);
    });

    it('should return false when mentorSuggestionsList has items', () => {
      component.connectionRequestsList = [];
      component.connectionsLoading = false;
      component.peopleYouMayKnowList = [];
      component.suggestionsLoading = false;
      component.mentorSuggestionsList = [{ id: 1 }];
      component.mentorsLoading = false;

      expect(component.showEmptyData).toBe(false);
    });

    it('should return false when connectionsLoading is true', () => {
      component.connectionRequestsList = [];
      component.connectionsLoading = true;
      component.peopleYouMayKnowList = [];
      component.suggestionsLoading = false;
      component.mentorSuggestionsList = [];
      component.mentorsLoading = false;

      expect(component.showEmptyData).toBe(false);
    });

    it('should return false when suggestionsLoading is true', () => {
      component.connectionRequestsList = [];
      component.connectionsLoading = false;
      component.peopleYouMayKnowList = [];
      component.suggestionsLoading = true;
      component.mentorSuggestionsList = [];
      component.mentorsLoading = false;

      expect(component.showEmptyData).toBe(false);
    });

    it('should return false when mentorsLoading is true', () => {
      component.connectionRequestsList = [];
      component.connectionsLoading = false;
      component.peopleYouMayKnowList = [];
      component.suggestionsLoading = false;
      component.mentorSuggestionsList = [];
      component.mentorsLoading = true;

      expect(component.showEmptyData).toBe(false);
    });

    it('should return false when multiple conditions are not met', () => {
      component.connectionRequestsList = [{ id: 1 }];
      component.connectionsLoading = true;
      component.peopleYouMayKnowList = [{ id: 1 }];
      component.suggestionsLoading = true;
      component.mentorSuggestionsList = [{ id: 1 }];
      component.mentorsLoading = true;

      expect(component.showEmptyData).toBe(false);
    });
  });

  describe('handleTranslateTo', () => {
    it('should call networkingService.handleTranslateTo with correct parameter', () => {
      const menuName = 'testMenu';
      const expectedTranslation = 'Translated Menu';

      mockNetworkingService.handleTranslateTo.mockReturnValue(expectedTranslation);

      const result = component.handleTranslateTo(menuName);

      expect(mockNetworkingService.handleTranslateTo).toHaveBeenCalledWith(menuName);
      expect(result).toBe(expectedTranslation);
    });

    it('should handle empty menu name', () => {
      const menuName = '';
      const expectedTranslation = '';

      mockNetworkingService.handleTranslateTo.mockReturnValue(expectedTranslation);

      const result = component.handleTranslateTo(menuName);

      expect(mockNetworkingService.handleTranslateTo).toHaveBeenCalledWith(menuName);
      expect(result).toBe(expectedTranslation);
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
      const duration = 3000;

      component.openSnackbar(message, duration);

      expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'X', {
        duration: 3000
      });
    });

    it('should handle empty message', () => {
      const message = '';

      component.openSnackbar(message);

      expect(mockSnackBar.open).toHaveBeenCalledWith('', 'X', {
        duration: 5000
      });
    });

    it('should handle zero duration', () => {
      const message = 'Test message';
      const duration = 0;

      component.openSnackbar(message, duration);

      expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'X', {
        duration: 0
      });
    });
  });

  describe('Loading States', () => {
    it('should set loading states correctly during API calls', () => {
      // Mock delayed responses
      mockNetworkingService.getConnectionRequests.mockReturnValue(of({}));
      mockNetworkingService.getRecommendedUsers.mockReturnValue(of({}));
      mockNetworkingService.getRecommendedMentors.mockReturnValue(of({}));

      // Initial state
      expect(component.connectionsLoading).toBe(false);
      expect(component.suggestionsLoading).toBe(false);
      expect(component.mentorsLoading).toBe(false);

      // Call methods - loading should be handled within the methods
      component.getConnectionRequests();
      component.getPeopleYouMayKnow();
      component.getMentorSuggestions();

      // After completion
      expect(component.connectionsLoading).toBe(false);
      expect(component.suggestionsLoading).toBe(false);
      expect(component.mentorsLoading).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle multiple simultaneous errors', () => {
      const connectionError = new HttpErrorResponse({
        error: 'Connection Error',
        status: 500,
        statusText: 'Server Error'
      });
      const recommendationError = new HttpErrorResponse({
        error: 'Recommendation Error',
        status: 404,
        statusText: 'Not Found'
      });
      const mentorError = new HttpErrorResponse({
        error: 'Mentor Error',
        status: 403,
        statusText: 'Forbidden'
      });

      mockNetworkingService.getConnectionRequests.mockReturnValue(throwError(() => connectionError));
      mockNetworkingService.getRecommendedUsers.mockReturnValue(throwError(() => recommendationError));
      mockNetworkingService.getRecommendedMentors.mockReturnValue(throwError(() => mentorError));
      mockNetworkingService.handleTranslateTo.mockReturnValue('Error message');
      jest.spyOn(component, 'openSnackbar').mockImplementation(() => {});

      component.getConnectionRequests();
      component.getPeopleYouMayKnow();
      component.getMentorSuggestions();

      expect(component.connectionsLoading).toBe(false);
      expect(component.suggestionsLoading).toBe(false);
      expect(component.mentorsLoading).toBe(false);
      expect(component.openSnackbar).toHaveBeenCalledTimes(3);
    });

    it('should handle null error responses', () => {
      mockNetworkingService.getConnectionRequests.mockReturnValue(throwError(() => null));
      jest.spyOn(component, 'openSnackbar').mockImplementation(() => {});

      component.getConnectionRequests();

      expect(component.connectionsLoading).toBe(false);
      expect(component.openSnackbar).toHaveBeenCalled();
    });
  });

  describe('Data Integrity', () => {
    it('should maintain data consistency across multiple API calls', () => {
      const connectionResponse = { data: [{ id: 1 }], count: 1 };
      const recommendationResponse = { result: { response: [{ id: 2 }], count: 1 } };
      const mentorResponse = { result: { response: [{ id: 3 }] } };

      mockNetworkingService.getConnectionRequests.mockReturnValue(of(connectionResponse));
      mockNetworkingService.getRecommendedUsers.mockReturnValue(of(recommendationResponse));
      mockNetworkingService.getRecommendedMentors.mockReturnValue(of(mentorResponse));

      (_.get as any)
        .mockReturnValueOnce(connectionResponse.data)
        .mockReturnValueOnce(connectionResponse.count)
        .mockReturnValueOnce(recommendationResponse.result.response)
        .mockReturnValueOnce(recommendationResponse.result.count)
        .mockReturnValueOnce(mentorResponse.result.response);

      component.getConnectionRequests();
      component.getPeopleYouMayKnow();
      component.getMentorSuggestions();

      expect(component.connectionRequestsList).toEqual([{ id: 1 }]);
      expect(component.peopleYouMayKnowList).toEqual([{ id: 2 }]);
      expect(component.mentorSuggestionsList).toEqual([{ id: 3 }]);
    });
  });
});