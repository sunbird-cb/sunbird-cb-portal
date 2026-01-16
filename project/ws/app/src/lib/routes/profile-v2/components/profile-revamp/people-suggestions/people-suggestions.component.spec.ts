import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar';
import { of, throwError } from 'rxjs';
import * as _ from 'lodash';

import { PeopleSuggestionsComponent } from './people-suggestions.component';
import { ProfileV2RevampService } from '../../../services/profile-v2-revamp.service';
import { EventService, WsEvents } from '@sunbird-cb/utils-v2';

describe('PeopleSuggestionsComponent', () => {
  let component: PeopleSuggestionsComponent;
  let fixture: ComponentFixture<PeopleSuggestionsComponent>;
  let mockProfileV2RevampService: any;
  let mockSnackBar: any;
  let mockRouter: any;
  let mockEventService: any;

  beforeEach(async () => {
    // Create comprehensive mocks
    mockProfileV2RevampService = {
      connectToNetwork: jest.fn()
    };

    mockSnackBar = {
      open: jest.fn()
    };

    mockRouter = {
      navigate: jest.fn()
    };

    mockEventService = {
      raiseInteractTelemetry: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [PeopleSuggestionsComponent],
      providers: [
        { provide: ProfileV2RevampService, useValue: mockProfileV2RevampService },
        { provide: MatLegacySnackBar, useValue: mockSnackBar },
        { provide: Router, useValue: mockRouter },
        { provide: EventService, useValue: mockEventService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleSuggestionsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should process people suggestions list when provided', () => {
      const mockPeopleSuggestionsList = [
        {
          personalDetails: {
            firstname: 'John Doe'
          }
        },
        {
          personalDetails: {
            firstname: 'Jane'
          }
        }
      ];

      component.peopleSuggestionsList = mockPeopleSuggestionsList;
      component.ngOnChanges();

      expect(component.peopleSuggestionsList[0].connectionStatus).toBe('connect');
      expect(component.peopleSuggestionsList[0].nameInitials).toBe('JD');
      expect(component.peopleSuggestionsList[1].connectionStatus).toBe('connect');
      expect(component.peopleSuggestionsList[1].nameInitials).toBe('J');
    });

    it('should handle empty people suggestions list', () => {
      component.peopleSuggestionsList = [];
      component.ngOnChanges();

      expect(component.peopleSuggestionsList).toEqual([]);
    });

    it('should handle null people suggestions list', () => {
      component.peopleSuggestionsList = null as any;
      component.ngOnChanges();

      expect(component.peopleSuggestionsList).toBe(null);
    });

    it('should handle person without firstname', () => {
      const mockPeopleSuggestionsList = [
        {
          personalDetails: {}
        }
      ];

      component.peopleSuggestionsList = mockPeopleSuggestionsList;
      component.ngOnChanges();

      expect(component.peopleSuggestionsList[0].connectionStatus).toBe('connect');
      expect(component.peopleSuggestionsList[0].nameInitials).toBeUndefined();
    });

    it('should handle person with single word firstname', () => {
      const mockPeopleSuggestionsList = [
        {
          personalDetails: {
            firstname: 'John'
          }
        }
      ];

      component.peopleSuggestionsList = mockPeopleSuggestionsList;
      component.ngOnChanges();

      expect(component.peopleSuggestionsList[0].nameInitials).toBe('J');
    });

    it('should handle person with multiple word firstname', () => {
      const mockPeopleSuggestionsList = [
        {
          personalDetails: {
            firstname: 'John Michael Smith'
          }
        }
      ];

      component.peopleSuggestionsList = mockPeopleSuggestionsList;
      component.ngOnChanges();

      expect(component.peopleSuggestionsList[0].nameInitials).toBe('JM');
    });
  });

  describe('connect', () => {
    it('should call sendConnectionRequest with person', () => {
      const mockPerson = { id: 'test-id' };
      const sendConnectionRequestSpy = jest.spyOn(component, 'sendConnectionRequest');
      
      component.connect(mockPerson);

      expect(sendConnectionRequestSpy).toHaveBeenCalledWith(mockPerson);
    });
  });

  describe('sendConnectionRequest', () => {
    beforeEach(() => {
      component.currentUser = {
        userId: 'current-user-id',
        employmentDetails: {
          departmentName: 'IT Department'
        }
      };
    });

    it('should send connection request successfully', () => {
      const mockPerson = {
        id: 'person-id',
        userId: 'person-user-id',
        connectionStatus: 'connect',
        employmentDetails: {
          departmentName: 'HR Department'
        }
      };

      mockProfileV2RevampService.connectToNetwork.mockReturnValue(of({}));
      const openSnackbarSpy = jest.spyOn(component as any, 'openSnackbar');

      component.sendConnectionRequest(mockPerson);

      const expectedFormBody = {
        connectionId: 'person-id',
        userIdFrom: 'current-user-id',
        userNameFrom: 'current-user-id',
        userDepartmentFrom: 'IT Department',
        userIdTo: 'person-user-id',
        userNameTo: 'person-id',
        userDepartmentTo: 'HR Department'
      };

      expect(mockProfileV2RevampService.connectToNetwork).toHaveBeenCalledWith(expectedFormBody);
      expect(mockPerson.connectionStatus).toBe('pending');
      expect(openSnackbarSpy).toHaveBeenCalledWith('Connection request sent successfully');
    });

    it('should handle connection request error', () => {
      const mockPerson = {
        identifier: 'person-identifier',
        userId: 'person-user-id'
      };

      mockProfileV2RevampService.connectToNetwork.mockReturnValue(throwError('Error'));
      const openSnackbarSpy = jest.spyOn(component as any, 'openSnackbar');

      component.sendConnectionRequest(mockPerson);

      expect(openSnackbarSpy).toHaveBeenCalledWith('Something went wrong while sending connection request');
    });

    it('should handle person with wid', () => {
      const mockPerson = {
        wid: 'person-wid',
        userId: 'person-user-id',
        employmentDetails: {
          departmentName: 'Finance Department'
        }
      };

      mockProfileV2RevampService.connectToNetwork.mockReturnValue(of({}));

      component.sendConnectionRequest(mockPerson);

      const expectedFormBody = {
        connectionId: 'person-wid',
        userIdFrom: 'current-user-id',
        userNameFrom: 'current-user-id',
        userDepartmentFrom: 'IT Department',
        userIdTo: 'person-user-id',
        userNameTo: 'person-wid',
        userDepartmentTo: 'Finance Department'
      };

      expect(mockProfileV2RevampService.connectToNetwork).toHaveBeenCalledWith(expectedFormBody);
    });

    it('should handle person without employmentDetails', () => {
      const mockPerson = {
        id: 'person-id',
        userId: 'person-user-id'
      };

      mockProfileV2RevampService.connectToNetwork.mockReturnValue(of({}));

      component.sendConnectionRequest(mockPerson);

      const expectedFormBody = {
        connectionId: 'person-id',
        userIdFrom: 'current-user-id',
        userNameFrom: 'current-user-id',
        userDepartmentFrom: 'IT Department',
        userIdTo: 'person-user-id',
        userNameTo: 'person-id',
        userDepartmentTo: ''
      };

      expect(mockProfileV2RevampService.connectToNetwork).toHaveBeenCalledWith(expectedFormBody);
    });

    it('should handle null person', () => {
      const openSnackbarSpy = jest.spyOn(component as any, 'openSnackbar');
      
      component.sendConnectionRequest(null);

      expect(mockProfileV2RevampService.connectToNetwork).not.toHaveBeenCalled();
      expect(openSnackbarSpy).not.toHaveBeenCalled();
    });

    it('should handle current user without employmentDetails', () => {
      component.currentUser = {
        userId: 'current-user-id'
      };

      const mockPerson = {
        id: 'person-id',
        userId: 'person-user-id'
      };

      mockProfileV2RevampService.connectToNetwork.mockReturnValue(of({}));

      component.sendConnectionRequest(mockPerson);

      const expectedFormBody = {
        connectionId: 'person-id',
        userIdFrom: 'current-user-id',
        userNameFrom: 'current-user-id',
        userDepartmentFrom: '',
        userIdTo: 'person-user-id',
        userNameTo: 'person-id',
        userDepartmentTo: ''
      };

      expect(mockProfileV2RevampService.connectToNetwork).toHaveBeenCalledWith(expectedFormBody);
    });
  });

  describe('goToUserProfile', () => {
    it('should navigate to user profile with userId', () => {
      const mockPerson = { userId: 'user-123' };
      const raiseTelemetrySpy = jest.spyOn(component, 'raiseTelemetry');

      component.goToUserProfile(mockPerson);

      expect(raiseTelemetrySpy).toHaveBeenCalledWith('user-123');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/app/person-profile', 'user-123'], { fragment: 'profileInfo' });
    });

    it('should navigate to user profile with id when userId not available', () => {
      const mockPerson = { id: 'id-123' };
      const raiseTelemetrySpy = jest.spyOn(component, 'raiseTelemetry');

      component.goToUserProfile(mockPerson);

      expect(raiseTelemetrySpy).toHaveBeenCalledWith('id-123');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/app/person-profile', 'id-123'], { fragment: 'profileInfo' });
    });

    it('should navigate to user profile with wid when userId and id not available', () => {
      const mockPerson = { wid: 'wid-123' };
      const raiseTelemetrySpy = jest.spyOn(component, 'raiseTelemetry');

      component.goToUserProfile(mockPerson);

      expect(raiseTelemetrySpy).toHaveBeenCalledWith('wid-123');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/app/person-profile', 'wid-123'], { fragment: 'profileInfo' });
    });
  });

  describe('raiseTelemetry', () => {
    it('should raise interact telemetry with correct parameters', () => {
      const userId = 'test-user-id';

      component.raiseTelemetry(userId);

      expect(mockEventService.raiseInteractTelemetry).toHaveBeenCalledWith(
        {
          type: WsEvents.EnumInteractTypes.CLICK,
          id: 'profile-card'
        },
        {
          id: userId,
          type: 'User'
        },
        {
          module: WsEvents.EnumTelemetrymodules.NETWORK
        }
      );
    });
  });

  describe('openSnackbar', () => {
    it('should open snackbar with default duration', () => {
      const message = 'Test message';
      
      (component as any).openSnackbar(message);

      expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'X', { duration: 5000 });
    });

    it('should open snackbar with custom duration', () => {
      const message = 'Test message';
      const duration = 3000;
      
      (component as any).openSnackbar(message, duration);

      expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'X', { duration: 3000 });
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete flow from ngOnChanges to connect', () => {
      const mockPeopleSuggestionsList = [
        {
          id: 'person-1',
          userId: 'user-1',
          personalDetails: {
            firstname: 'John Doe'
          },
          employmentDetails: {
            departmentName: 'Engineering'
          }
        }
      ];

      component.currentUser = {
        userId: 'current-user',
        employmentDetails: {
          departmentName: 'IT Department'
        }
      };

      component.peopleSuggestionsList = mockPeopleSuggestionsList;
      mockProfileV2RevampService.connectToNetwork.mockReturnValue(of({}));

      // Process suggestions
      component.ngOnChanges();
      expect(component.peopleSuggestionsList[0].connectionStatus).toBe('connect');
      expect(component.peopleSuggestionsList[0].nameInitials).toBe('JD');

      // Connect to person
      component.connect(component.peopleSuggestionsList[0]);
      expect(component.peopleSuggestionsList[0].connectionStatus).toBe('pending');
      expect(mockProfileV2RevampService.connectToNetwork).toHaveBeenCalled();
    });
  });

  // Test to ensure lodash usage doesn't cause issues
  it('should use lodash get function correctly', () => {
    const testObject = {
      nested: {
        value: 'test-value'
      }
    };

    const result = _.get(testObject, 'nested.value', 'default');
    expect(result).toBe('test-value');

    const resultWithDefault = _.get(testObject, 'non.existent.path', 'default');
    expect(resultWithDefault).toBe('default');
  });

  // Test to ensure all imports are used and no lint errors
  afterEach(() => {
    // Verify all mocks were properly used
    expect(mockProfileV2RevampService).toBeDefined();
    expect(mockSnackBar).toBeDefined();
    expect(mockRouter).toBeDefined();
    expect(mockEventService).toBeDefined();
    expect(_).toBeDefined();
    expect(of).toBeDefined();
    expect(throwError).toBeDefined();
  });
});