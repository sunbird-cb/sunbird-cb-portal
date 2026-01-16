import { NetworkNavigationComponent } from './network-navigation.component';
import { routesData } from '../../models/network-v3.model';

describe('NetworkNavigationComponent', () => {
  let component: NetworkNavigationComponent;

  beforeEach(() => {
    // Create component instance directly
    component = new NetworkNavigationComponent();
  });

  describe('Component Initialization', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty navigationItems array', () => {
      expect(component.navigationItems).toEqual([]);
      expect(Array.isArray(component.navigationItems)).toBe(true);
    });
  });

  describe('Input Properties', () => {
    it('should accept navigationItems input', () => {
      const mockNavigationItems: routesData[] = [
        {
          name: 'Dashboard',
          navigationUrl: '/dashboard',
          routeId: 'dashboard',
          icon: 'dashboard'
        },
        {
          name: 'Profile',
          navigationUrl: '/profile',
          routeId: 'profile',
          icon: 'person'
        }
      ];

      component.navigationItems = mockNavigationItems;

      expect(component.navigationItems).toEqual(mockNavigationItems);
      expect(component.navigationItems.length).toBe(2);
    });

    it('should handle navigationItems with all optional properties', () => {
      const mockNavigationItems: routesData[] = [
        {
          name: 'Settings',
          navigationUrl: '/settings',
          routeId: 'settings',
          icon: 'settings',
          imageUrl: 'assets/settings.png',
          queryParams: { tab: 'general' },
          showUpdate: true
        }
      ];

      component.navigationItems = mockNavigationItems;

      expect(component.navigationItems[0].icon).toBe('settings');
      expect(component.navigationItems[0].imageUrl).toBe('assets/settings.png');
      expect(component.navigationItems[0].queryParams).toEqual({ tab: 'general' });
      expect(component.navigationItems[0].showUpdate).toBe(true);
    });

    it('should handle navigationItems with only required properties', () => {
      const mockNavigationItems: routesData[] = [
        {
          name: 'Home',
          navigationUrl: '/home',
          routeId: 'home'
        }
      ];

      component.navigationItems = mockNavigationItems;

      expect(component.navigationItems[0].name).toBe('Home');
      expect(component.navigationItems[0].navigationUrl).toBe('/home');
      expect(component.navigationItems[0].routeId).toBe('home');
      expect(component.navigationItems[0].icon).toBeUndefined();
      expect(component.navigationItems[0].imageUrl).toBeUndefined();
      expect(component.navigationItems[0].queryParams).toBeUndefined();
      expect(component.navigationItems[0].showUpdate).toBeUndefined();
    });

    it('should handle empty navigationItems array', () => {
      component.navigationItems = [];

      expect(component.navigationItems).toEqual([]);
      expect(component.navigationItems.length).toBe(0);
    });

    it('should handle multiple navigation items with mixed properties', () => {
      const mockNavigationItems: routesData[] = [
        {
          name: 'Connections',
          navigationUrl: '/connections',
          routeId: 'connections',
          icon: 'people',
          showUpdate: true
        },
        {
          name: 'Messages',
          navigationUrl: '/messages',
          routeId: 'messages',
          imageUrl: 'assets/messages.svg',
          queryParams: { filter: 'unread' }
        },
        {
          name: 'Notifications',
          navigationUrl: '/notifications',
          routeId: 'notifications'
        }
      ];

      component.navigationItems = mockNavigationItems;

      expect(component.navigationItems.length).toBe(3);
      
      // First item
      expect(component.navigationItems[0].name).toBe('Connections');
      expect(component.navigationItems[0].icon).toBe('people');
      expect(component.navigationItems[0].showUpdate).toBe(true);
      
      // Second item
      expect(component.navigationItems[1].name).toBe('Messages');
      expect(component.navigationItems[1].imageUrl).toBe('assets/messages.svg');
      expect(component.navigationItems[1].queryParams).toEqual({ filter: 'unread' });
      
      // Third item
      expect(component.navigationItems[2].name).toBe('Notifications');
      expect(component.navigationItems[2].icon).toBeUndefined();
      expect(component.navigationItems[2].showUpdate).toBeUndefined();
    });
  });

  describe('Navigation Items Validation', () => {
    it('should handle navigation items with special characters in name', () => {
      const mockNavigationItems: routesData[] = [
        {
          name: 'Network & Connections',
          navigationUrl: '/network-connections',
          routeId: 'network-connections'
        }
      ];

      component.navigationItems = mockNavigationItems;

      expect(component.navigationItems[0].name).toBe('Network & Connections');
    });

    it('should handle navigation items with complex URLs', () => {
      const mockNavigationItems: routesData[] = [
        {
          name: 'Advanced Search',
          navigationUrl: '/search/advanced',
          routeId: 'advanced-search',
          queryParams: { 
            category: 'all',
            sort: 'relevance',
            page: 1
          }
        }
      ];

      component.navigationItems = mockNavigationItems;

      expect(component.navigationItems[0].navigationUrl).toBe('/search/advanced');
      expect(component.navigationItems[0].queryParams).toEqual({
        category: 'all',
        sort: 'relevance',
        page: 1
      });
    });

    it('should handle navigation items with boolean showUpdate values', () => {
      const mockNavigationItems: routesData[] = [
        {
          name: 'Updates Available',
          navigationUrl: '/updates',
          routeId: 'updates',
          showUpdate: true
        },
        {
          name: 'No Updates',
          navigationUrl: '/no-updates',
          routeId: 'no-updates',
          showUpdate: false
        }
      ];

      component.navigationItems = mockNavigationItems;

      expect(component.navigationItems[0].showUpdate).toBe(true);
      expect(component.navigationItems[1].showUpdate).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null navigationItems gracefully', () => {
      component.navigationItems = null as any;

      expect(component.navigationItems).toBe(null);
    });

    it('should handle undefined navigationItems gracefully', () => {
      component.navigationItems = undefined as any;

      expect(component.navigationItems).toBe(undefined);
    });

    it('should handle navigation items with empty strings', () => {
      const mockNavigationItems: routesData[] = [
        {
          name: '',
          navigationUrl: '',
          routeId: '',
          icon: ''
        }
      ];

      component.navigationItems = mockNavigationItems;

      expect(component.navigationItems[0].name).toBe('');
      expect(component.navigationItems[0].navigationUrl).toBe('');
      expect(component.navigationItems[0].routeId).toBe('');
      expect(component.navigationItems[0].icon).toBe('');
    });

    it('should handle navigation items with very long names', () => {
      const longName = 'This is a very long navigation item name that might cause display issues';
      const mockNavigationItems: routesData[] = [
        {
          name: longName,
          navigationUrl: '/long-name',
          routeId: 'long-name'
        }
      ];

      component.navigationItems = mockNavigationItems;

      expect(component.navigationItems[0].name).toBe(longName);
      expect(component.navigationItems[0].name.length).toBeGreaterThan(50);
    });
  });

  describe('Component State Management', () => {
    it('should maintain navigationItems state after multiple updates', () => {
      const firstItems: routesData[] = [
        {
          name: 'First',
          navigationUrl: '/first',
          routeId: 'first'
        }
      ];

      const secondItems: routesData[] = [
        {
          name: 'Second',
          navigationUrl: '/second',
          routeId: 'second'
        },
        {
          name: 'Third',
          navigationUrl: '/third',
          routeId: 'third'
        }
      ];

      // First update
      component.navigationItems = firstItems;
      expect(component.navigationItems.length).toBe(1);
      expect(component.navigationItems[0].name).toBe('First');

      // Second update
      component.navigationItems = secondItems;
      expect(component.navigationItems.length).toBe(2);
      expect(component.navigationItems[0].name).toBe('Second');
      expect(component.navigationItems[1].name).toBe('Third');
    });

    it('should handle dynamic addition of navigation items', () => {
      component.navigationItems = [];

      const newItem: routesData = {
        name: 'Dynamic Item',
        navigationUrl: '/dynamic',
        routeId: 'dynamic'
      };

      component.navigationItems = [...component.navigationItems, newItem];

      expect(component.navigationItems.length).toBe(1);
      expect(component.navigationItems[0].name).toBe('Dynamic Item');
    });
  });
});
