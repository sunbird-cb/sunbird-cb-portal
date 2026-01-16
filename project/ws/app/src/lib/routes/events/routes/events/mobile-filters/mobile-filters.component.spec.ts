import { MobileFiltersComponent } from './mobile-filters.component';

describe('MobileFiltersComponent', () => {
  let component: MobileFiltersComponent;
  let mockSnackBar: any;
  let mockDatePipe: any;
  let mockBottomSheetRef: any;
  let mockData: any;

  beforeEach(() => {
    // Mock dependencies
    mockSnackBar = {
      open: jest.fn()
    };

    mockDatePipe = {
      transform: jest.fn((format) => {
        if (format === 'yyyy-MM-dd') {
          return '2025-03-13';
        }
        return '13/03/2025';
      })
    };

    mockBottomSheetRef = {
      dismiss: jest.fn()
    };

    mockData = {
      facetsData: {
        resourceType: {
          name: "Event Type",
          values: [
            { key: "webinar", name: "Webinar" },
            { key: "karmayogiTalks", name: "Karmayogi Talks" }
          ]
        },
        eventStatus: {
          name: "Event Status",
          values: [
            { key: "upcoming", name: "Upcoming" },
            { key: "liveEvents", name: "Live Events" }
          ]
        }
      },
      selectedFilters: {
        resourceType: ['webinar']
      },
      clonedFilters: {
        resourceType: ['webinar']
      }
    };

    // Create component instance
    component = new MobileFiltersComponent(
      mockData,
      mockSnackBar,
      mockDatePipe,
      mockBottomSheetRef
    );

    // Call ngOnInit manually
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with data from the bottom sheet', () => {
    expect(component.facetsData).toEqual(mockData.facetsData);
    expect(component.selectedFilters).toEqual(mockData.selectedFilters);
    expect(component.clonedFilters).toEqual(mockData.clonedFilters);
  });

  it('should initialize with date range if present in selectedFilters', () => {
    // Update mockData with dateRange
    mockData.selectedFilters.dateRange = {
      fromDate: new Date('2025-03-01'),
      toDate: new Date('2025-03-15')
    };

    // Create new component with updated data
    const newComponent = new MobileFiltersComponent(
      mockData,
      mockSnackBar,
      mockDatePipe,
      mockBottomSheetRef
    );

    newComponent.ngOnInit();

    expect(newComponent.startDate).toBe('13/03/2025');
    expect(newComponent.endDate).toBe('13/03/2025');
  });

  it('should return 0 when returnZero is called', () => {
    expect(component.returnZero()).toBe(0);
  });

  describe('canCheck', () => {
    it('should return true when filter is selected', () => {
      const result = component.canCheck('resourceType', { name: 'webinar' });
      expect(result).toBeTruthy();
    });

    it('should return undefined when filter is not selected', () => {
      const result = component.canCheck('resourceType', { name: 'nonExistentFilter' });
      expect(result).toBeFalsy()
    });

    it('should return undefined when filter category does not exist', () => {
      const result = component.canCheck('nonExistentCategory', { name: 'webinar' });
      expect(result).toBeUndefined();
    });
  });

  describe('changeSelection', () => {
    it('should add a selection when checked', () => {
      component.changeSelection(true, 'resourceType', { name: 'karmayogiTalks' }, {});
      expect(component.selectedFilters.resourceType).toContain('karmayogiTalks');
    });

    it('should create a new array when category does not exist', () => {
      component.selectedFilters = {};
      component.changeSelection(true, 'resourceType', { name: 'webinar' }, {});
      expect(component.selectedFilters.resourceType).toEqual(['webinar']);
    });

    it('should remove a selection when unchecked', () => {
      component.selectedFilters = { resourceType: ['webinar', 'karmayogiTalks'] };
      component.changeSelection(false, 'resourceType', { name: 'webinar' }, {});
      expect(component.selectedFilters.resourceType).toEqual(['karmayogiTalks']);
    });

    it('should remove the category when all items are unchecked', () => {
      component.selectedFilters = { resourceType: ['webinar'] };
      component.changeSelection(false, 'resourceType', { name: 'webinar' }, {});
      expect(component.selectedFilters.resourceType).toBeUndefined();
    });

    it('should clear eventStatus and dateRange when eventDate is selected', () => {
      component.selectedFilters = {
        eventStatus: ['Live Events'],
        dateRange: { fromDate: new Date(), toDate: new Date() }
      };
      component.startDate = '2025-03-01';
      component.endDate = '2025-03-15';

      component.changeSelection(true, 'eventDate', { name: 'Today' }, {});

      expect(component.selectedFilters.eventStatus).toBeUndefined();
      expect(component.selectedFilters.dateRange).toBeUndefined();
      expect(component.startDate).toBe('');
      expect(component.endDate).toBe('');
    });

    it('should clear eventDate and dateRange when eventStatus is selected', () => {
      component.selectedFilters = {
        eventDate: ['Today'],
        dateRange: { fromDate: new Date(), toDate: new Date() }
      };
      component.startDate = '2025-03-01';
      component.endDate = '2025-03-15';

      component.changeSelection(true, 'eventStatus', { name: 'Live Events' }, {});

      expect(component.selectedFilters.eventDate).toBeUndefined();
      expect(component.selectedFilters.dateRange).toBeUndefined();
      expect(component.startDate).toBe('');
      expect(component.endDate).toBe('');
    });
  });

  describe('onDateChange', () => {
    it('should update startDate when fromDate changes', () => {
      component.onDateChange({ value: new Date('2025-03-01') }, { key: 'fromDate' }, {});
      expect(component.startDate).toBe('13/03/2025');
      expect(component.selectedFilters.dateRange).toEqual({ fromDate: '13/03/2025' });
    });

    it('should update endDate when toDate changes', () => {
      component.onDateChange({ value: new Date('2025-03-15') }, { key: 'toDate' }, {});
      expect(component.endDate).toBe('13/03/2025');
      expect(component.selectedFilters.dateRange).toEqual({ toDate: '13/03/2025' });
    });
  });

  describe('clearAll', () => {
    it('should clear all filters and dates', () => {
      component.selectedFilters = {
        resourceType: ['webinar'],
        eventStatus: ['Live Events']
      };
      component.startDate = '2025-03-01';
      component.endDate = '2025-03-15';

      component.clearAll();

      expect(component.selectedFilters).toEqual({});
      expect(component.startDate).toBe('');
      expect(component.endDate).toBe('');
    });
  });

  describe('applyFilter', () => {
    it('should dismiss with selectedFilters when apply is called', () => {
      component.selectedFilters = { resourceType: ['webinar'] };

      component.applyFilter('apply');

      expect(mockBottomSheetRef.dismiss).toHaveBeenCalledWith({
        selectedFilters: component.selectedFilters,
        action: 'apply'
      });
    });

    it('should dismiss with clonedFilters when cancel is called', () => {
      component.selectedFilters = { resourceType: ['karmayogiTalks'] };
      component.clonedFilters = { resourceType: ['webinar'] };

      component.applyFilter('cancel');

      expect(mockBottomSheetRef.dismiss).toHaveBeenCalledWith({
        selectedFilters: component.clonedFilters,
        action: 'cancel'
      });
    });

    // it('should show error when start date is greater than end date', () => {
    //   component.selectedFilters = { dateRange: {} };
    //   component.startDate = '2025-03-15';
    //   component.endDate = '2025-03-01';

    //   // Mock Date constructor to ensure predictable behavior
    //   const originalDate = global.Date;
    //   global.Date = jest.fn((arg) => {
    //     if (arg === '2025-03-15') {
    //       return { getTime: () => 1000 } as any;
    //     }
    //     if (arg === '2025-03-01') {
    //       return { getTime: () => 500 } as any;
    //     }
    //     return new originalDate(arg);
    //   }) as any;

    //   component.applyFilter('apply');

    //   expect(mockSnackBar.open).toHaveBeenCalledWith('Start date should not greater than end date.');
    //   expect(mockBottomSheetRef.dismiss).not.toHaveBeenCalled();

    //   // Restore original Date
    //   global.Date = originalDate;
    // });

    it('should show error when date range is incomplete', () => {
      component.selectedFilters = { dateRange: {} };
      component.startDate = '2025-03-01';
      component.endDate = '';

      component.applyFilter('apply');

      expect(mockSnackBar.open).toHaveBeenCalledWith('Choose a valid date range.');
      expect(mockBottomSheetRef.dismiss).not.toHaveBeenCalled();
    });

    // it('should apply date range filter when both dates are valid', () => {
    //   component.selectedFilters = { 
    //     dateRange: {},
    //     eventDate: ['Today'],
    //     eventStatus: ['Live Events']
    //   };
    //   component.startDate = '2025-03-01';
    //   component.endDate = '2025-03-15';

    //   // Mock Date constructor to ensure predictable behavior
    //   const originalDate = global.Date;
    //   global.Date = jest.fn((arg) => {
    //     if (arg === '2025-03-01') {
    //       return { getTime: () => 500 } as any;
    //     }
    //     if (arg === '2025-03-15') {
    //       return { getTime: () => 1000 } as any;
    //     }
    //     return new originalDate(arg);
    //   }) as any;

    //   component.applyFilter('apply');

    //   expect(component.selectedFilters.eventDate).toBeUndefined();
    //   expect(component.selectedFilters.eventStatus).toBeUndefined();
    //   expect(component.selectedFilters.dateRange).toEqual({
    //     fromDate: expect.any(Object),
    //     toDate: expect.any(Object)
    //   });
    //   expect(mockBottomSheetRef.dismiss).toHaveBeenCalledWith({
    //     selectedFilters: component.selectedFilters,
    //     action: 'apply'
    //   });

    //   // Restore original Date
    //   global.Date = originalDate;
    // });
  });
});