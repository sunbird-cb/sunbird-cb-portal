import { ConnectionPeopleCardComponent } from './connection-people-card.component';
import { NSNetworkDataV2 } from '../../../network-v2/models/network-v2.model';
import { of, throwError } from 'rxjs';
import * as _ from 'lodash';

// Mock lodash to avoid import issues
jest.mock('lodash', () => ({
  get: jest.fn()
}));

// Mock localStorage
const mockLocalStorage = (() => {
  let store: any = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('ConnectionPeopleCardComponent', () => {
  let component: ConnectionPeopleCardComponent;
  let mockNetworkV2Service: any;
  let mockSnackBar: any;
  let mockRouter: any;
  let mockTranslateService: any;
  let mockConfigurationsService: any;
  let mockElementRef: any;

  beforeEach(() => {
    // Create comprehensive mocks
    mockNetworkV2Service = {
      createConnection: jest.fn()
    };

    mockSnackBar = {
      open: jest.fn()
    };

    mockRouter = {
      navigate: jest.fn()
    };

    mockTranslateService = {
      setDefaultLang: jest.fn(),
      use: jest.fn()
    };

    mockConfigurationsService = {
      userProfileV2: {
        userId: 'current-user-id',
        firstName: 'Current User',
        departmentName: 'IT Department'
      }
    };

    mockElementRef = {
      nativeElement: {
        value: 'Connection request sent successfully'
      }
    };

    // Initialize component
    component = new ConnectionPeopleCardComponent(
      mockNetworkV2Service,
      mockSnackBar,
      mockRouter,
      mockTranslateService,
      mockConfigurationsService
    );

    // Set ViewChild elements
    component.toastSuccess = mockElementRef;
    component.toastError = mockElementRef;

    // Set up default mock implementations
    mockNetworkV2Service.createConnection.mockReturnValue(of({}));
    (_.get as any).mockImplementation((obj: any, path: string, defaultValue: any) => {
      const keys = path.split('.');
      let result = obj;
      for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
          result = result[key];
        } else {
          return defaultValue;
        }
      }
      return result !== undefined ? result : defaultValue;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  describe('Component Initialization', () => {
    it('should create component with default values', () => {
      expect(component).toBeTruthy();
      expect(component.addMargin).toBe(false);
      expect(component.userAvatarName).toBe('');
      expect(component.showBadge).toBe(false);
      expect(component.showMentor).toBe(false);
    });

    it('should set default language and use stored language from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('hi');
      
      component = new ConnectionPeopleCardComponent(
        mockNetworkV2Service,
        mockSnackBar,
        mockRouter,
        mockTranslateService,
        mockConfigurationsService
      );
      
      expect(mockTranslateService.setDefaultLang).toHaveBeenCalledWith('en');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('websiteLanguage');
      expect(mockTranslateService.use).toHaveBeenCalledWith('hi');
    });

    it('should not set language when no stored language in localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      component = new ConnectionPeopleCardComponent(
        mockNetworkV2Service,
        mockSnackBar,
        mockRouter,
        mockTranslateService,
        mockConfigurationsService
      );
      
      expect(mockTranslateService.setDefaultLang).toHaveBeenCalled();
      expect(mockTranslateService.use).toHaveBeenCalled();
    });

    it('should call initialization on ngOnInit', () => {
      const initializationSpy = jest.spyOn(component, 'initialization');
      
      component.ngOnInit();
      
      expect(initializationSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('initialization', () => {
    it('should initialize component properties', () => {
      const mockUser: NSNetworkDataV2.INetworkUser = {
        id: 'user-123',
        firstName: 'John',
        lastName: 'Doe',
        verifiedKarmayogi: true,
        role: ['Mentor', 'Employee']
      } as any;

      component.user = mockUser;
      const getCurrentUserSpy = jest.spyOn(component, 'getCurrentUser');
      Object.defineProperty(component, 'getUseravatarName', {
        get: jest.fn().mockReturnValue('John Doe')
      });

      component.initialization();

      expect(getCurrentUserSpy).toHaveBeenCalledTimes(1);
      expect(component.howerUser).toBe(mockUser);
      expect(component.unmappedUser).toBe(mockUser);
      expect(component.userAvatarName).toBe('John Doe');
      expect(component.showBadge).toBe(true);
      expect(component.showMentor).toBe(true);
    });

    it('should not show badge when user is not verified karmayogi', () => {
      const mockUser: NSNetworkDataV2.INetworkUser = {
        id: 'user-123',
        firstName: 'John',
        verifiedKarmayogi: false
      } as any;

      component.user = mockUser;
      component.initialization();

      expect(component.showBadge).toBe(false);
    });

    it('should not show mentor when user has no mentor role', () => {
      const mockUser: NSNetworkDataV2.INetworkUser = {
        id: 'user-123',
        firstName: 'John',
        role: ['Employee', 'Manager']
      } as any;

      component.user = mockUser;
      component.initialization();

      expect(component.showMentor).toBe(false);
    });

    it('should handle mentor role case insensitive', () => {
      const mockUser: NSNetworkDataV2.INetworkUser = {
        id: 'user-123',
        firstName: 'John',
        role: ['MENTOR', 'employee']
      } as any;

      component.user = mockUser;
      component.initialization();

      expect(component.showMentor).toBe(true);
    });

    it('should handle undefined user', () => {
      component.user = undefined as any;
      
      component.initialization();

      expect(component.showBadge).toBe(false);
      expect(component.showMentor).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user from configurations service', () => {
      component.getCurrentUser();
      
      expect(component.cirrentUser).toBe(mockConfigurationsService.userProfileV2);
    });
  });

  describe('getUseravatarName getter', () => {
    it('should return full name from firstName and lastName', () => {
      component.user = {
        firstName: 'John',
        lastName: 'Doe'
      } as any;

      const result = component.getUseravatarName;

      expect(result).toBe('John Doe');
    });

    it('should return firstName when lastName is null', () => {
      component.user = {
        firstName: 'John',
        lastName: null
      } as any;

      const result = component.getUseravatarName;

      expect(result).toBe('John');
    });

    it('should return firstName when lastName is undefined', () => {
      component.user = {
        firstName: 'John',
        lastName: undefined
      } as any;

      const result = component.getUseravatarName;

      expect(result).toBe('John');
    });

    it('should return fullName when firstName is not available', () => {
      component.user = {
        fullName: 'John Smith'
      } as any;

      const result = component.getUseravatarName;

      expect(result).toBe('John Smith');
    });

    it('should return name when firstName and fullName are not available', () => {
      component.user = {
        name: 'John Williams'
      } as any;

      const result = component.getUseravatarName;

      expect(result).toBe('John Williams');
    });

    it('should return name from personalDetails with middlename and surname', () => {
      component.user = {
        personalDetails: {
          firstname: 'John',
          middlename: 'Michael',
          surname: 'Doe'
        }
      } as any;

      const result = component.getUseravatarName;

      expect(result).toBe('John Michael Doe');
    });

    it('should return name from personalDetails with middlename but no surname', () => {
      component.user = {
        personalDetails: {
          firstname: 'John',
          middlename: 'Michael',
          surname: null
        }
      } as any;

      const result = component.getUseravatarName;

      expect(result).toBe('John Michael');
    });

    it('should return name from personalDetails with firstname and surname', () => {
      component.user = {
        personalDetails: {
          firstname: 'John',
          surname: 'Doe'
        }
      } as any;

      const result = component.getUseravatarName;

      expect(result).toBe('John Doe');
    });

    it('should return firstname only when surname is null', () => {
      component.user = {
        personalDetails: {
          firstname: 'John',
          surname: null
        }
      } as any;

      const result = component.getUseravatarName;

      expect(result).toBe('John');
    });

    it('should return name using firstName from personalDetails', () => {
      component.user = {
        personalDetails: {
          firstName: 'John',
          surname: 'Doe'
        }
      } as any;

      const result = component.getUseravatarName;

      expect(result).toBe('John Doe');
    });

    it('should return firstName only when surname is undefined', () => {
      component.user = {
        personalDetails: {
          firstName: 'John',
          surname: undefined
        }
      } as any;

      const result = component.getUseravatarName;

      expect(result).toBe('John');
    });

    it('should return empty string when no name information is available', () => {
      component.user = {} as any;

      const result = component.getUseravatarName;

      expect(result).toBe('undefined');
    });
  });

  describe('connetToUser', () => {
    beforeEach(() => {
      component.user = {
        id: 'user-123',
        userId: 'user-123-id'
      } as any;
      component.unmappedUser = {
        userId: 'target-user-id',
        personalDetails: {
          firstname: 'Target User'
        },
        employmentDetails: {
          departmentName: 'HR Department'
        }
      };
      component.cirrentUser = {
        userId: 'current-user-id',
        firstName: 'Current User',
        departmentName: 'IT Department'
      };
    });

    it('should send connection request successfully', () => {
      mockNetworkV2Service.createConnection.mockReturnValue(of({}));
      (_.get as any).mockImplementation((path: string, defaultValue: any) => {
        const pathMap: any = {
          'userId': 'current-user-id',
          'firstName': 'Current User',
          'departmentName': 'IT Department'
        };
        return pathMap[path] || defaultValue;
      });

      component.connetToUser();

      expect(component.user.requestSent).toBe(true);
      expect(mockNetworkV2Service.createConnection).toHaveBeenCalledWith({
        connectionId: 'user-123',
        userIdFrom: 'userId',
        userNameFrom: 'firstName',
        userDepartmentFrom: 'departmentName',
        userIdTo: 'target-user-id',
        userNameTo: 'personalDetails.firstname',
        userDepartmentTo: 'employmentDetails.departmentName'
      });
      expect(component.user.requestSent).toBe(true);
      expect(mockSnackBar.open).toHaveBeenCalledWith('Connection request sent successfully', 'X', { duration: 5000 });
    });

    it('should handle connection request failure', () => {
      mockNetworkV2Service.createConnection.mockReturnValue(throwError(new Error('Network error')));

      component.connetToUser();

      expect(component.user.requestSent).toBe(undefined);
      expect(mockSnackBar.open).toHaveBeenCalledWith('Failed to send request. Please try again.', 'X', { duration: 5000 });
    });

    it('should use identifier when id is not available', () => {
      component.user = {
        identifier: 'user-identifier-123',
        userId: 'user-123-id'
      } as any;

      component.connetToUser();

      expect(mockNetworkV2Service.createConnection).toHaveBeenCalledWith(
        expect.objectContaining({
          connectionId: 'user-identifier-123'
        })
      );
    });

    it('should use wid when id and identifier are not available', () => {
      component.user = {
        wid: 'user-wid-123',
        userId: 'user-123-id'
      } as any;

      component.connetToUser();

      expect(mockNetworkV2Service.createConnection).toHaveBeenCalledWith(
        expect.objectContaining({
          connectionId: 'user-wid-123'
        })
      );
    });

    it('should handle lodash.get calls correctly', () => {
      (_.get as any).mockReturnValueOnce('current-user-id')
        .mockReturnValueOnce('Current User')
        .mockReturnValueOnce('IT Department')
        .mockReturnValueOnce('Target User')
        .mockReturnValueOnce('HR Department');

      component.connetToUser();

      expect(_.get).toHaveBeenCalledWith(component.cirrentUser, 'userId', '');
      expect(_.get).toHaveBeenCalledWith(component.cirrentUser, 'firstName', '');
      expect(_.get).toHaveBeenCalledWith(component.cirrentUser, 'departmentName', '');
      expect(_.get).toHaveBeenCalledWith(component.unmappedUser, 'personalDetails.firstname', '');
      expect(_.get).toHaveBeenCalledWith(component.unmappedUser, 'employmentDetails.departmentName', '');
    });
  });

  describe('openSnackbar', () => {
    it('should open snackbar with default duration', () => {
      const message = 'Test message';
      
      component['openSnackbar'](message);
      
      expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'X', {
        duration: 5000
      });
    });

    it('should open snackbar with custom duration', () => {
      const message = 'Test message';
      const duration = 3000;
      
      component['openSnackbar'](message, duration);
      
      expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'X', {
        duration: 3000
      });
    });
  });

  describe('goToUserProfile', () => {
    it('should navigate to user profile with userId', () => {
      const user = { userId: 'user-123' };
      
      component.goToUserProfile(user);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/person-profile', 'user-123'],
        { fragment: 'profileInfo' }
      );
    });

    it('should navigate to user profile with id when userId is not available', () => {
      const user = { id: 'user-456' };
      
      component.goToUserProfile(user);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/person-profile', 'user-456'],
        { fragment: 'profileInfo' }
      );
    });

    it('should navigate to user profile with wid when userId and id are not available', () => {
      const user = { wid: 'user-789' };
      
      component.goToUserProfile(user);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/person-profile', 'user-789'],
        { fragment: 'profileInfo' }
      );
    });

    it('should handle user with multiple identifiers, prioritizing userId', () => {
      const user = { userId: 'user-123', id: 'user-456', wid: 'user-789' };
      
      component.goToUserProfile(user);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/person-profile', 'user-123'],
        { fragment: 'profileInfo' }
      );
    });
  });

  describe('Input Properties', () => {
    it('should accept user input property', () => {
      const mockUser: NSNetworkDataV2.INetworkUser = {
        id: 'test-user',
        firstName: 'Test User'
      } as any;
      
      component.user = mockUser;
      
      expect(component.user).toBe(mockUser);
    });

    it('should accept addMargin input property', () => {
      component.addMargin = true;
      
      expect(component.addMargin).toBe(true);
    });
  });

  describe('ViewChild Elements', () => {
    it('should have toastSuccess ViewChild reference', () => {
      expect(component.toastSuccess).toBeDefined();
      expect(component.toastSuccess.nativeElement.value).toBe('Connection request sent successfully');
    });

    it('should have toastError ViewChild reference', () => {
      expect(component.toastError).toBeDefined();
    });
  });

  describe('Integration Tests', () => {
    it('should complete full initialization flow', () => {
      const mockUser: NSNetworkDataV2.INetworkUser = {
        id: 'user-123',
        firstName: 'John',
        lastName: 'Doe',
        verifiedKarmayogi: true,
        role: ['Mentor']
      } as any;

      component.user = mockUser;
      
      component.ngOnInit();
      
      expect(component.howerUser).toBe(mockUser);
      expect(component.unmappedUser).toBe(mockUser);
      expect(component.showBadge).toBe(true);
      expect(component.showMentor).toBe(true);
      expect(component.cirrentUser).toBe(mockConfigurationsService.userProfileV2);
    });

    it('should handle connection request and navigation flow', () => {
      const mockUser: NSNetworkDataV2.INetworkUser = {
        id: 'user-123',
        userId: 'user-123',
        firstName: 'John'
      } as any;

      component.user = mockUser;
      component.unmappedUser = { userId: 'target-user-id' };
      component.cirrentUser = { userId: 'current-user-id' };

      // Test connection
      component.connetToUser();
      expect(mockNetworkV2Service.createConnection).toHaveBeenCalled();
      
      // Test navigation
      component.goToUserProfile(mockUser);
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/person-profile', 'user-123'],
        { fragment: 'profileInfo' }
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle null user in getUseravatarName', () => {
      component.user = null as any;
      
      const result = component.getUseravatarName;
      
      expect(result).toBe('');
    });

    it('should handle empty personalDetails', () => {
      component.user = {
        personalDetails: {}
      } as any;
      
      const result = component.getUseravatarName;
      
      expect(result).toBe('');
    });

    it('should handle connection request with undefined user properties', () => {
      component.user = {} as any;
      component.unmappedUser = {};
      component.cirrentUser = {};
      
      component.connetToUser();
      
      expect(mockNetworkV2Service.createConnection).toHaveBeenCalledWith({
        connectionId: undefined,
        userIdFrom: '',
        userNameFrom: '',
        userDepartmentFrom: '',
        userIdTo: undefined,
        userNameTo: '',
        userDepartmentTo: ''
      });
    });
  });
});