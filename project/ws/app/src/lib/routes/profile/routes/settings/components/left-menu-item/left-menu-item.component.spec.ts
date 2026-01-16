import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils-v2';
import * as _ from 'lodash';
import { LeftMenuItemComponent } from './left-menu-item.component';

const mockEventService = { raiseInteractTelemetry: jest.fn() };
const mockConfigurationsService = {
  unMappedUser: {
    profileDetails: {
      profileStatus: 'active',
      employmentDetails: { departmentName: 'test-department' }
    }
  },
  updateTourGuideMethod: jest.fn()
};
const mockRouter = { navigate: jest.fn() };
const mockActivatedRoute = { snapshot: {}, params: {}, queryParams: {} };
const mockTranslateService = {
  setDefaultLang: jest.fn(),
  use: jest.fn(),
  instant: jest.fn().mockReturnValue('translated-text')
};
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

describe('LeftMenuItemComponent', () => {
  let component: LeftMenuItemComponent;
  let fixture: ComponentFixture<LeftMenuItemComponent>;
  let eventService: any;
  let configSvc: any;
  let router: any;
  let activatedRoute: any;
  let translateService: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeftMenuItemComponent],
      providers: [
        { provide: EventService, useValue: mockEventService },
        { provide: ConfigurationsService, useValue: mockConfigurationsService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: TranslateService, useValue: mockTranslateService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LeftMenuItemComponent);
    component = fixture.componentInstance;
    eventService = TestBed.inject(EventService);
    configSvc = TestBed.inject(ConfigurationsService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    translateService = TestBed.inject(TranslateService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor', () => {

    it('should not set language when websiteLanguage does not exist in localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      expect(translateService.setDefaultLang).not.toHaveBeenCalled();
      expect(translateService.use).not.toHaveBeenCalled();
    });

    it('should handle empty string in localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('');

      expect(translateService.setDefaultLang).not.toHaveBeenCalled();
      expect(translateService.use).not.toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      component.item = { name: 'testItem', enabled: true };
    });

    it('should disable menu when user is not-my-user and department is igot', () => {
      jest.spyOn(_, 'get').mockImplementation((_obj: any, path: _.PropertyPath, defaultValue?: any) => {
        if (path === 'unMappedUser.profileDetails.profileStatus') return 'NOT-MY-USER';
        if (path === 'unMappedUser.profileDetails.employmentDetails.departmentName') return 'IGOT';
        return defaultValue || '';
      });

      component.ngOnChanges();

      expect(component.disableMenu).toBe(true);
    });

    it('should not disable menu when user is not-my-user but department is not igot', () => {
      jest.spyOn(_, 'get').mockImplementation((_obj: any, path: _.PropertyPath, defaultValue?: any) => {
        if (path === 'unMappedUser.profileDetails.profileStatus') return 'not-my-user';
        if (path === 'unMappedUser.profileDetails.employmentDetails.departmentName') return 'other-dept';
        return defaultValue || '';
      });

      component.ngOnChanges();

      expect(component.disableMenu).toBe(false);
    });

    it('should not disable menu when user is active and department is igot', () => {
      jest.spyOn(_, 'get').mockImplementation((_obj: any, path: _.PropertyPath, defaultValue?: any) => {
        if (path === 'unMappedUser.profileDetails.profileStatus') return 'active';
        if (path === 'unMappedUser.profileDetails.employmentDetails.departmentName') return 'igot';
        return defaultValue || '';
      });

      component.ngOnChanges();

      expect(component.disableMenu).toBe(false);
    });

    it('should disable getStartedTour item when menu is disabled', () => {
      component.item = { name: 'getStartedTour', enabled: true };
      
      jest.spyOn(_, 'get').mockImplementation((_obj: any, path: _.PropertyPath, defaultValue?: any) => {
        if (path === 'unMappedUser.profileDetails.profileStatus') return 'not-my-user';
        if (path === 'unMappedUser.profileDetails.employmentDetails.departmentName') return 'igot';
        if (path === 'name') return 'getStartedTour';
        return defaultValue || '';
      });

      component.ngOnChanges();

      expect(component.disableMenu).toBe(true);
      expect(component.item.enabled).toBe(false);
    });

    it('should not disable other items when menu is disabled', () => {
      component.item = { name: 'otherItem', enabled: true };
      
      jest.spyOn(_, 'get').mockImplementation((_obj: any, path: _.PropertyPath, defaultValue?: any) => {
        if (path === 'unMappedUser.profileDetails.profileStatus') return 'not-my-user';
        if (path === 'unMappedUser.profileDetails.employmentDetails.departmentName') return 'igot';
        if (path === 'name') return 'otherItem';
        return defaultValue || '';
      });

      component.ngOnChanges();

      expect(component.disableMenu).toBe(true);
      expect(component.item.enabled).toBe(true);
    });

    it('should handle empty profile status and department name', () => {
      jest.spyOn(_, 'get').mockImplementation((_obj: any, _path: _.PropertyPath, defaultValue?: any) => {
        return defaultValue || '';
      });

      component.ngOnChanges();

      expect(component.disableMenu).toBe(false);
    });
  });

  describe('menuClick', () => {
    it('should raise interact telemetry with correct parameters', () => {
      const mockTab = { name: 'test menu' };
      jest.spyOn(_, 'camelCase').mockReturnValue('testMenu');

      component.menuClick(mockTab);

      expect(eventService.raiseInteractTelemetry).toHaveBeenCalledWith(
        {
          type: WsEvents.EnumInteractTypes.CLICK,
          subType: WsEvents.EnumInteractSubTypes.SIDE_MENU,
          id: 'testMenu-menu'
        },
        {}
      );
    });

    it('should handle tab with special characters in name', () => {
      const mockTab = { name: 'Test Menu Item!' };
      jest.spyOn(_, 'camelCase').mockReturnValue('testMenuItem');

      component.menuClick(mockTab);

      expect(eventService.raiseInteractTelemetry).toHaveBeenCalledWith(
        {
          type: WsEvents.EnumInteractTypes.CLICK,
          subType: WsEvents.EnumInteractSubTypes.SIDE_MENU,
          id: 'testMenuItem-menu'
        },
        {}
      );
    });

    it('should handle null or undefined tab name', () => {
      const mockTab = { name: null };
      jest.spyOn(_, 'camelCase').mockReturnValue('');

      component.menuClick(mockTab);

      expect(eventService.raiseInteractTelemetry).toHaveBeenCalledWith(
        {
          type: WsEvents.EnumInteractTypes.CLICK,
          subType: WsEvents.EnumInteractSubTypes.SIDE_MENU,
          id: '-menu'
        },
        {}
      );
    });
  });

  describe('toggleOpen', () => {
    it('should toggle item open state and prevent default event', () => {
      const mockItem = { open: false };
      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      } as any;

      component.toggleOpen(mockItem, mockEvent);

      expect(mockItem.open).toBe(true);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should toggle item from open to closed', () => {
      const mockItem = { open: true };
      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      } as any;

      component.toggleOpen(mockItem, mockEvent);

      expect(mockItem.open).toBe(false);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should handle item without open property', () => {
      const mockItem = {} as any;
      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      } as any;

      component.toggleOpen(mockItem, mockEvent);

      expect(mockItem.open).toBe(true);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('tourClick', () => {
    it('should raise telemetry and navigate for getStartedTour', () => {
      const mockTab = { name: 'getStartedTour' };
      jest.spyOn(_, 'camelCase').mockReturnValue('getStartedTour');

      component.tourClick(mockTab);

      expect(eventService.raiseInteractTelemetry).toHaveBeenCalledWith(
        {
          type: WsEvents.EnumInteractTypes.CLICK,
          subType: WsEvents.EnumInteractSubTypes.SIDE_MENU,
          id: 'getStartedTour-menu'
        },
        {}
      );
      expect(router.navigate).toHaveBeenCalledWith(['/page/home'], {
        relativeTo: activatedRoute,
        queryParamsHandling: 'merge'
      });
      expect(configSvc.updateTourGuideMethod).toHaveBeenCalledWith(false);
    });

    it('should only raise telemetry for non-getStartedTour items', () => {
      const mockTab = { name: 'otherTour' };
      jest.spyOn(_, 'camelCase').mockReturnValue('otherTour');

      component.tourClick(mockTab);

      expect(eventService.raiseInteractTelemetry).toHaveBeenCalledWith(
        {
          type: WsEvents.EnumInteractTypes.CLICK,
          subType: WsEvents.EnumInteractSubTypes.SIDE_MENU,
          id: 'otherTour-menu'
        },
        {}
      );
      expect(router.navigate).not.toHaveBeenCalled();
      expect(configSvc.updateTourGuideMethod).not.toHaveBeenCalled();
    });

    it('should handle case-sensitive comparison for getStartedTour', () => {
      const mockTab = { name: 'GetStartedTour' };
      jest.spyOn(_, 'camelCase').mockReturnValue('getStartedTour');

      component.tourClick(mockTab);

      expect(eventService.raiseInteractTelemetry).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(configSvc.updateTourGuideMethod).not.toHaveBeenCalled();
    });

    it('should handle null or undefined tab name', () => {
      const mockTab = { name: null };
      jest.spyOn(_, 'camelCase').mockReturnValue('');

      component.tourClick(mockTab);

      expect(eventService.raiseInteractTelemetry).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(configSvc.updateTourGuideMethod).not.toHaveBeenCalled();
    });
  });

  describe('translateLetMenuName', () => {
    it('should return translated text for menu name', () => {
      const menuName = 'Test Menu';
      const expectedKey = 'settingLeftMenu.TestMenu';
      
      const result = component.translateLetMenuName(menuName);

      expect(translateService.instant).toHaveBeenCalledWith(expectedKey);
      expect(result).toBe('translated-text');
    });

    it('should handle menu name with spaces', () => {
      const menuName = 'Test Menu Item';
      const expectedKey = 'settingLeftMenu.TestMenuItem';
      
      const result = component.translateLetMenuName(menuName);

      expect(translateService.instant).toHaveBeenCalledWith(expectedKey);
      expect(result).toBe('translated-text');
    });

    it('should handle menu name with multiple spaces', () => {
      const menuName = 'Test  Menu  Item';
      const expectedKey = 'settingLeftMenu.TestMenuItem';
      
      const result = component.translateLetMenuName(menuName);

      expect(translateService.instant).toHaveBeenCalledWith(expectedKey);
      expect(result).toBe('translated-text');
    });

    it('should handle empty menu name', () => {
      const menuName = '';
      const expectedKey = 'settingLeftMenu.';
      
      const result = component.translateLetMenuName(menuName);

      expect(translateService.instant).toHaveBeenCalledWith(expectedKey);
      expect(result).toBe('translated-text');
    });

    it('should handle menu name with only spaces', () => {
      const menuName = '   ';
      const expectedKey = 'settingLeftMenu.';
      
      const result = component.translateLetMenuName(menuName);

      expect(translateService.instant).toHaveBeenCalledWith(expectedKey);
      expect(result).toBe('translated-text');
    });
  });

  describe('component properties', () => {
    it('should have correct initial values', () => {
      expect(component.disableMenu).toBe(false);
      expect(component.item).toBeUndefined();
    });
    it('should handle item input property', () => {
      const testItem = { name: 'test', enabled: true };
      component.item = testItem;
      expect(component.item).toEqual(testItem);
    });
  });

  describe('integration tests', () => {
    it('should handle complete workflow for getStartedTour with disabled menu', () => {
      component.item = { name: 'getStartedTour', enabled: true };
      
      // Setup mocks for ngOnChanges to disable menu
      jest.spyOn(_, 'get').mockImplementation((_: any, path: _.PropertyPath, defaultValue?: any) => {
        if (path === 'unMappedUser.profileDetails.profileStatus') return 'not-my-user';
        if (path === 'unMappedUser.profileDetails.employmentDetails.departmentName') return 'igot';
        if (path === 'name') return 'getStartedTour';
        return defaultValue || '';
      });

      component.ngOnChanges();
      
      expect(component.disableMenu).toBe(true);
      expect(component.item.enabled).toBe(false);

      // Test tourClick for getStartedTour
      jest.spyOn(_, 'camelCase').mockReturnValue('getStartedTour');
      component.tourClick(component.item);

      expect(eventService.raiseInteractTelemetry).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/page/home'], {
        relativeTo: activatedRoute,
        queryParamsHandling: 'merge'
      });
      expect(configSvc.updateTourGuideMethod).toHaveBeenCalledWith(false);
    });
  });
});