import { EventEmitter } from '@angular/core';
import { ConnectionsCardComponent } from './connections-card.component';
import { of, throwError } from 'rxjs';

describe('ConnectionsCardComponent', () => {
  let component: ConnectionsCardComponent;
  let mockSnackBar: any;
  let mockRouter: any;
  let mockConfigSvc: any;
  let mockNetworkingSvc: any;
  let mockDialog: any;
  let mockEvents: any;

  beforeEach(() => {
    // Mock dependencies
    mockSnackBar = {
      open: jest.fn()
    };

    mockRouter = {
      navigate: jest.fn()
    };

    mockConfigSvc = {
      userProfileV2: {
        userId: 'user123',
        firstName: 'John',
        departmentName: 'IT Department'
      }
    };

    mockNetworkingSvc = {
      updateConnectionRequest: jest.fn(),
      handleTranslateTo: jest.fn().mockReturnValue('Translated Text')
    };

    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true))
      })
    };

    mockEvents = {
      raiseInteractTelemetry: jest.fn()
    };

    // Create component instance
    component = new ConnectionsCardComponent(
      mockSnackBar,
      mockRouter,
      mockConfigSvc,
      mockNetworkingSvc,
      mockDialog,
      mockEvents
    );

    // Initialize component properties
    component.getCountOf = new EventEmitter<string[]>();
    component.otherUserProfile = {
      fullName: 'Jane Doe',
      userId: 'user456',
      id: 'connection123',
      departmentName: 'HR Department',
      profileImageUrl: 'test-image.jpg'
    };
  });

  describe('Component Initialization', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.currentTab).toBe('Requested');
      expect(component.showBorder).toBe(true);
      expect(component.nameInitials).toBe('');
      expect(component.fullName).toBe('');
    });

    it('should call required methods on ngOnInit', () => {
      const getInitialsSpy = jest.spyOn(component, 'getInitials');
      const getCurrentUserDetailsSpy = jest.spyOn(component, 'getCurrentUserDetails');

      component.ngOnInit();

      expect(getInitialsSpy).toHaveBeenCalled();
      expect(getCurrentUserDetailsSpy).toHaveBeenCalled();
    });
  });

  describe('getInitials', () => {
    it('should generate initials for full name with two words', () => {
      component.otherUserProfile = { fullName: 'John Doe' };
      
      component.getInitials();

      expect(component.fullName).toBe('John Doe');
      expect(component.nameInitials).toBe('JD');
    });

    it('should generate initial for single word name', () => {
      component.otherUserProfile = { fullName: 'John' };
      
      component.getInitials();

      expect(component.fullName).toBe('John');
      expect(component.nameInitials).toBe('J');
    });

    it('should handle empty name', () => {
      component.otherUserProfile = {};
      
      component.getInitials();

      expect(component.fullName).toBe('');
      expect(component.nameInitials).toBe('');
    });

    it('should fallback to personalDetails.firstname when fullName is not available', () => {
      component.otherUserProfile = { 
        personalDetails: { firstname: 'Jane' }
      };
      
      component.getInitials();

      expect(component.fullName).toBe('Jane');
      expect(component.nameInitials).toBe('J');
    });
  });

  describe('getCurrentUserDetails', () => {
    it('should set currentUserDetails from configSvc', () => {
      component.getCurrentUserDetails();

      expect(component.currentUserDetails).toEqual(mockConfigSvc.userProfileV2);
    });
  });

  describe('goToUserProfile', () => {
    it('should navigate to user profile when userId exists', () => {
      component.otherUserProfile = { userId: 'user456' };

      component.goToUserProfile();

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/person-profile', 'user456'],
        { fragment: 'profileInfo' }
      );
    });

    it('should not navigate when userId is missing', () => {
      component.otherUserProfile = {};

      component.goToUserProfile();

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('copyProfile', () => {
    beforeEach(() => {
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn()
        }
      });
      Object.defineProperty(window, 'location', {
        value: { origin: 'https://test.com' },
        writable: true
      });
    });

    it('should copy profile link to clipboard successfully', async () => {
      const mockClipboard = navigator.clipboard.writeText as jest.Mock;
      mockClipboard.mockResolvedValue(undefined);
      component.otherUserProfile = { userId: 'user456' };
      const openSnackbarSpy = jest.spyOn(component, 'openSnackbar');

      await component.copyProfile();

      expect(mockClipboard).toHaveBeenCalledWith(
        'https://test.com/app/person-profile/user456#profileInfo'
      );
      expect(openSnackbarSpy).toHaveBeenCalledWith('Profile link copied to clipboard');
    });

    it('should handle clipboard write failure', async () => {
      const mockClipboard = navigator.clipboard.writeText as jest.Mock;
      mockClipboard.mockRejectedValue(new Error('Clipboard error'));
      component.otherUserProfile = { userId: 'user456' };
      const openSnackbarSpy = jest.spyOn(component, 'openSnackbar');

      await component.copyProfile();

      expect(openSnackbarSpy).toHaveBeenCalledWith('Failed to copy link');
    });
  });

  describe('viewProfile', () => {
    it('should navigate to user profile', () => {
      component.otherUserProfile = { userId: 'user456' };

      component.viewProfile();

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/person-profile', 'user456'],
        { fragment: 'profileInfo' }
      );
    });
  });

  describe('openConformationPopup', () => {
    it('should open confirmation dialog for Rejected action', () => {
      component.openConformationPopup('Rejected');

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockNetworkingSvc.handleTranslateTo).toHaveBeenCalledWith(
        'areYouSureYouWantToIgnoreThisRequest'
      );
    });

    it('should open confirmation dialog for Withdrawn action', () => {
      component.openConformationPopup('Withdrawn');

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockNetworkingSvc.handleTranslateTo).toHaveBeenCalledWith(
        'areYouSureYouWantToWithdrawThisRequest'
      );
    });

    it('should call updateConnection directly for Approved action', () => {
      const updateConnectionSpy = jest.spyOn(component, 'updateConnection');

      component.openConformationPopup('Approved');

      expect(updateConnectionSpy).toHaveBeenCalledWith('Approved');
      expect(mockDialog.open).not.toHaveBeenCalled();
    });

    it('should call updateConnection when dialog is confirmed', () => {
      const updateConnectionSpy = jest.spyOn(component, 'updateConnection');
      
      component.openConformationPopup('Rejected');

      expect(updateConnectionSpy).toHaveBeenCalledWith('Rejected');
    });
  });

  describe('updateConnection', () => {
    beforeEach(() => {
      component.currentUserDetails = mockConfigSvc.userProfileV2;
      component.fullName = 'Jane Doe';
      component.otherUserProfile = {
        id: 'connection123',
        userId: 'user456',
        departmentName: 'HR Department'
      };
    });

    it('should update connection successfully for Approved action', () => {
      const mockResponse = { success: true };
      mockNetworkingSvc.updateConnectionRequest.mockReturnValue(of(mockResponse));
      const getCountOfSpy = jest.spyOn(component.getCountOf, 'emit');

      component.updateConnection('Approved');

      expect(mockNetworkingSvc.updateConnectionRequest).toHaveBeenCalledWith({
        connectionId: 'connection123',
        userIdFrom: 'user123',
        userNameFrom: 'John',
        userDepartmentFrom: 'IT Department',
        userIdTo: 'user456',
        userNameTo: 'Jane Doe',
        userDepartmentTo: 'HR Department',
        status: 'Approved'
      });
      expect(component.otherUserProfile.connectionStatus).toBe('Approved');
      expect(getCountOfSpy).toHaveBeenCalledWith(['Approved', 'Requested']);
    });

    it('should handle error response', () => {
      const mockError = { status: 500, message: 'Server Error' };
      mockNetworkingSvc.updateConnectionRequest.mockReturnValue(throwError(mockError));
      const openSnackbarSpy = jest.spyOn(component, 'openSnackbar');

      component.updateConnection('Approved');

      expect(component.otherUserProfile.connectionStatus).toBe('');
      expect(openSnackbarSpy).toHaveBeenCalledWith('Something went wrong please try again');
    });

    it('should emit correct count lists for different actions', () => {
      const mockResponse = { success: true };
      mockNetworkingSvc.updateConnectionRequest.mockReturnValue(of(mockResponse));
      const getCountOfSpy = jest.spyOn(component.getCountOf, 'emit');

      // Test Rejected action
      component.updateConnection('Rejected');
      expect(getCountOfSpy).toHaveBeenCalledWith(['Requested']);

      // Test Withdrawn action
      component.updateConnection('Withdrawn');
      expect(getCountOfSpy).toHaveBeenCalledWith(['Pending']);

      // Test Removed action
      component.updateConnection('Removed');
      expect(getCountOfSpy).toHaveBeenCalledWith(['Approved']);
    });

    it('should show success message for Unblocked action', () => {
      const mockResponse = { success: true };
      mockNetworkingSvc.updateConnectionRequest.mockReturnValue(of(mockResponse));
      const openSnackbarSpy = jest.spyOn(component, 'openSnackbar');

      component.updateConnection('Unblocked');

      expect(openSnackbarSpy).toHaveBeenCalledWith('User unblocked successfully');
    });
  });

  describe('raiseTelemetry', () => {
    it('should raise telemetry with correct parameters', () => {
      component.raiseTelemetry('user123', 'test-action', 'test-subtype');

      expect(mockEvents.raiseInteractTelemetry).toHaveBeenCalledWith(
        {
          type: 'click',
          id: 'test-action',
          subType: 'test-subtype'
        },
        {
          id: 'user123',
          type: 'User'
        },
        {
          module: 'network'
        }
      );
    });

    it('should raise telemetry without subType', () => {
      component.raiseTelemetry('user123', 'test-action');

      expect(mockEvents.raiseInteractTelemetry).toHaveBeenCalledWith(
        {
          type: 'click',
          id: 'test-action'
        },
        {
          id: 'user123',
          type: 'User'
        },
        {
          module: 'network'
        }
      );
    });
  });

  describe('handleTranslateTo', () => {
    it('should call networkingSvc handleTranslateTo method', () => {
      const result = component.handleTranslateTo('testKey');

      expect(mockNetworkingSvc.handleTranslateTo).toHaveBeenCalledWith('testKey');
      expect(result).toBe('Translated Text');
    });
  });

  describe('openSnackbar', () => {
    it('should open snackbar with default duration', () => {
      component.openSnackbar('Test message');

      expect(mockSnackBar.open).toHaveBeenCalledWith('Test message', 'X', {
        duration: 5000
      });
    });

    it('should open snackbar with custom duration', () => {
      component.openSnackbar('Test message', 3000);

      expect(mockSnackBar.open).toHaveBeenCalledWith('Test message', 'X', {
        duration: 3000
      });
    });
  });
});
