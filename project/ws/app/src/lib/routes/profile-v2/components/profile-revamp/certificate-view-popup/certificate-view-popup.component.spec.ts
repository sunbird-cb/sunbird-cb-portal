import { CertificateViewPopupComponent } from './certificate-view-popup.component';

// Mock dependencies
const mockDialogRef = {
  close: jest.fn()
} as any;

const mockDataWithUrl = {
  certificateUrl: 'https://test.com/certificate.pdf'
} as any;

const mockDataWithoutUrl = {
  otherProperty: 'test'
} as any;

describe('CertificateViewPopupComponent', () => {
  let component: CertificateViewPopupComponent;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should initialize component with dialog data containing certificateUrl', () => {
      component = new CertificateViewPopupComponent(mockDialogRef, mockDataWithUrl);

      expect(component.data).toBe(mockDataWithUrl);
      expect(component.certificateUrl).toBe('');
    });

    it('should initialize component with dialog data without certificateUrl', () => {
      component = new CertificateViewPopupComponent(mockDialogRef, mockDataWithoutUrl);

      expect(component.data).toBe(mockDataWithoutUrl);
      expect(component.certificateUrl).toBe('');
    });

    it('should initialize component with null data', () => {
      component = new CertificateViewPopupComponent(mockDialogRef, null);

      expect(component.data).toBe(null);
      expect(component.certificateUrl).toBe('');
    });

    it('should initialize component with undefined data', () => {
      component = new CertificateViewPopupComponent(mockDialogRef, undefined);

      expect(component.data).toBe(undefined);
      expect(component.certificateUrl).toBe('');
    });

    it('should initialize component with empty object data', () => {
      const emptyData = {} as any;
      component = new CertificateViewPopupComponent(mockDialogRef, emptyData);

      expect(component.data).toBe(emptyData);
      expect(component.certificateUrl).toBe('');
    });
  });

  describe('ngOnInit', () => {
    it('should set certificateUrl when data contains valid certificateUrl', () => {
      const testUrl = 'https://test.com/sample-certificate.pdf';
      const testData = { certificateUrl: testUrl };
      component = new CertificateViewPopupComponent(mockDialogRef, testData);

      component.ngOnInit();

      expect(component.certificateUrl).toBe(testUrl);
    });

    it('should not set certificateUrl when data is null', () => {
      component = new CertificateViewPopupComponent(mockDialogRef, null);

      component.ngOnInit();

      expect(component.certificateUrl).toBe('');
    });

    it('should not set certificateUrl when data is undefined', () => {
      component = new CertificateViewPopupComponent(mockDialogRef, undefined);

      component.ngOnInit();

      expect(component.certificateUrl).toBe('');
    });

    it('should not set certificateUrl when data exists but certificateUrl is missing', () => {
      const testData = { otherProperty: 'test' };
      component = new CertificateViewPopupComponent(mockDialogRef, testData);

      component.ngOnInit();

      expect(component.certificateUrl).toBe('');
    });

    it('should not set certificateUrl when data exists but certificateUrl is empty string', () => {
      const testData = { certificateUrl: '' };
      component = new CertificateViewPopupComponent(mockDialogRef, testData);

      component.ngOnInit();

      expect(component.certificateUrl).toBe('');
    });

    it('should not set certificateUrl when data exists but certificateUrl is null', () => {
      const testData = { certificateUrl: null };
      component = new CertificateViewPopupComponent(mockDialogRef, testData);

      component.ngOnInit();

      expect(component.certificateUrl).toBe('');
    });

    it('should not set certificateUrl when data exists but certificateUrl is undefined', () => {
      const testData = { certificateUrl: undefined };
      component = new CertificateViewPopupComponent(mockDialogRef, testData);

      component.ngOnInit();

      expect(component.certificateUrl).toBe('');
    });

    it('should handle data with multiple properties including certificateUrl', () => {
      const testUrl = 'https://test.com/multi-prop-certificate.pdf';
      const testData = { 
        certificateUrl: testUrl,
        title: 'Test Certificate',
        issuer: 'Test Organization'
      };
      component = new CertificateViewPopupComponent(mockDialogRef, testData);

      component.ngOnInit();

      expect(component.certificateUrl).toBe(testUrl);
    });

    it('should handle certificateUrl with special characters', () => {
      const testUrl = 'https://test.com/certificate-file_name%20with%20spaces.pdf';
      const testData = { certificateUrl: testUrl };
      component = new CertificateViewPopupComponent(mockDialogRef, testData);

      component.ngOnInit();

      expect(component.certificateUrl).toBe(testUrl);
    });

    it('should handle certificateUrl with query parameters', () => {
      const testUrl = 'https://test.com/certificate.pdf?token=abc123&version=1';
      const testData = { certificateUrl: testUrl };
      component = new CertificateViewPopupComponent(mockDialogRef, testData);

      component.ngOnInit();

      expect(component.certificateUrl).toBe(testUrl);
    });
  });

  describe('closePopup', () => {
    it('should call dialogRef.close when closePopup is called', () => {
      component = new CertificateViewPopupComponent(mockDialogRef, mockDataWithUrl);

      component.closePopup();

      expect(mockDialogRef.close).toHaveBeenCalled();
      expect(mockDialogRef.close).toHaveBeenCalledTimes(1);
    });

    it('should call dialogRef.close without parameters', () => {
      component = new CertificateViewPopupComponent(mockDialogRef, mockDataWithUrl);

      component.closePopup();

      expect(mockDialogRef.close).toHaveBeenCalledWith();
    });

    it('should handle multiple calls to closePopup', () => {
      component = new CertificateViewPopupComponent(mockDialogRef, mockDataWithUrl);

      component.closePopup();
      component.closePopup();
      component.closePopup();

      expect(mockDialogRef.close).toHaveBeenCalledTimes(3);
    });
  });

  describe('Component Properties', () => {
    it('should initialize certificateUrl as empty string by default', () => {
      component = new CertificateViewPopupComponent(mockDialogRef, mockDataWithUrl);

      expect(component.certificateUrl).toBe('');
    });

    it('should have data property accessible publicly', () => {
      component = new CertificateViewPopupComponent(mockDialogRef, mockDataWithUrl);

      expect(component.data).toBeDefined();
      expect(component.data).toBe(mockDataWithUrl);
    });

    it('should maintain certificateUrl value after setting in ngOnInit', () => {
      const testUrl = 'https://test.com/persistent-certificate.pdf';
      const testData = { certificateUrl: testUrl };
      component = new CertificateViewPopupComponent(mockDialogRef, testData);

      component.ngOnInit();

      expect(component.certificateUrl).toBe(testUrl);
      
      // Verify it persists
      expect(component.certificateUrl).toBe(testUrl);
    });
  });

  describe('Integration Tests', () => {
    it('should complete full lifecycle: constructor -> ngOnInit -> closePopup', () => {
      const testUrl = 'https://test.com/lifecycle-certificate.pdf';
      const testData = { certificateUrl: testUrl };
      component = new CertificateViewPopupComponent(mockDialogRef, testData);

      // Initial state
      expect(component.certificateUrl).toBe('');
      expect(component.data).toBe(testData);

      // After ngOnInit
      component.ngOnInit();
      expect(component.certificateUrl).toBe(testUrl);

      // After closePopup
      component.closePopup();
      expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('should handle edge case with falsy certificateUrl values', () => {
      const falsyValues = [false, 0, NaN, ''];
      
      falsyValues.forEach(value => {
        const testData = { certificateUrl: value };
        component = new CertificateViewPopupComponent(mockDialogRef, testData);
        
        component.ngOnInit();
        
        expect(component.certificateUrl).toBe('');
      });
    });

    it('should handle edge case with truthy non-string certificateUrl values', () => {
      const truthyNonStringValues = [123, true, [], {}];
      
      truthyNonStringValues.forEach(value => {
        const testData = { certificateUrl: value };
        component = new CertificateViewPopupComponent(mockDialogRef, testData);
        
        component.ngOnInit();
        
        expect(component.certificateUrl).toBe(value);
      });
    });
  });

  describe('Error Handling', () => {
    it('should not throw error when dialogRef is null', () => {
      expect(() => {
        component = new CertificateViewPopupComponent(null as any, mockDataWithUrl);
      }).not.toThrow();
    });

    it('should handle closePopup when dialogRef.close throws error', () => {
      const mockErrorDialogRef = {
        close: jest.fn().mockImplementation(() => {
          throw new Error('Dialog close error');
        })
      } as any;

      component = new CertificateViewPopupComponent(mockErrorDialogRef, mockDataWithUrl);

      expect(() => {
        component.closePopup();
      }).toThrow('Dialog close error');
    });

    it('should handle data with nested certificateUrl property', () => {
      const nestedData = {
        certificate: {
          certificateUrl: 'https://test.com/nested-certificate.pdf'
        },
        certificateUrl: 'https://test.com/direct-certificate.pdf'
      };

      component = new CertificateViewPopupComponent(mockDialogRef, nestedData);
      component.ngOnInit();

      // Should use the direct certificateUrl property
      expect(component.certificateUrl).toBe('https://test.com/direct-certificate.pdf');
    });
  });

  describe('Type Safety', () => {
    it('should handle data parameter with any type', () => {
      const anyTypeData: any = {
        certificateUrl: 'https://test.com/any-type-certificate.pdf',
        randomProperty: 'random value'
      };

      component = new CertificateViewPopupComponent(mockDialogRef, anyTypeData);
      component.ngOnInit();

      expect(component.certificateUrl).toBe('https://test.com/any-type-certificate.pdf');
    });

    it('should handle certificateUrl assignment with different types', () => {
      // String type
      const stringData = { certificateUrl: 'string-url' };
      component = new CertificateViewPopupComponent(mockDialogRef, stringData);
      component.ngOnInit();
      expect(component.certificateUrl).toBe('string-url');

      // Number type (edge case)
      const numberData = { certificateUrl: 12345 };
      component = new CertificateViewPopupComponent(mockDialogRef, numberData);
      component.ngOnInit();
      expect(component.certificateUrl).toBe(12345);
    });
  });
});
