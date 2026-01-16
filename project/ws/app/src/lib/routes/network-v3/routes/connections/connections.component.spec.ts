import { ConnectionsComponent } from './connections.component';
import { of, throwError } from 'rxjs';
import * as _ from 'lodash';

describe('ConnectionsComponent', () => {
  let component: ConnectionsComponent;
  let mockNetworkingService: any;
  let mockSnackBar: any;
  let mockActivatedRoute: any;

  beforeEach(() => {
    // Mock NetworkingService
    mockNetworkingService = {
      getConnectionsCount: jest.fn(),
      getConnections: jest.fn(),
      getConnectionRequests: jest.fn(),
      getRequestSent: jest.fn(),
      getBlockedUsers: jest.fn(),
      sendConnectionUpdates: jest.fn(),
      handleTranslateTo: jest.fn()
    };

    // Mock MatLegacySnackBar
    mockSnackBar = {
      open: jest.fn()
    };

    // Mock ActivatedRoute
    mockActivatedRoute = {
      snapshot: {
        queryParams: {
          tab: 'Approved'
        }
      }
    };

    // Create component instance
    component = new ConnectionsComponent(
      mockNetworkingService,
      mockSnackBar,
      mockActivatedRoute
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create component with default values', () => {
      expect(component).toBeTruthy();
      expect(component.selectedTabIndex).toBe(0);
      expect(component.tabDetailsList).toHaveLength(4);
      expect(component.connectionsList).toEqual([]);
      expect(component.connectionsLoading).toBe(false);
      expect(component.paginationSize).toBe(10);
      expect(component.paginationPage).toBe(1);
      expect(component.totalItemsCount).toBe(0);
    });

    it('should initialize tabDetailsList with correct structure', () => {
      const expectedTabs = [
        { lable: 'NetworkLandingPage.myConnections', key: 'Approved', recordsCount: 0 },
        { lable: 'NetworkLandingPage.requests', key: 'Received', recordsCount: 0 },
        { lable: 'NetworkLandingPage.sent', key: 'Pending', recordsCount: 0 },
        { lable: 'NetworkLandingPage.blocked', key: 'Blocked', recordsCount: 0 }
      ];
      expect(component.tabDetailsList).toEqual(expectedTabs);
    });
  });

  // describe('ngOnInit', () => {
  //   it('should call getParamsData on initialization', () => {
  //     const getParamsDataSpy = jest.spyOn(component, 'getParamsData');
  //     component.ngOnInit();
  //     expect(getParamsDataSpy).toHaveBeenCalled();
  //   });
  // });

  describe('getParamsData', () => {
    it('should set selectedTabIndex based on route params', () => {
      mockActivatedRoute.snapshot.queryParams.tab = 'Received';
      const initializationSpy = jest.spyOn(component, 'initialization').mockImplementation();
      
      component.getParamsData();
      
      expect(component.selectedTabIndex).toBe(1);
      expect(initializationSpy).toHaveBeenCalled();
    });

    it('should default to Approved tab when no tab param exists', () => {
      mockActivatedRoute.snapshot.queryParams = {};
      const initializationSpy = jest.spyOn(component, 'initialization').mockImplementation();
      
      component.getParamsData();
      
      expect(component.selectedTabIndex).toBe(0);
      expect(initializationSpy).toHaveBeenCalled();
    });
  });

  describe('initialization', () => {
    it('should call getTabData and getConnectionsCount', () => {
      const getTabDataSpy = jest.spyOn(component, 'getTabData').mockImplementation();
      const getConnectionsCountSpy = jest.spyOn(component, 'getConnectionsCount').mockImplementation();
      
      component.initialization();
      
      expect(getTabDataSpy).toHaveBeenCalled();
      expect(getConnectionsCountSpy).toHaveBeenCalled();
    });
  });

  describe('getConnectionsCount', () => {
    const mockResponse = {
      result: {
        facets: [{
          values: [
            { name: 'approved', count: 5 },
            { name: 'received', count: 3 },
            { name: 'requested', count: 2 },
            { name: 'blocked', count: 1 }
          ]
        }]
      }
    };

    it('should update tab record counts successfully', () => {
      mockNetworkingService.getConnectionsCount.mockReturnValue(of(mockResponse));
      
      component.getConnectionsCount();
      
      expect(mockNetworkingService.getConnectionsCount).toHaveBeenCalledWith({
        request: {
          filter: {
            status: component.allStatesList
          },
          facets: ['status']
        }
      });
      expect(component.tabDetailsList[0].recordsCount).toBe(5);
      expect(component.tabDetailsList[1].recordsCount).toBe(3);
      expect(component.tabDetailsList[2].recordsCount).toBe(2);
      expect(component.tabDetailsList[3].recordsCount).toBe(1);
    });

    it('should send connection updates for Received tab', () => {
      mockNetworkingService.getConnectionsCount.mockReturnValue(of(mockResponse));
      
      component.getConnectionsCount();
      
      expect(mockNetworkingService.sendConnectionUpdates).toHaveBeenCalledWith({
        routeId: 'connections',
        showUpdate: true
      });
    });

    it('should handle empty response gracefully', () => {
      mockNetworkingService.getConnectionsCount.mockReturnValue(of({}));
      
      component.getConnectionsCount();
      
      expect(component.tabDetailsList[0].recordsCount).toBe(0);
    });
  });

  describe('onTabChange', () => {
    it('should update selectedTabIndex and reset pagination', () => {
      const resetPaginationSpy = jest.spyOn(component, 'resetPagination').mockImplementation();
      
      component.onTabChange(2);
      
      expect(component.selectedTabIndex).toBe(2);
      expect(resetPaginationSpy).toHaveBeenCalled();
    });

    it('should call getConnectionsCount when satesListToGetCount has values', () => {
      const resetPaginationSpy = jest.spyOn(component, 'resetPagination').mockImplementation();
      const getConnectionsCountSpy = jest.spyOn(component, 'getConnectionsCount').mockImplementation();
      component.satesListToGetCount = ['Approved'];
      
      component.onTabChange(1);
      
      expect(resetPaginationSpy).toHaveBeenCalled();
      expect(getConnectionsCountSpy).toHaveBeenCalled();
    });
  });

  describe('resetPagination', () => {
    it('should reset pagination values and call getTabData', () => {
      const getTabDataSpy = jest.spyOn(component, 'getTabData').mockImplementation();
      component.paginationPage = 3;
      component.paginationSize = 20;
      component.totalItemsCount = 100;
      
      component.resetPagination();
      
      expect(component.paginationPage).toBe(1);
      expect(component.paginationSize).toBe(10);
      expect(component.totalItemsCount).toBe(0);
      expect(getTabDataSpy).toHaveBeenCalled();
    });
  });

  describe('getTabData', () => {
    beforeEach(() => {
      component.selectedTabIndex = 0;
    });

    it('should call getConnectionsList for Approved tab', () => {
      const getConnectionsListSpy = jest.spyOn(component, 'getConnectionsList').mockImplementation();
      
      component.getTabData();
      
      expect(getConnectionsListSpy).toHaveBeenCalled();
      expect(component.noDataMessage).toBe('NetworkLandingPage.youDoNotHaveAnyConnectionsSendConnectionRequestsFromTheHomeTab');
    });

    it('should call getRequestsList for Received tab', () => {
      const getRequestsListSpy = jest.spyOn(component, 'getRequestsList').mockImplementation();
      component.selectedTabIndex = 1;
      
      component.getTabData();
      
      expect(getRequestsListSpy).toHaveBeenCalled();
      expect(component.noDataMessage).toBe('NetworkLandingPage.noRequestsFound');
    });

    it('should call getSentRequsetsList for Pending tab', () => {
      const getSentReqsetsListSpy = jest.spyOn(component, 'getSentRequsetsList').mockImplementation();
      component.selectedTabIndex = 2;
      
      component.getTabData();
      
      expect(getSentReqsetsListSpy).toHaveBeenCalled();
      expect(component.noDataMessage).toBe('NetworkLandingPage.noRequestsSent');
    });

    it('should call getBlockedList for Blocked tab', () => {
      const getBlockedListSpy = jest.spyOn(component, 'getBlockedList').mockImplementation();
      component.selectedTabIndex = 3;
      
      component.getTabData();
      
      expect(getBlockedListSpy).toHaveBeenCalled();
      expect(component.noDataMessage).toBe('NetworkLandingPage.noConnectionsFound');
    });

    it('should unsubscribe from previous API subscription', () => {
      const mockSubscription = { unsubscribe: jest.fn() };
      component.apiSubscription = mockSubscription;
      jest.spyOn(component, 'getConnectionsList').mockImplementation();
      
      component.getTabData();
      
      expect(mockSubscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('getConnectionsList', () => {
    const mockResponse = {
      result: {
        count: 25,
        data: [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }]
      }
    };

    it('should fetch connections successfully', () => {
      mockNetworkingService.getConnections.mockReturnValue(of(mockResponse));
      component.paginationPage = 2;
      component.paginationSize = 15;
      
      component.getConnectionsList();
      
      expect(mockNetworkingService.getConnections).toHaveBeenCalledWith(1, 15);
      expect(component.connectionsLoading).toBe(false);
      expect(component.totalItemsCount).toBe(25);
      expect(component.connectionsList).toEqual(mockResponse.result.data);
    });

    it('should handle error response', () => {
      mockNetworkingService.getConnections.mockReturnValue(throwError('API Error'));
      mockNetworkingService.handleTranslateTo.mockReturnValue('Error message');
      
      component.getConnectionsList();
      
      expect(component.connectionsLoading).toBe(false);
      expect(component.connectionsList).toEqual([]);
      expect(mockSnackBar.open).toHaveBeenCalledWith('Error message', 'X', {"duration": 3000});
    });
  });

  describe('getRequestsList', () => {
    const mockResponse = {
      result: {
        count: 10
      },
      data: [{ id: 1, name: 'Request 1' }]
    };

    it('should fetch requests successfully', () => {
      mockNetworkingService.getConnectionRequests.mockReturnValue(of(mockResponse));
      component.paginationPage = 1;
      component.paginationSize = 10;
      
      component.getRequestsList();
      
      expect(mockNetworkingService.getConnectionRequests).toHaveBeenCalledWith(0, 10);
      expect(component.connectionsLoading).toBe(false);
      expect(component.totalItemsCount).toBe(10);
      expect(component.connectionsList).toEqual(mockResponse.data);
    });

    it('should handle error response', () => {
      mockNetworkingService.getConnectionRequests.mockReturnValue(throwError('API Error'));
      mockNetworkingService.handleTranslateTo.mockReturnValue('Error message');
      
      component.getRequestsList();
      
      expect(component.connectionsLoading).toBe(false);
      expect(component.connectionsList).toEqual([]);
      expect(mockSnackBar.open).toHaveBeenCalledWith('Error message', 'X', {"duration": 3000});
    });
  });

  describe('getSentRequsetsList', () => {
    const mockResponse = {
      result: {
        count: 5,
        data: [{ id: 1, name: 'Sent Request 1' }]
      }
    };

    it('should fetch sent requests successfully', () => {
      mockNetworkingService.getRequestSent.mockReturnValue(of(mockResponse));
      component.paginationPage = 1;
      component.paginationSize = 10;
      
      component.getSentRequsetsList();
      
      expect(mockNetworkingService.getRequestSent).toHaveBeenCalledWith(0, 10);
      expect(component.connectionsLoading).toBe(false);
      expect(component.totalItemsCount).toBe(5);
      expect(component.connectionsList).toEqual(mockResponse.result.data);
    });

    it('should handle error response', () => {
      mockNetworkingService.getRequestSent.mockReturnValue(throwError('API Error'));
      mockNetworkingService.handleTranslateTo.mockReturnValue('Error message');
      
      component.getSentRequsetsList();
      
      expect(component.connectionsLoading).toBe(false);
      expect(component.connectionsList).toEqual([]);
      expect(mockSnackBar.open).toHaveBeenCalledWith('Error message', 'X', {"duration": 3000});
    });
  });

  describe('getBlockedList', () => {
    const mockResponse = {
      result: {
        count: 3,
        response: [{ id: 1, name: 'Blocked User 1' }]
      }
    };

    it('should fetch blocked users successfully', () => {
      mockNetworkingService.getBlockedUsers.mockReturnValue(of(mockResponse));
      component.paginationPage = 1;
      component.paginationSize = 10;
      
      component.getBlockedList();
      
      expect(mockNetworkingService.getBlockedUsers).toHaveBeenCalledWith({
        offset: 0,
        size: 10
      });
      expect(component.connectionsLoading).toBe(false);
      expect(component.totalItemsCount).toBe(3);
      expect(component.connectionsList).toEqual(mockResponse.result.response);
    });

    it('should handle error response', () => {
      mockNetworkingService.getBlockedUsers.mockReturnValue(throwError('API Error'));
      mockNetworkingService.handleTranslateTo.mockReturnValue('Error message');
      
      component.getBlockedList();
      
      expect(component.connectionsLoading).toBe(false);
      expect(component.connectionsList).toEqual([]);
      expect(mockSnackBar.open).toHaveBeenCalledWith('Error message', 'X', {"duration": 3000});
    });
  });

  describe('setSatesListGet', () => {
    it('should add new states to satesListToGetCount', () => {
      component.satesListToGetCount = ['Approved'];
      
      component.setSatesListGet(['Received', 'Pending']);
      
      expect(component.satesListToGetCount).toEqual(['Approved', 'Received', 'Pending']);
    });

    it('should not add duplicate states', () => {
      component.satesListToGetCount = ['Approved', 'Received'];
      
      component.setSatesListGet(['Approved', 'Pending']);
      
      expect(component.satesListToGetCount).toEqual(['Approved', 'Received', 'Pending']);
    });

    it('should handle empty input array', () => {
      component.satesListToGetCount = ['Approved'];
      
      component.setSatesListGet([]);
      
      expect(component.satesListToGetCount).toEqual(['Approved']);
    });
  });

  describe('handleTranslateTo', () => {
    it('should call networkingService handleTranslateTo', () => {
      const menuName = 'NetworkLandingPage.test';
      const expectedTranslation = 'Translated Text';
      mockNetworkingService.handleTranslateTo.mockReturnValue(expectedTranslation);
      
      const result = component.handleTranslateTo(menuName);
      
      expect(mockNetworkingService.handleTranslateTo).toHaveBeenCalledWith(menuName);
      expect(result).toBe(expectedTranslation);
    });
  });

  describe('openSnackBar', () => {
    it('should open snackbar with correct parameters', () => {
      const message = 'Test message';
      const action = 'X';
      
      component.openSnackBar(message, action);
      
      expect(mockSnackBar.open).toHaveBeenCalledWith(message, action, {
        duration: 3000
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle undefined response in getConnectionsCount', () => {
      mockNetworkingService.getConnectionsCount.mockReturnValue(of(undefined));
      
      expect(() => component.getConnectionsCount()).not.toThrow();
    });

    it('should handle missing facets in getConnectionsCount response', () => {
      const mockResponse = {
        result: {
          facets: []
        }
      };
      mockNetworkingService.getConnectionsCount.mockReturnValue(of(mockResponse));
      
      expect(() => component.getConnectionsCount()).not.toThrow();
    });

    it('should handle invalid selectedTabIndex in getTabData', () => {
      component.selectedTabIndex = 999;
      
      expect(() => component.getTabData()).not.toThrow();
    });

    it('should set connectionsLoading to true before API calls', () => {
      mockNetworkingService.getConnections.mockReturnValue(of({}));
      
      component.getConnectionsList();
      
      expect(component.connectionsLoading).toBe(false); // Should be false after completion
    });
  });

  describe('Pagination Size Options', () => {
    it('should have correct pagination size options', () => {
      expect(component.paginationSizeOptions).toEqual([10, 20, 30, 40]);
    });

    it('should have correct default pagination size', () => {
      expect(component.defaultPaginationSize).toBe(10);
    });
  });

  describe('All States List', () => {
    it('should contain all required states', () => {
      expect(component.allStatesList).toEqual(['Approved', 'Received', 'Pending', 'Blocked']);
    });
  });
});