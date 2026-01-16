import { EventsEngagementComponent } from './events-engagement.component';
import { MultilingualTranslationsService } from '@sunbird-cb/utils-v2';

jest.mock('@sunbird-cb/utils-v2', () => ({
  MultilingualTranslationsService: jest.fn().mockImplementation(() => ({
    translateActualLabel: jest.fn((label, type) => `translated-${label}-${type}`),
  })),
}));

describe('EventsEngagementComponent', () => {
  let component: EventsEngagementComponent;
  let mockBottomSheetRef: any;
  let mockLangTranslations: any;

  beforeEach(() => {
    // Create mocks
    mockBottomSheetRef = {
      dismiss: jest.fn(),
    };
    
    mockLangTranslations = new (MultilingualTranslationsService as any)();

    // Initialize without data
    component = new EventsEngagementComponent(
      mockBottomSheetRef,
      null,
      mockLangTranslations
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with data when provided', () => {
    const mockData = {
      engagements: [{ id: 1, name: 'Engagement1' }],
      engagementDetails: { title: 'Test Engagement' }
    };
    
    component = new EventsEngagementComponent(
      mockBottomSheetRef,
      mockData,
      mockLangTranslations
    );
    
    expect(component.myEngagements).toEqual(mockData.engagements);
    expect(component.engagementDetails).toEqual(mockData.engagementDetails);
  });

  it('should translate labels correctly', () => {
    const result = component.translateLabels('TestLabel', 'TestType');
    expect(mockLangTranslations.translateActualLabel).toHaveBeenCalledWith('TestLabel', 'TestType', '');
    expect(result).toBe('translated-TestLabel-TestType');
  });

  it('should get value from engagementDetails correctly', () => {
    component.engagementDetails = {
      basic: { title: 'Test Title' },
      details: { description: 'Test Description' }
    };
    
    expect(component.getValue('basic.title')).toBe('Test Title');
    expect(component.getValue('details.description')).toBe('Test Description');
  });

  it('should return empty string if key is not found in engagementDetails', () => {
    component.engagementDetails = { basic: { title: 'Test Title' } };
    expect(component.getValue('basic.description')).toBe('');
  });

  it('should return empty string if engagementDetails is null', () => {
    component.engagementDetails = null;
    expect(component.getValue('basic.title')).toBe('');
  });

  it('should return empty string if key is null or undefined', () => {
    component.engagementDetails = { basic: { title: 'Test Title' } };
    expect(component.getValue('')).toBe('');
    expect(component.getValue('')).toBe('');
  });

  it('should close dialog when closeDiaolg is called', () => {
    component.closeDiaolg();
    expect(mockBottomSheetRef.dismiss).toHaveBeenCalled();
  });

  it('should call ngOnInit without errors', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });
});