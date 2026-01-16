import { PeopleConnectionCardComponent } from './people-connection-card.component';
import { of, throwError } from 'rxjs';

describe('PeopleConnectionCardComponent', () => {
  let component: PeopleConnectionCardComponent;
  let mockNetworkV2Service: any;
  let mockConfigSvc: any;
  let mockRouter: any;
  let mockTranslate: any;
  let mockMatSnackbarNew: any;

  beforeEach(() => {
    // Mock services
    mockNetworkV2Service = {
      createConnection: jest.fn()
    };
    
    mockConfigSvc = {
      userProfile: {
        userId: 'user123',
        departmentName: 'Engineering'
      }
    };
    
    mockRouter = {
      navigate: jest.fn()
    };
    
    mockTranslate = {
      setDefaultLang: jest.fn(),
      use: jest.fn()
    };
    
    mockMatSnackbarNew = {
      open: jest.fn()
    };

    // Mock localStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value; }
      };
    })();
    
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    localStorage.setItem('websiteLanguage', 'en');

    // Initialize component
    component = new PeopleConnectionCardComponent(
      mockNetworkV2Service,
      mockConfigSvc,
      mockRouter,
      mockTranslate,
      mockMatSnackbarNew
    );
  });

  it('should initialize user profile on ngOnInit', () => {
    // Arrange
    component.user = {
      id: 'user456',
      firstName: 'John',
      lastName: 'Doe'
    } as any;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.currentUser).toBe(mockConfigSvc.userProfile);
    expect(component.howerUser).toBe(component.user);
    expect(component.unmappedUser).toBe(component.user);
  });

  describe('getUseravatarName', () => {
    it('should return firstName + lastName when both are present without personalDetails', () => {
      // Arrange
      component.user = {
        firstName: 'John',
        lastName: 'Doe'
      } as any;

      // Act
      const result = component.getUseravatarName();

      // Assert
      expect(result).toBe('John Doe');
    });

    it('should return only firstName when lastName is not present without personalDetails', () => {
      // Arrange
      component.user = {
        firstName: 'John'
      } as any;

      // Act
      const result = component.getUseravatarName();

      // Assert
      expect(result).toBe('John');
    });

    it('should return fullName when available without personalDetails', () => {
      // Arrange
      component.user = {
        fullName: 'John Doe'
      } as any;

      // Act
      const result = component.getUseravatarName();

      // Assert
      expect(result).toBe('John Doe');
    });

    it('should return name when other fields are not available without personalDetails', () => {
      // Arrange
      component.user = {
        name: 'John Doe'
      } as any;

      // Act
      const result = component.getUseravatarName();

      // Assert
      expect(result).toBe('John Doe');
    });

    it('should return firstname + middlename + surname when all are present in personalDetails', () => {
      // Arrange
      component.user = {
        personalDetails: {
          firstname: 'John',
          middlename: 'William',
          surname: 'Doe'
        }
      } as any;

      // Act
      const result = component.getUseravatarName();

      // Assert
      expect(result).toBe('John William Doe');
    });

    it('should return firstname + middlename when surname is not present in personalDetails', () => {
      // Arrange
      component.user = {
        personalDetails: {
          firstname: 'John',
          middlename: 'William'
        }
      } as any;

      // Act
      const result = component.getUseravatarName();

      // Assert
      expect(result).toBe('John William');
    });

    it('should return firstName + surname when firstName is available in personalDetails', () => {
      // Arrange
      component.user = {
        personalDetails: {
          firstName: 'John',
          surname: 'Doe'
        }
      } as any;

      // Act
      const result = component.getUseravatarName();

      // Assert
      expect(result).toBe('John Doe');
    });
  });

  describe('connetToUser', () => {
    beforeEach(() => {
      component.currentUser = {
        userId: 'user123',
        departmentName: 'Engineering'
      } as any;

      component.user = {
        id: 'user456',
        identifier: 'id456',
        wid: 'wid456'
      } as any;

      component.unmappedUser = {
        userId: 'user456',
        employmentDetails: {
          departmentName: 'Marketing'
        }
      } as any;
    });

    it('should emit connection-updated and show success message on successful connection request', () => {
      // Arrange
      mockNetworkV2Service.createConnection.mockReturnValue(of({}));
      const emitSpy = jest.spyOn(component.connection, 'emit');

      // Act
      component.connetToUser();

      // Assert
      expect(mockNetworkV2Service.createConnection).toHaveBeenCalledWith({
        connectionId: 'id456',
        userIdFrom: 'user123',
        userNameFrom: 'user123',
        userDepartmentFrom: 'Engineering',
        userIdTo: 'user456',
        userNameTo: 'id456',
        userDepartmentTo: ''
      });

      expect(emitSpy).toHaveBeenCalledWith('connection-updated');
      expect(mockMatSnackbarNew.open).toHaveBeenCalledWith(
        'Connection request sent.',
        'X',
        {
          duration: 3000,
          panelClass: ['success']
        }
      );
    });

    it('should show error message on failed connection request', () => {
      // Arrange
      mockNetworkV2Service.createConnection.mockReturnValue(throwError('Error'));

      // Act
      component.connetToUser();

      // Assert
      expect(mockMatSnackbarNew.open).toHaveBeenCalledWith(
        'Could not send connection request',
        'X',
        {
          duration: 3000,
          panelClass: ['error']
        }
      );
    });
  });

  describe('goToUserProfile', () => {
    it('should navigate to user profile using userId', () => {
      // Arrange
      const user = { userId: 'user456' };

      // Act
      component.goToUserProfile(user);

      // Assert
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/person-profile', 'user456'],
        { fragment: 'profileInfo' }
      );
    });

    it('should navigate to user profile using id if userId is not available', () => {
      // Arrange
      const user = { id: 'id456' };

      // Act
      component.goToUserProfile(user);

      // Assert
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/person-profile', 'id456'],
        { fragment: 'profileInfo' }
      );
    });

    it('should navigate to user profile using wid if userId and id are not available', () => {
      // Arrange
      const user = { wid: 'wid456' };

      // Act
      component.goToUserProfile(user);

      // Assert
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/person-profile', 'wid456'],
        { fragment: 'profileInfo' }
      );
    });
  });

  describe('usr getter', () => {
    it('should return howerUser', () => {
      // Arrange
      component.howerUser = { name: 'Test User' };

      // Act & Assert
      expect(component.usr).toBe(component.howerUser);
    });
  });

  describe('userDesignation getter', () => {
    it('should return designation with rootOrgName when professionalDetails has designation', () => {
      // Arrange
      component.user = {
        profileDetails: {
          professionalDetails: [
            { designation: 'Software Engineer' }
          ]
        },
        rootOrgName: 'Tech Corp'
      };

      // Act
      const result = component.userDesignation;

      // Assert
      expect(result).toBe('Software Engineer at Tech Corp');
    });

    it('should return only rootOrgName when professionalDetails has no designation', () => {
      // Arrange
      component.user = {
        profileDetails: {
          professionalDetails: [{}]
        },
        rootOrgName: 'Tech Corp'
      };

      // Act
      const result = component.userDesignation;

      // Assert
      expect(result).toBe('Tech Corp');
    });

    it('should return only rootOrgName when professionalDetails is empty', () => {
      // Arrange
      component.user = {
        profileDetails: {
          professionalDetails: []
        },
        rootOrgName: 'Tech Corp'
      };

      // Act
      const result = component.userDesignation;

      // Assert
      expect(result).toBe('Tech Corp');
    });

    it('should return an empty string when rootOrgName and professionalDetails are missing', () => {
      // Arrange
      component.user = {};

      // Act
      const result = component.userDesignation;

      // Assert
      expect(result).toBe('');
    });
  });
});