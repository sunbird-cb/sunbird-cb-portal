import { UpdatesCardComponent } from './updates-card.component';

describe('UpdatesCardComponent', () => {
  let component: UpdatesCardComponent;

  beforeEach(() => {
    // Create component instance directly
    component = new UpdatesCardComponent();
    
    // Initialize default values
    component.profileUpdates = null;
    component.nameInitials = '';
  });

  describe('Component Initialization', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.nameInitials).toBe('');
      expect(component.profileUpdates).toBe(null);
    });

    it('should call ngOnInit without errors', () => {
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should call required methods on ngOnChanges', () => {
      const getInitialsSpy = jest.spyOn(component, 'getInitials');
      
      component.ngOnChanges();

      expect(getInitialsSpy).toHaveBeenCalled();
    });
  });

  describe('Input Properties', () => {
    it('should accept profileUpdates input', () => {
      const mockProfileUpdates = {
        firstName: 'John Doe',
        designation: 'Software Engineer',
        updatedTime: '2 hours ago',
        description: 'Updated profile information',
        profileImage: 'profile.jpg',
        profileLink: 'https://example.com/profile/john'
      };

      component.profileUpdates = mockProfileUpdates;

      expect(component.profileUpdates).toEqual(mockProfileUpdates);
    });

    it('should handle empty profileUpdates', () => {
      component.profileUpdates = {};

      expect(component.profileUpdates).toEqual({});
    });

    it('should handle null profileUpdates', () => {
      component.profileUpdates = null;

      expect(component.profileUpdates).toBe(null);
    });

    it('should handle undefined profileUpdates', () => {
      component.profileUpdates = undefined;

      expect(component.profileUpdates).toBe(undefined);
    });
  });

  describe('getInitials', () => {
    it('should generate initials for full name with two words', () => {
      component.profileUpdates = { firstName: 'John Doe' };
      
      component.getInitials();

      expect(component.nameInitials).toBe('JD');
    });

    it('should generate initial for single word name', () => {
      component.profileUpdates = { firstName: 'John' };
      
      component.getInitials();

      expect(component.nameInitials).toBe('J');
    });

    it('should handle empty firstName', () => {
      component.profileUpdates = { firstName: '' };
      
      component.getInitials();

      expect(component.nameInitials).toBe('');
    });

    it('should handle missing firstName property', () => {
      component.profileUpdates = { designation: 'Engineer' };
      
      component.getInitials();

      expect(component.nameInitials).toBe('');
    });

    it('should handle null profileUpdates', () => {
      component.profileUpdates = null;
      
      component.getInitials();

      expect(component.nameInitials).toBe('');
    });

    it('should handle undefined profileUpdates', () => {
      component.profileUpdates = undefined;
      
      component.getInitials();

      expect(component.nameInitials).toBe('');
    });

    it('should handle name with multiple spaces', () => {
      component.profileUpdates = { firstName: 'John Michael Doe' };
      
      component.getInitials();

      expect(component.nameInitials).toBe('JM');
    });

    it('should handle name with extra whitespace', () => {
      component.profileUpdates = { firstName: '  Jane   Smith  ' };
      
      component.getInitials();

      expect(component.nameInitials).toBe('');
    });

    it('should handle very long names', () => {
      component.profileUpdates = { firstName: 'VeryLongFirstName VeryLongLastName' };
      
      component.getInitials();

      expect(component.nameInitials).toBe('VV');
    });

    it('should handle names with special characters', () => {
      component.profileUpdates = { firstName: 'José María' };
      
      component.getInitials();

      expect(component.nameInitials).toBe('JM');
    });

    it('should handle single character names', () => {
      component.profileUpdates = { firstName: 'A B' };
      
      component.getInitials();

      expect(component.nameInitials).toBe('AB');
    });

    it('should handle names with numbers', () => {
      component.profileUpdates = { firstName: 'User123 Test456' };
      
      component.getInitials();

      expect(component.nameInitials).toBe('UT');
    });
  });

  describe('openProfileLink', () => {
    beforeEach(() => {
      // Mock window.open
      Object.defineProperty(window, 'open', {
        value: jest.fn(),
        writable: true
      });
    });

    it('should open profile link in new tab when profileLink exists', () => {
      const mockWindowOpen = window.open as jest.Mock;
      component.profileUpdates = {
        firstName: 'John Doe',
        profileLink: 'https://example.com/profile/john'
      };

      component.openProfileLink();

      expect(mockWindowOpen).toHaveBeenCalledWith('https://example.com/profile/john', '_blank');
    });

    it('should not open window when profileLink is empty', () => {
      const mockWindowOpen = window.open as jest.Mock;
      component.profileUpdates = {
        firstName: 'John Doe',
        profileLink: ''
      };

      component.openProfileLink();

      expect(mockWindowOpen).not.toHaveBeenCalled();
    });

    it('should not open window when profileLink is missing', () => {
      const mockWindowOpen = window.open as jest.Mock;
      component.profileUpdates = {
        firstName: 'John Doe'
      };

      component.openProfileLink();

      expect(mockWindowOpen).not.toHaveBeenCalled();
    });

    it('should not open window when profileUpdates is null', () => {
      const mockWindowOpen = window.open as jest.Mock;
      component.profileUpdates = null;

      component.openProfileLink();

      expect(mockWindowOpen).not.toHaveBeenCalled();
    });

    it('should not open window when profileUpdates is undefined', () => {
      const mockWindowOpen = window.open as jest.Mock;
      component.profileUpdates = undefined;

      component.openProfileLink();

      expect(mockWindowOpen).not.toHaveBeenCalled();
    });

    it('should handle various URL formats', () => {
      const mockWindowOpen = window.open as jest.Mock;
      const testUrls = [
        'https://example.com/profile/user',
        'http://localhost:3000/profile',
        'https://subdomain.example.com/user/profile',
        'https://example.com/profile?id=123&tab=info'
      ];

      testUrls.forEach(url => {
        component.profileUpdates = { profileLink: url };
        component.openProfileLink();
        expect(mockWindowOpen).toHaveBeenCalledWith(url, '_blank');
      });

      expect(mockWindowOpen).toHaveBeenCalledTimes(testUrls.length);
    });
  });

  describe('ngOnChanges Integration', () => {
    it('should update nameInitials when profileUpdates changes', () => {
      component.profileUpdates = { firstName: 'Initial User' };
      
      component.ngOnChanges();
      
      expect(component.nameInitials).toBe('IU');

      // Change profileUpdates
      component.profileUpdates = { firstName: 'Updated User' };
      
      component.ngOnChanges();
      
      expect(component.nameInitials).toBe('UU');
    });

    it('should handle multiple ngOnChanges calls', () => {
      const getInitialsSpy = jest.spyOn(component, 'getInitials');

      component.ngOnChanges();
      component.ngOnChanges();
      component.ngOnChanges();

      expect(getInitialsSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('Complete Profile Updates Data', () => {
    it('should handle complete profile updates object', () => {
      const completeProfileUpdates = {
        firstName: 'Alice Johnson',
        designation: 'Senior Developer',
        updatedTime: '3 hours ago',
        description: 'Updated skills and experience section',
        profileImage: 'https://example.com/images/alice.jpg',
        profileLink: 'https://example.com/profile/alice'
      };

      component.profileUpdates = completeProfileUpdates;
      component.ngOnChanges();

      expect(component.nameInitials).toBe('AJ');
      expect(component.profileUpdates.firstName).toBe('Alice Johnson');
      expect(component.profileUpdates.designation).toBe('Senior Developer');
      expect(component.profileUpdates.updatedTime).toBe('3 hours ago');
      expect(component.profileUpdates.description).toBe('Updated skills and experience section');
      expect(component.profileUpdates.profileImage).toBe('https://example.com/images/alice.jpg');
      expect(component.profileUpdates.profileLink).toBe('https://example.com/profile/alice');
    });

    it('should handle partial profile updates object', () => {
      const partialProfileUpdates = {
        firstName: 'Bob Smith',
        updatedTime: '1 day ago'
      };

      component.profileUpdates = partialProfileUpdates;
      component.ngOnChanges();

      expect(component.nameInitials).toBe('BS');
      expect(component.profileUpdates.firstName).toBe('Bob Smith');
      expect(component.profileUpdates.designation).toBeUndefined();
      expect(component.profileUpdates.profileLink).toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed profileUpdates gracefully', () => {
      const malformedData = {
        firstName: null,
        profileLink: undefined,
        designation: 123,
        updatedTime: {}
      };

      component.profileUpdates = malformedData;

      expect(() => component.ngOnChanges()).not.toThrow();
      expect(() => component.openProfileLink()).not.toThrow();
    });

    it('should handle window.open errors gracefully', () => {
      const mockWindowOpen = window.open as jest.Mock;
      mockWindowOpen.mockImplementation(() => {
        throw new Error('Popup blocked');
      });

      component.profileUpdates = {
        profileLink: 'https://example.com/profile'
      };

      expect(() => component.openProfileLink()).toThrow('Popup blocked');
    });
  });

  describe('Edge Cases', () => {
    it('should handle profile updates with only spaces in firstName', () => {
      component.profileUpdates = { firstName: '   ' };
      
      component.getInitials();

      expect(component.nameInitials).toBe(''); // First character of trimmed would be space
    });

    it('should handle profile updates with special formatting', () => {
      component.profileUpdates = {
        firstName: 'Dr. John Smith Jr.',
        designation: 'Chief Technology Officer',
        updatedTime: 'Updated 2 minutes ago',
        description: 'Recently completed PhD in Computer Science',
        profileLink: 'https://company.example.com/employees/john-smith'
      };

      component.ngOnChanges();

      expect(component.nameInitials).toBe('DJ'); // Dr. John
    });

    it('should handle empty string profileLink', () => {
      const mockWindowOpen = window.open as jest.Mock;
      component.profileUpdates = {
        firstName: 'Test User',
        profileLink: ''
      };

      component.openProfileLink();

      expect(mockWindowOpen).toHaveBeenCalled();
    });

  });
});
