import { UserStatsComponent } from './user-stats.component';
import { UserStats } from '../../../models/profile-revamp.model';
import { Router } from '@angular/router';

describe('UserStatsComponent', () => {
  let component: UserStatsComponent;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(() => {
    // Create mock router with proper typing
    mockRouter = {
      navigateByUrl: jest.fn()
    } as any;

    // Create component instance
    component = new UserStatsComponent(mockRouter);

    // Initialize component properties
    component.userStats = [];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create component instance', () => {
      expect(component).toBeTruthy();
      expect(component.userStats).toEqual([]);
    });

    it('should initialize with default userStats array', () => {
      expect(component.userStats).toEqual([]);
      expect(Array.isArray(component.userStats)).toBe(true);
    });

    it('should have router injected', () => {
      expect(mockRouter).toBeDefined();
    });
  });

  describe('ngOnInit', () => {
    it('should call ngOnInit without errors', () => {
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should not modify userStats during ngOnInit', () => {
      const initialStats: UserStats[] = [
        {
          state: 'Active',
          totalPoints: '100',
          iconUrl: '/assets/icon.png',
          vewAllUrl: '/test-url',
          stateInfo: 'Test info',
          identifier: 'test-id'
        }
      ];
      component.userStats = initialStats;
      
      component.ngOnInit();
      
      expect(component.userStats).toEqual(initialStats);
    });

    it('should handle empty userStats array during ngOnInit', () => {
      component.userStats = [];
      
      component.ngOnInit();
      
      expect(component.userStats).toEqual([]);
    });
  });

  describe('viewAll', () => {
    it('should navigate when vewAllUrl is provided', () => {
      const mockUserStats: UserStats = {
        state: 'Active',
        totalPoints: '150',
        iconUrl: '/assets/active-icon.png',
        vewAllUrl: '/test-url',
        stateInfo: 'Active users information',
        identifier: 'active-stats'
      };

      component.viewAll(mockUserStats);

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/test-url');
      expect(mockRouter.navigateByUrl).toHaveBeenCalledTimes(1);
    });

    it('should not navigate when vewAllUrl is empty string', () => {
      const mockUserStats: UserStats = {
        state: 'Inactive',
        totalPoints: '50',
        iconUrl: '/assets/inactive-icon.png',
        vewAllUrl: '',
        stateInfo: 'Inactive users'
      };

      component.viewAll(mockUserStats);

      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should not navigate when vewAllUrl is null', () => {
      const mockUserStats: UserStats = {
        state: 'Pending',
        totalPoints: '25',
        iconUrl: '/assets/pending-icon.png',
        vewAllUrl: null as any,
        stateInfo: 'Pending users'
      };

      component.viewAll(mockUserStats);

      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should not navigate when vewAllUrl is undefined', () => {
      const mockUserStats: UserStats = {
        state: 'Draft',
        totalPoints: '10',
        iconUrl: '/assets/draft-icon.png',
      } as UserStats;

      component.viewAll(mockUserStats);

      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should handle complex URL with query parameters', () => {
      const mockUserStats: UserStats = {
        state: 'Completed',
        totalPoints: '200',
        iconUrl: '/assets/completed-icon.png',
        vewAllUrl: '/dashboard?tab=stats&filter=completed',
        stateInfo: 'Completed tasks',
        identifier: 'completed-stats'
      };

      component.viewAll(mockUserStats);

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/dashboard?tab=stats&filter=completed');
    });

    it('should handle URL with fragments', () => {
      const mockUserStats: UserStats = {
        state: 'Profile',
        totalPoints: '75',
        iconUrl: '/assets/profile-icon.png',
        vewAllUrl: '/profile#statistics',
        stateInfo: 'Profile statistics'
      };

      component.viewAll(mockUserStats);

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/profile#statistics');
    });

    it('should handle relative URLs', () => {
      const mockUserStats: UserStats = {
        state: 'Detailed',
        totalPoints: '300',
        iconUrl: '/assets/detailed-icon.png',
        vewAllUrl: './stats/detailed',
        stateInfo: 'Detailed view'
      };

      component.viewAll(mockUserStats);

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('./stats/detailed');
    });

    it('should handle absolute URLs', () => {
      const mockUserStats: UserStats = {
        state: 'Overview',
        totalPoints: '500',
        iconUrl: '/assets/overview-icon.png',
        vewAllUrl: '/app/statistics/overview',
        stateInfo: 'Overview statistics'
      };

      component.viewAll(mockUserStats);

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/app/statistics/overview');
    });

    it('should handle UserStats with optional properties missing', () => {
      const mockUserStats: UserStats = {
        state: 'Basic',
        totalPoints: '50',
        iconUrl: '/assets/basic-icon.png',
        vewAllUrl: '/basic-stats'
      };

      component.viewAll(mockUserStats);

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/basic-stats');
    });

    it('should handle UserStats with all optional properties', () => {
      const mockUserStats: UserStats = {
        state: 'Complete',
        totalPoints: '1000',
        iconUrl: '/assets/complete-icon.png',
        vewAllUrl: '/complete-stats',
        stateInfo: 'Complete information with tooltip',
        identifier: 'complete-stats-id'
      };

      component.viewAll(mockUserStats);

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/complete-stats');
    });

    it('should handle whitespace in URLs', () => {
      const mockUserStats: UserStats = {
        state: 'Trimmed',
        totalPoints: '80',
        iconUrl: '/assets/trimmed-icon.png',
        vewAllUrl: '  /stats/trimmed  ',
        stateInfo: 'Trimmed stats'
      };

      component.viewAll(mockUserStats);

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('  /stats/trimmed  ');
    });
  });

  describe('Input Property Handling', () => {
    it('should accept and store userStats input with all required fields', () => {
      const testStats: UserStats[] = [
        {
          state: 'Active',
          totalPoints: '100',
          iconUrl: '/assets/active.png',
          vewAllUrl: '/active-stats',
          stateInfo: 'Active user statistics',
          identifier: 'active'
        },
        {
          state: 'Inactive',
          totalPoints: '50',
          iconUrl: '/assets/inactive.png',
          vewAllUrl: '/inactive-stats',
          stateInfo: 'Inactive user statistics',
          identifier: 'inactive'
        }
      ];

      component.userStats = testStats;

      expect(component.userStats).toEqual(testStats);
      expect(component.userStats.length).toBe(2);
    });

    it('should handle userStats with only required fields', () => {
      const testStats: UserStats[] = [
        {
          state: 'Basic',
          totalPoints: '25',
          iconUrl: '/assets/basic.png',
          vewAllUrl: '/basic-stats'
        }
      ];

      component.userStats = testStats;

      expect(component.userStats).toEqual(testStats);
      expect(component.userStats[0].stateInfo).toBeUndefined();
      expect(component.userStats[0].identifier).toBeUndefined();
    });

    it('should handle null userStats input', () => {
      component.userStats = null as any;

      expect(component.userStats).toBeNull();
    });

    it('should handle undefined userStats input', () => {
      component.userStats = undefined as any;

      expect(component.userStats).toBeUndefined();
    });

    it('should handle empty userStats array', () => {
      component.userStats = [];

      expect(component.userStats).toEqual([]);
      expect(component.userStats.length).toBe(0);
    });

    it('should handle single userStats item', () => {
      const singleStat: UserStats[] = [
        {
          state: 'Single',
          totalPoints: '1',
          iconUrl: '/assets/single.png',
          vewAllUrl: '/single-stat',
          stateInfo: 'Single stat info'
        }
      ];

      component.userStats = singleStat;

      expect(component.userStats).toEqual(singleStat);
      expect(component.userStats.length).toBe(1);
    });

    it('should handle multiple userStats items with mixed optional properties', () => {
      const multipleStats: UserStats[] = [
        {
          state: 'Complete',
          totalPoints: '100',
          iconUrl: '/assets/complete.png',
          vewAllUrl: '/complete',
          stateInfo: 'Complete information',
          identifier: 'complete-id'
        },
        {
          state: 'Partial',
          totalPoints: '50',
          iconUrl: '/assets/partial.png',
          vewAllUrl: '/partial'
        },
        {
          state: 'Info Only',
          totalPoints: '25',
          iconUrl: '/assets/info.png',
          vewAllUrl: '/info',
          stateInfo: 'Has info but no identifier'
        }
      ];

      component.userStats = multipleStats;

      expect(component.userStats).toEqual(multipleStats);
      expect(component.userStats.length).toBe(3);
      expect(component.userStats[0].stateInfo).toBeDefined();
      expect(component.userStats[0].identifier).toBeDefined();
      expect(component.userStats[1].stateInfo).toBeUndefined();
      expect(component.userStats[1].identifier).toBeUndefined();
      expect(component.userStats[2].stateInfo).toBeDefined();
      expect(component.userStats[2].identifier).toBeUndefined();
    });
  });

  describe('UserStats Model Properties', () => {
    it('should handle state property correctly', () => {
      const userStat: UserStats = {
        state: 'Test State',
        totalPoints: '100',
        iconUrl: '/test-icon.png',
        vewAllUrl: '/test-url'
      };

      component.userStats = [userStat];

      expect(component.userStats[0].state).toBe('Test State');
    });

    it('should handle totalPoints as string', () => {
      const userStat: UserStats = {
        state: 'Points Test',
        totalPoints: '9999',
        iconUrl: '/points-icon.png',
        vewAllUrl: '/points-url'
      };

      component.userStats = [userStat];

      expect(component.userStats[0].totalPoints).toBe('9999');
      expect(typeof component.userStats[0].totalPoints).toBe('string');
    });

    it('should handle iconUrl property', () => {
      const userStat: UserStats = {
        state: 'Icon Test',
        totalPoints: '50',
        iconUrl: '/assets/custom-icon.svg',
        vewAllUrl: '/icon-test'
      };

      component.userStats = [userStat];

      expect(component.userStats[0].iconUrl).toBe('/assets/custom-icon.svg');
    });

    it('should handle optional stateInfo property', () => {
      const statWithInfo: UserStats = {
        state: 'With Info',
        totalPoints: '75',
        iconUrl: '/info-icon.png',
        vewAllUrl: '/with-info',
        stateInfo: 'This is tooltip information'
      };

      const statWithoutInfo: UserStats = {
        state: 'Without Info',
        totalPoints: '25',
        iconUrl: '/no-info-icon.png',
        vewAllUrl: '/without-info'
      };

      component.userStats = [statWithInfo, statWithoutInfo];

      expect(component.userStats[0].stateInfo).toBe('This is tooltip information');
      expect(component.userStats[1].stateInfo).toBeUndefined();
    });

    it('should handle optional identifier property', () => {
      const statWithId: UserStats = {
        state: 'With ID',
        totalPoints: '60',
        iconUrl: '/id-icon.png',
        vewAllUrl: '/with-id',
        identifier: 'unique-identifier-123'
      };

      const statWithoutId: UserStats = {
        state: 'Without ID',
        totalPoints: '40',
        iconUrl: '/no-id-icon.png',
        vewAllUrl: '/without-id'
      };

      component.userStats = [statWithId, statWithoutId];

      expect(component.userStats[0].identifier).toBe('unique-identifier-123');
      expect(component.userStats[1].identifier).toBeUndefined();
    });
  });

  describe('Router Navigation Error Handling', () => {
    it('should handle router navigation errors gracefully', () => {
      const mockUserStats: UserStats = {
        state: 'Error Test',
        totalPoints: '5',
        iconUrl: '/error-icon.png',
        vewAllUrl: '/error-url',
        stateInfo: 'This will cause an error'
      };

      mockRouter.navigateByUrl.mockImplementation(() => {
        throw new Error('Navigation failed');
      });

      expect(() => component.viewAll(mockUserStats)).toThrow('Navigation failed');
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/error-url');
    });

    it('should call navigateByUrl with exact URL provided', () => {
      const testUrl = '/exact/test/url';
      const mockUserStats: UserStats = {
        state: 'Exact Test',
        totalPoints: '42',
        iconUrl: '/exact-icon.png',
        vewAllUrl: testUrl,
        stateInfo: 'Exact URL test'
      };

      component.viewAll(mockUserStats);

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(testUrl);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases and Integration', () => {
    it('should handle viewAll called multiple times with different URLs', () => {
      const stat1: UserStats = {
        state: 'First',
        totalPoints: '10',
        iconUrl: '/first-icon.png',
        vewAllUrl: '/url1'
      };
      const stat2: UserStats = {
        state: 'Second',
        totalPoints: '20',
        iconUrl: '/second-icon.png',
        vewAllUrl: '/url2'
      };

      component.viewAll(stat1);
      component.viewAll(stat2);

      expect(mockRouter.navigateByUrl).toHaveBeenCalledTimes(2);
      expect(mockRouter.navigateByUrl).toHaveBeenNthCalledWith(1, '/url1');
      expect(mockRouter.navigateByUrl).toHaveBeenNthCalledWith(2, '/url2');
    });

    it('should handle mixed valid and invalid URLs in sequence', () => {
      const validStat: UserStats = {
        state: 'Valid',
        totalPoints: '30',
        iconUrl: '/valid-icon.png',
        vewAllUrl: '/valid-url'
      };
      const invalidStat: UserStats = {
        state: 'Invalid',
        totalPoints: '0',
        iconUrl: '/invalid-icon.png',
        vewAllUrl: ''
      };
      const anotherValidStat: UserStats = {
        state: 'Another Valid',
        totalPoints: '45',
        iconUrl: '/another-icon.png',
        vewAllUrl: '/another-valid'
      };

      component.viewAll(validStat);
      component.viewAll(invalidStat);
      component.viewAll(anotherValidStat);

      expect(mockRouter.navigateByUrl).toHaveBeenCalledTimes(2);
      expect(mockRouter.navigateByUrl).toHaveBeenNthCalledWith(1, '/valid-url');
      expect(mockRouter.navigateByUrl).toHaveBeenNthCalledWith(2, '/another-valid');
    });

    it('should maintain component state after navigation calls', () => {
      const initialStats: UserStats[] = [
        {
          state: 'Maintenance Test',
          totalPoints: '100',
          iconUrl: '/maintenance-icon.png',
          vewAllUrl: '/maintenance-test',
          stateInfo: 'State maintenance test'
        }
      ];
      component.userStats = initialStats;

      component.viewAll(initialStats[0]);

      expect(component.userStats).toEqual(initialStats);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/maintenance-test');
    });

    it('should handle component lifecycle with userStats changes', () => {
      // Initial state
      component.ngOnInit();
      expect(component.userStats).toEqual([]);

      // Add stats
      const newStats: UserStats[] = [
        {
          state: 'Lifecycle Test',
          totalPoints: '55',
          iconUrl: '/lifecycle-icon.png',
          vewAllUrl: '/lifecycle-test',
          stateInfo: 'Lifecycle testing'
        }
      ];
      component.userStats = newStats;

      // Use viewAll
      component.viewAll(newStats[0]);

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/lifecycle-test');
      expect(component.userStats).toEqual(newStats);
    });

    it('should handle UserStats with zero totalPoints', () => {
      const zeroPointsStat: UserStats = {
        state: 'Zero Points',
        totalPoints: '0',
        iconUrl: '/zero-icon.png',
        vewAllUrl: '/zero-points'
      };

      component.viewAll(zeroPointsStat);

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/zero-points');
    });

    it('should handle UserStats with very long state names', () => {
      const longNameStat: UserStats = {
        state: 'This is a very long state name that might cause display issues',
        totalPoints: '999',
        iconUrl: '/long-name-icon.png',
        vewAllUrl: '/long-name-test',
        stateInfo: 'This is also a very long tooltip information that provides detailed explanation'
      };

      component.viewAll(longNameStat);

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/long-name-test');
    });

    it('should handle special characters in state properties', () => {
      const specialCharStat: UserStats = {
        state: 'Special & Characters <> "Test"',
        totalPoints: '123',
        iconUrl: '/special-char-icon.png',
        vewAllUrl: '/special-chars?param=value&other=test',
        stateInfo: 'Info with special chars: <>&"\'',
        identifier: 'special-chars-123'
      };

      component.viewAll(specialCharStat);

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/special-chars?param=value&other=test');
    });
  });
});