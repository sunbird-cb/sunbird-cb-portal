import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar';
import { of, throwError, Subscription } from 'rxjs';
import * as _ from 'lodash';

import { ProfileVisibilitySettingsComponent } from './profile-visibility-settings.component';
import { SettingsService } from '../../settings.service';
import { ConfigurationsService } from '@sunbird-cb/utils-v2';

// Mock services
const mockSettingsService = {
  fetchProfile: jest.fn(),
  updateProfileVisibility: jest.fn()
} as any;

const mockConfigurationsService = {
  userProfileV2: {
    userId: 'test-user-id'
  }
} as any;

const mockSnackBar = {
  open: jest.fn()
} as any;

describe('ProfileVisibilitySettingsComponent', () => {
  let component: ProfileVisibilitySettingsComponent;
  let fixture: ComponentFixture<ProfileVisibilitySettingsComponent>;
  let settingsService: any;
  let snackBar: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileVisibilitySettingsComponent],
      providers: [
        { provide: SettingsService, useValue: mockSettingsService },
        { provide: ConfigurationsService, useValue: mockConfigurationsService },
        { provide: MatLegacySnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileVisibilitySettingsComponent);
    component = fixture.componentInstance;
    settingsService = TestBed.inject(SettingsService);
    snackBar = TestBed.inject(MatLegacySnackBar);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up subscriptions if any
    if (component.updateApiSubscription) {
      component.updateApiSubscription.unsubscribe();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set loadingDetails to true and call getUserDetails', () => {
      const getUserDetailsSpy = jest.spyOn(component, 'getUserDetails').mockImplementation(() => {});
      
      component.ngOnInit();
      
      expect(component.loadingDetails).toBe(true);
      expect(getUserDetailsSpy).toHaveBeenCalled();
    });
  });

  describe('getUserDetails', () => {
    it('should fetch user profile and set selectedVisibility on success', () => {
      const mockResponse = {
        result: {
          response: {
            profileDetails: {
              profilePreference: 'private'
            }
          }
        }
      };
      
      settingsService.fetchProfile.mockReturnValue(of(mockResponse));
      jest.spyOn(component, 'getMapedValues').mockReturnValue('private');
      jest.spyOn(_, 'get').mockImplementation((_: any, path: _.PropertyPath, defaultValue?: any) => {
        if (path === 'userProfileV2.userId') return 'test-user-id';
        if (path === 'result.response.profileDetails.profilePreference') return 'private';
        return defaultValue;
      });

      component.getUserDetails();

      expect(settingsService.fetchProfile).toHaveBeenCalledWith('test-user-id');
      expect(component.selectedVisibility).toBe('private');
      expect(component.loadingDetails).toBe(false);
    });

    it('should set selectedVisibility to public and loadingDetails to false on error', () => {
      settingsService.fetchProfile.mockReturnValue(throwError('Error'));
      jest.spyOn(_, 'get').mockReturnValue('test-user-id');

      component.getUserDetails();

      expect(component.selectedVisibility).toBe('public');
      expect(component.loadingDetails).toBe(false);
    });

    it('should use default value when profilePreference is not found', () => {
      const mockResponse = {
        result: {
          response: {
            profileDetails: {}
          }
        }
      };
      
      settingsService.fetchProfile.mockReturnValue(of(mockResponse));
      jest.spyOn(component, 'getMapedValues').mockReturnValue('public');
      jest.spyOn(_, 'get').mockImplementation((_: any, path: _.PropertyPath, defaultValue?: any) => {
        if (path === 'userProfileV2.userId') return 'test-user-id';
        if (path === 'result.response.profileDetails.profilePreference') return defaultValue;
        return defaultValue;
      });

      component.getUserDetails();

      expect(component.getMapedValues).toHaveBeenCalledWith('public');
    });
  });

  describe('getMapedValues', () => {
    it('should return correct mapped value for string inputs', () => {
      expect(component.getMapedValues('public')).toBe(0);
      expect(component.getMapedValues('private')).toBe(1);
      expect(component.getMapedValues('connections')).toBe(10);
    });

    it('should return correct mapped value for number inputs', () => {
      expect(component.getMapedValues(0)).toBe('public');
      expect(component.getMapedValues(1)).toBe('private');
      expect(component.getMapedValues(10)).toBe('connections');
    });

    it('should return undefined for unmapped values', () => {
      expect(component.getMapedValues('invalid')).toBeUndefined();
      expect(component.getMapedValues(999)).toBeUndefined();
    });
  });

  describe('onVisibilityChange', () => {
    beforeEach(() => {
      jest.spyOn(_, 'get').mockReturnValue('test-user-id');
    });

    it('should update profile visibility successfully', () => {
      const mockResponse = { success: true };
      settingsService.updateProfileVisibility.mockReturnValue(of(mockResponse));
      const getUserDetailsSpy = jest.spyOn(component, 'getUserDetails').mockImplementation(() => {});
      jest.spyOn(component, 'getMapedValues').mockReturnValue(1);

      component.onVisibilityChange('private');

      const expectedForm = {
        request: {
          userId: 'test-user-id',
          profileDetails: {
            profilePreference: 1
          }
        }
      };

      expect(settingsService.updateProfileVisibility).toHaveBeenCalledWith(expectedForm);
      expect(getUserDetailsSpy).toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith('Updated Successfully');
    });

    it('should handle update profile visibility error', () => {
      settingsService.updateProfileVisibility.mockReturnValue(throwError('Error'));
      jest.spyOn(component, 'getMapedValues').mockReturnValue(0);

      component.onVisibilityChange('public');

      expect(snackBar.open).toHaveBeenCalledWith('Something went wrong please try again later');
    });

    it('should unsubscribe existing subscription before making new request', () => {
      const mockSubscription = {
        unsubscribe: jest.fn()
      } as any;
      component.updateApiSubscription = mockSubscription;
      
      settingsService.updateProfileVisibility.mockReturnValue(of({}));
      jest.spyOn(component, 'getMapedValues').mockReturnValue(10);

      component.onVisibilityChange('connections');

      expect(mockSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('should not call getUserDetails when response is falsy', () => {
      settingsService.updateProfileVisibility.mockReturnValue(of(null));
      const getUserDetailsSpy = jest.spyOn(component, 'getUserDetails').mockImplementation(() => {});
      jest.spyOn(component, 'getMapedValues').mockReturnValue(0);

      component.onVisibilityChange('public');

      expect(getUserDetailsSpy).not.toHaveBeenCalled();
      expect(snackBar.open).not.toHaveBeenCalledWith('Updated Successfully');
    });

    it('should handle all visibility options correctly', () => {
      settingsService.updateProfileVisibility.mockReturnValue(of({ success: true }));
      jest.spyOn(component, 'getUserDetails').mockImplementation(() => {});
      
      // Test public
      jest.spyOn(component, 'getMapedValues').mockReturnValue(0);
      component.onVisibilityChange('public');
      let expectedForm = {
        request: {
          userId: 'test-user-id',
          profileDetails: { profilePreference: 0 }
        }
      };
      expect(settingsService.updateProfileVisibility).toHaveBeenCalledWith(expectedForm);

      // Test private
      jest.spyOn(component, 'getMapedValues').mockReturnValue(1);
      component.onVisibilityChange('private');
      expectedForm = {
        request: {
          userId: 'test-user-id',
          profileDetails: { profilePreference: 1 }
        }
      };
      expect(settingsService.updateProfileVisibility).toHaveBeenCalledWith(expectedForm);

      // Test connections
      jest.spyOn(component, 'getMapedValues').mockReturnValue(10);
      component.onVisibilityChange('connections');
      expectedForm = {
        request: {
          userId: 'test-user-id',
          profileDetails: { profilePreference: 10 }
        }
      };
      expect(settingsService.updateProfileVisibility).toHaveBeenCalledWith(expectedForm);
    });
  });

  describe('component properties', () => {
    it('should have correct initial values', () => {
      expect(component.selectedVisibility).toBe('public');
      expect(component.loadingDetails).toBe(false);
      expect(component.updateApiSubscription).toBeUndefined();
    });
  });

  describe('subscription management', () => {
    it('should handle subscription lifecycle correctly', () => {
      const mockSubscription = new Subscription();
      const unsubscribeSpy = jest.spyOn(mockSubscription, 'unsubscribe');
      
      settingsService.updateProfileVisibility.mockReturnValue(of({}));
      jest.spyOn(component, 'getMapedValues').mockReturnValue(0);
      
      // First call creates subscription
      component.onVisibilityChange('public');
      expect(component.updateApiSubscription).toBeDefined();
      
      // Mock the subscription
      component.updateApiSubscription = mockSubscription;
      
      // Second call should unsubscribe first
      component.onVisibilityChange('private');
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
});