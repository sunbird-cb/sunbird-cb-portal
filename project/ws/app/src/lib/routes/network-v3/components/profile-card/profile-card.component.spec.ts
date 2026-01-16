import { ProfileCardComponent } from './profile-card.component';

describe('ProfileCardComponent', () => {
  let component: ProfileCardComponent;
  let mockRouter: any;
  let mockTranslateService: any;

  beforeEach(() => {
    // Mock dependencies
    mockRouter = {
      navigate: jest.fn()
    };

    mockTranslateService = {
      setDefaultLang: jest.fn(),
      use: jest.fn()
    };

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });

    // Create component instance
    component = new ProfileCardComponent(mockRouter, mockTranslateService);
    
    // Initialize default values
    component.profileDetailsLoading = false;
    component.userDetails = null;
  });

  describe('Component Initialization', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.profileDetailsLoading).toBe(false);
      expect(component.bannerImageUrl).toBe('');
      expect(component.profileImageUrl).toBe('');
      expect(component.userName).toBe('Astha Sharma');
      expect(component.userId).toBe('');
      expect(component.nameInitials).toBe('');
    });

    it('should call required methods on ngOnInit', () => {
      const getInitialsSpy = jest.spyOn(component, 'getInitials');
      
      component.ngOnInit();

      expect(getInitialsSpy).toHaveBeenCalled();
    });

    it('should set language from localStorage on ngOnInit', () => {
      const mockLocalStorage = window.localStorage.getItem as jest.Mock;
      mockLocalStorage.mockReturnValue('hi');

      component.ngOnInit();

      expect(mockTranslateService.setDefaultLang).toHaveBeenCalledWith('en');
      expect(mockTranslateService.use).toHaveBeenCalledWith('hi');
    });

    it('should not set language when localStorage is empty', () => {
      const mockLocalStorage = window.localStorage.getItem as jest.Mock;
      mockLocalStorage.mockReturnValue(null);

      component.ngOnInit();

      expect(mockTranslateService.setDefaultLang).not.toHaveBeenCalled();
      expect(mockTranslateService.use).not.toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    it('should update component properties when userDetails changes', () => {
      const mockUserDetails = {
        profileDetails: {
          firstName: 'John Doe',
          profileBannerUrl: 'banner.jpg',
          profileImageUrl: 'profile.jpg'
        },
        id: 'user123'
      };

      component.userDetails = mockUserDetails;
      const getInitialsSpy = jest.spyOn(component, 'getInitials');

      component.ngOnChanges();

      expect(component.userName).toBe('John Doe');
      expect(component.userId).toBe('user123');
      expect(component.bannerImageUrl).toBe('banner.jpg');
      expect(component.profileImageUrl).toBe('profile.jpg');
      expect(getInitialsSpy).toHaveBeenCalled();
    });

    it('should handle userDetails without profileDetails wrapper', () => {
      const mockUserDetails = {
        personalDetails: {
          firstname: 'Jane Smith'
        },
        userId: 'user456',
        profileImage: 'jane.jpg'
      };

      component.userDetails = mockUserDetails;

      component.ngOnChanges();

      expect(component.userName).toBe('Jane Smith');
      expect(component.userId).toBe('user456');
      expect(component.profileImageUrl).toBe('jane.jpg');
      expect(component.bannerImageUrl).toBe('');
    });

    it('should handle empty or undefined userDetails', () => {
      component.userDetails = {};

      component.ngOnChanges();

      expect(component.userName).toBe('');
      expect(component.userId).toBe('');
      expect(component.bannerImageUrl).toBe('');
      expect(component.profileImageUrl).toBe('');
    });

    it('should prioritize firstName over personalDetails.firstname', () => {
      const mockUserDetails = {
        firstName: 'Priority Name',
        personalDetails: {
          firstname: 'Secondary Name'
        }
      };

      component.userDetails = mockUserDetails;

      component.ngOnChanges();

      expect(component.userName).toBe('Priority Name');
    });

    it('should prioritize id over userId', () => {
      const mockUserDetails = {
        id: 'primary-id',
        userId: 'secondary-id'
      };

      component.userDetails = mockUserDetails;

      component.ngOnChanges();

      expect(component.userId).toBe('primary-id');
    });

    it('should prioritize profileImageUrl over profileImage', () => {
      const mockUserDetails = {
        profileImageUrl: 'primary-image.jpg',
        profileImage: 'secondary-image.jpg'
      };

      component.userDetails = mockUserDetails;

      component.ngOnChanges();

      expect(component.profileImageUrl).toBe('primary-image.jpg');
    });
  });

  describe('getInitials', () => {
    it('should generate initials for full name with two words', () => {
      component.userName = 'John Doe';
      
      component.getInitials();

      expect(component.nameInitials).toBe('JD');
    });

    it('should generate initial for single word name', () => {
      component.userName = 'John';
      
      component.getInitials();

      expect(component.nameInitials).toBe('J');
    });

    it('should handle empty name', () => {
      component.userName = '';
      
      component.getInitials();

      expect(component.nameInitials).toBe('');
    });

    it('should handle name with multiple spaces', () => {
      component.userName = 'John Michael Doe';
      
      component.getInitials();

      expect(component.nameInitials).toBe('JM');
    });

    it('should handle name with extra whitespace', () => {
      component.userName = '  John   Doe  ';
      
      component.getInitials();

      expect(component.nameInitials).toBe('');
    });

    it('should handle undefined userName', () => {
      component.userName = undefined as any;
      
      component.getInitials();

      expect(component.nameInitials).toBe('');
    });

    it('should handle null userName', () => {
      component.userName = null as any;
      
      component.getInitials();

      expect(component.nameInitials).toBe('');
    });
  });

  describe('viewProfile', () => {
    it('should navigate to profile page', () => {
      component.viewProfile();

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/person-profile/me'],
        { fragment: 'profileInfo' }
      );
    });

    it('should call router navigate only once', () => {
      component.viewProfile();
      component.viewProfile();

      expect(mockRouter.navigate).toHaveBeenCalledTimes(2);
    });
  });

  describe('Input Properties', () => {
    it('should accept userDetails input', () => {
      const mockUserDetails = {
        firstName: 'Test User',
        id: 'test123'
      };

      component.userDetails = mockUserDetails;

      expect(component.userDetails).toEqual(mockUserDetails);
    });

    it('should accept profileDetailsLoading input', () => {
      component.profileDetailsLoading = true;

      expect(component.profileDetailsLoading).toBe(true);

      component.profileDetailsLoading = false;

      expect(component.profileDetailsLoading).toBe(false);
    });

    it('should handle complex userDetails structure', () => {
      const complexUserDetails = {
        profileDetails: {
          firstName: 'Complex User',
          lastName: 'Test',
          profileBannerUrl: 'complex-banner.jpg',
          profileImageUrl: 'complex-profile.jpg',
          personalDetails: {
            firstname: 'Fallback Name'
          }
        },
        id: 'complex123',
        userId: 'fallback456',
        profileImage: 'fallback-image.jpg'
      };

      component.userDetails = complexUserDetails;

      expect(component.userDetails).toEqual(complexUserDetails);
    });
  });

  describe('Component Lifecycle Integration', () => {
    it('should handle ngOnInit and ngOnChanges together', () => {
      const getInitialsSpy = jest.spyOn(component, 'getInitials');
      const mockLocalStorage = window.localStorage.getItem as jest.Mock;
      mockLocalStorage.mockReturnValue('en');

      component.userDetails = {
        firstName: 'Lifecycle User',
        id: 'lifecycle123'
      };

      component.ngOnInit();
      component.ngOnChanges();

      expect(mockTranslateService.setDefaultLang).toHaveBeenCalledWith('en');
      expect(mockTranslateService.use).toHaveBeenCalledWith('en');
      expect(getInitialsSpy).toHaveBeenCalledTimes(2); // Once in ngOnInit, once in ngOnChanges
      expect(component.userName).toBe('Lifecycle User');
      expect(component.userId).toBe('lifecycle123');
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed userDetails gracefully', () => {
      const malformedUserDetails = {
        profileDetails: null,
        personalDetails: undefined
      };

      component.userDetails = malformedUserDetails;

      expect(() => component.ngOnChanges()).not.toThrow();
      expect(component.userName).toBe('');
      expect(component.userId).toBe('');
    });

    it('should handle router navigation errors gracefully', () => {
      mockRouter.navigate.mockImplementation(() => {
        throw new Error('Navigation error');
      });

      expect(() => component.viewProfile()).toThrow('Navigation error');
    });

    it('should handle translate service errors gracefully', () => {
      mockTranslateService.setDefaultLang.mockImplementation(() => {
        throw new Error('Translation error');
      });

      const mockLocalStorage = window.localStorage.getItem as jest.Mock;
      mockLocalStorage.mockReturnValue('en');

      expect(() => component.ngOnInit()).toThrow('Translation error');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long names', () => {
      const longName = 'Very Long First Name That Might Cause Issues Very Long Last Name';
      component.userName = longName;
      
      component.getInitials();

      expect(component.nameInitials).toBe('VL');
    });

    it('should handle special characters in names', () => {
      component.userName = 'José María';
      
      component.getInitials();

      expect(component.nameInitials).toBe('JM');
    });

    it('should handle names with numbers', () => {
      component.userName = 'User123 Test456';
      
      component.getInitials();

      expect(component.nameInitials).toBe('UT');
    });

    it('should handle single character names', () => {
      component.userName = 'A B';
      
      component.getInitials();

      expect(component.nameInitials).toBe('AB');
    });
  });
});
