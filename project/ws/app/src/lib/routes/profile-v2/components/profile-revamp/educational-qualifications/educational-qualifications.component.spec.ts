import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_LEGACY_DIALOG_DATA, MatLegacyDialogRef } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar';
import { of, throwError } from 'rxjs';
import * as _ from 'lodash';
import { educationalQualifications } from '../../../models/profile-revamp.model';
import { EducationalQualificationsComponent } from './educational-qualifications.component';
import { ProfileV2RevampService } from '../../../services/profile-v2-revamp.service';

describe('EducationalQualificationsComponent', () => {
  let component: EducationalQualificationsComponent;
  let fixture: ComponentFixture<EducationalQualificationsComponent>;
  let mockDialogRef: any;
  let mockProfileV2RevampService: any;
  let mockSnackBar: any;
  let mockData: any;

  const mockEducationalQualifications: educationalQualifications[] = [
    {
      education: 'Bachelor of Science',
      instituteAndLocation: 'MIT, Cambridge',
      period: '2018-2022'
    },
    {
      education: 'Master of Science',
      instituteAndLocation: 'Stanford University, California',
      period: '2022-2024'
    }
  ];

  const mockApiResponse = {
    result: {
      response: {
        educationalQualifications: [
          {
            degree: 'Bachelor of Science',
            fieldOfStudy: 'Computer Science',
            institutionName: 'MIT',
            startYear: '2018',
            endYear: '2022'
          },
          {
            degree: 'Master of Science',
            fieldOfStudy: 'Machine Learning',
            institutionName: 'Stanford University',
            startYear: '2022',
            endYear: '2024'
          }
        ]
      }
    }
  };

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn()
    };

    mockProfileV2RevampService = {
      fetchProfileEntries: jest.fn()
    };

    mockSnackBar = {
      open: jest.fn()
    };

    mockData = {
      userId: 'test-user-123',
      isCurrentUser: true
    };

    await TestBed.configureTestingModule({
      declarations: [EducationalQualificationsComponent],
      providers: [
        { provide: MatLegacyDialogRef, useValue: mockDialogRef },
        { provide: MAT_LEGACY_DIALOG_DATA, useValue: mockData },
        { provide: ProfileV2RevampService, useValue: mockProfileV2RevampService },
        { provide: MatLegacySnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EducationalQualificationsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values when no data is provided', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        declarations: [EducationalQualificationsComponent],
        providers: [
          { provide: MatLegacyDialogRef, useValue: mockDialogRef },
          { provide: MAT_LEGACY_DIALOG_DATA, useValue: null },
          { provide: ProfileV2RevampService, useValue: mockProfileV2RevampService },
          { provide: MatLegacySnackBar, useValue: mockSnackBar }
        ]
      });
      
      const newFixture = TestBed.createComponent(EducationalQualificationsComponent);
      const newComponent = newFixture.componentInstance;
      
      expect(newComponent.userId).toBe('');
      expect(newComponent.isPopup).toBe(false);
      expect(newComponent.isCurrentUser).toBe(false);
      expect(newComponent.educationalQualificationsList).toEqual([]);
    });

    it('should initialize with data when provided', () => {
      expect(component.userId).toBe('test-user-123');
      expect(component.isPopup).toBe(true);
      expect(component.isCurrentUser).toBe(true);
    });

    it('should handle data without isCurrentUser property', () => {
      const dataWithoutCurrentUser = { userId: 'test-user-456' };
      
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        declarations: [EducationalQualificationsComponent],
        providers: [
          { provide: MatLegacyDialogRef, useValue: mockDialogRef },
          { provide: MAT_LEGACY_DIALOG_DATA, useValue: dataWithoutCurrentUser },
          { provide: ProfileV2RevampService, useValue: mockProfileV2RevampService },
          { provide: MatLegacySnackBar, useValue: mockSnackBar }
        ]
      });
      
      const newFixture = TestBed.createComponent(EducationalQualificationsComponent);
      const newComponent = newFixture.componentInstance;
      
      expect(newComponent.userId).toBe('test-user-456');
      expect(newComponent.isCurrentUser).toBe(false);
    });
  });

  describe('ngOnInit', () => {
    // it('should call getEducationalQualificationsList when isPopup is true', () => {
    //   const spy = jest.spyOn(component, 'getEducationalQualificationsList');
    //   component.isPopup = true;
      
    //   component.ngOnInit();
      
    //   expect(spy).toHaveBeenCalled();
    // });

    it('should not call getEducationalQualificationsList when isPopup is false', () => {
      const spy = jest.spyOn(component, 'getEducationalQualificationsList');
      component.isPopup = false;
      
      component.ngOnInit();
      
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('getEducationalQualificationsList', () => {
    beforeEach(() => {
      component.userId = 'test-user-123';
    });

    it('should fetch educational qualifications successfully', () => {
      mockProfileV2RevampService.fetchProfileEntries.mockReturnValue(of(mockApiResponse));
      const lodashGetSpy = jest.spyOn(_, 'get');
      
      component.getEducationalQualificationsList();
      
      expect(mockProfileV2RevampService.fetchProfileEntries).toHaveBeenCalledWith('test-user-123', 'education');
      expect(lodashGetSpy).toHaveBeenCalledWith(mockApiResponse, 'result.response.educationalQualifications', []);
      expect(component.educationalQualificationsList).toEqual(mockApiResponse.result.response.educationalQualifications);
    });

    it('should handle empty response', () => {
      const emptyResponse = null;
      mockProfileV2RevampService.fetchProfileEntries.mockReturnValue(of(emptyResponse));
      
      component.getEducationalQualificationsList();
      
      expect(mockProfileV2RevampService.fetchProfileEntries).toHaveBeenCalledWith('test-user-123', 'education');
      expect(component.educationalQualificationsList).toEqual([]);
    });

    it('should handle api error and show snackbar', () => {
      const errorResponse = { message: 'API Error' };
      mockProfileV2RevampService.fetchProfileEntries.mockReturnValue(throwError(errorResponse));
      const snackbarSpy = jest.spyOn(component as any, 'openSnackbar');
      
      component.getEducationalQualificationsList();
      
      expect(mockProfileV2RevampService.fetchProfileEntries).toHaveBeenCalledWith('test-user-123', 'education');
      expect(snackbarSpy).toHaveBeenCalledWith('Something went wrong while fetching educational qualifications, please try again later', 2000);
    });

    it('should not fetch when userId is empty', () => {
      component.userId = '';
      
      component.getEducationalQualificationsList();
      
      expect(mockProfileV2RevampService.fetchProfileEntries).not.toHaveBeenCalled();
    });

    it('should handle null error response', () => {
      mockProfileV2RevampService.fetchProfileEntries.mockReturnValue(throwError(null));
      const snackbarSpy = jest.spyOn(component as any, 'openSnackbar');
      
      component.getEducationalQualificationsList();
      
      expect(snackbarSpy).not.toHaveBeenCalled();
    });
  });

  describe('openEditDialog', () => {
    const mockEntry: any = { id: 1, degree: 'Test Degree' };

    it('should close dialog with entry when isPopup is true', () => {
      component.isPopup = true;
      
      component.openEditDialog(mockEntry);
      
      expect(mockDialogRef.close).toHaveBeenCalledWith(mockEntry);
    });

    it('should emit openProfileEntryEditDialog when isPopup is false', () => {
      component.isPopup = false;
      const emitSpy = jest.spyOn(component.openProfileEntryEditDialog, 'emit');
      
      component.openEditDialog(mockEntry);
      
      expect(emitSpy).toHaveBeenCalledWith(mockEntry);
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should handle empty entry parameter when isPopup is true', () => {
      component.isPopup = true;
      
      component.openEditDialog();
      
      expect(mockDialogRef.close).toHaveBeenCalledWith({});
    });

    it('should handle empty entry parameter when isPopup is false', () => {
      component.isPopup = false;
      const emitSpy = jest.spyOn(component.openProfileEntryEditDialog, 'emit');
      
      component.openEditDialog();
      
      expect(emitSpy).toHaveBeenCalledWith({});
    });
  });

  describe('closePopup', () => {
    it('should close dialog when isPopup is true', () => {
      component.isPopup = true;
      
      component.closePopup();
      
      expect(mockDialogRef.close).toHaveBeenCalledWith();
    });

    it('should not close dialog when isPopup is false', () => {
      component.isPopup = false;
      
      component.closePopup();
      
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });
  });

  describe('openSnackbar', () => {
    it('should open snackbar with default duration', () => {
      const message = 'Test message';
      
      (component as any).openSnackbar(message);
      
      expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'X', { duration: 5000 });
    });

    it('should open snackbar with custom duration', () => {
      const message = 'Test message';
      const duration = 3000;
      
      (component as any).openSnackbar(message, duration);
      
      expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'X', { duration: 3000 });
    });
  });

  describe('Input Properties', () => {
    it('should accept educationalQualificationsList input', () => {
      component.educationalQualificationsList = mockEducationalQualifications;
      
      expect(component.educationalQualificationsList).toEqual(mockEducationalQualifications);
      expect(component.educationalQualificationsList.length).toBe(2);
    });

    it('should accept isCurrentUser input', () => {
      component.isCurrentUser = true;
      expect(component.isCurrentUser).toBe(true);
      
      component.isCurrentUser = false;
      expect(component.isCurrentUser).toBe(false);
    });
  });

  describe('Output Properties', () => {
    it('should emit openProfileEntryEditDialog event', () => {
      const mockEntry = { id: 1, degree: 'Test' };
      let emittedValue: any;
      
      component.openProfileEntryEditDialog.subscribe((value: any) => {
        emittedValue = value;
      });
      
      component.isPopup = false;
      component.openEditDialog(mockEntry);
      
      expect(emittedValue).toEqual(mockEntry);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined lodash get result', () => {
      const responseWithoutEducation = { result: { response: {} } };
      mockProfileV2RevampService.fetchProfileEntries.mockReturnValue(of(responseWithoutEducation));
      
      component.getEducationalQualificationsList();
      
      expect(component.educationalQualificationsList).toEqual([]);
    });

    it('should handle malformed API response', () => {
      const malformedResponse = { data: 'invalid' };
      mockProfileV2RevampService.fetchProfileEntries.mockReturnValue(of(malformedResponse));
      
      component.getEducationalQualificationsList();
      
      expect(component.educationalQualificationsList).toEqual([]);
    });

    it('should maintain state when switching between popup modes', () => {
      component.isPopup = true;
      component.userId = 'test-123';
      component.educationalQualificationsList = mockEducationalQualifications;
      
      component.isPopup = false;
      
      expect(component.userId).toBe('test-123');
      expect(component.educationalQualificationsList).toEqual(mockEducationalQualifications);
    });
  });

  describe('Component Integration', () => {
    it('should work correctly when all dependencies are properly injected', () => {
      expect(component).toBeDefined();
      expect((component as any).dialogRef).toBeDefined();
      expect((component as any).profileV2RevampSvc).toBeDefined();
      expect((component as any).snackBar).toBeDefined();
      expect((component as any).data).toBeDefined();
    });

    it('should initialize correctly with full data object', () => {
      const fullMockData = {
        userId: 'full-test-user',
        isCurrentUser: true,
        additionalProperty: 'ignored'
      };

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        declarations: [EducationalQualificationsComponent],
        providers: [
          { provide: MatLegacyDialogRef, useValue: mockDialogRef },
          { provide: MAT_LEGACY_DIALOG_DATA, useValue: fullMockData },
          { provide: ProfileV2RevampService, useValue: mockProfileV2RevampService },
          { provide: MatLegacySnackBar, useValue: mockSnackBar }
        ]
      });

      const newFixture = TestBed.createComponent(EducationalQualificationsComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.userId).toBe('full-test-user');
      expect(newComponent.isCurrentUser).toBe(true);
      expect(newComponent.isPopup).toBe(true);
    });
  });
});