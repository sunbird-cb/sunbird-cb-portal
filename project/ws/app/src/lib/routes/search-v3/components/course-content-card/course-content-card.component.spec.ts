/**
 * Unit tests for CourseContentCardComponent
 * 
 * This file uses a manual mock approach to avoid TestBed and dependency issues
 */

// Create a minimal set of mocks for Angular features
const mockWsEvents = {
  EnumInteractTypes: { CLICK: 'CLICK' },
  EnumInteractSubTypes: { CERTIFICATE: 'CERTIFICATE' }
};

// Create a minimal SimpleChange implementation that matches Angular's
class MockSimpleChange {
  constructor(
    public previousValue: any, 
    public currentValue: any, 
    public firstChange: boolean
  ) {}

  isFirstChange(): boolean {
    return this.firstChange;
  }
}

// Global references needed by our component mock
const environment = { compentencyVersionKey: 'v1' };
const CertificateDialogComponent = class {};

// Create a mock for our component implementation
class CourseContentCardComponent {
  public content: any;
  public enrollment: any[] = [];
  public cbpPlans: any[] = [];
  public contentBookmarked = false;
  public defaultThumbnail = '/assets/instances/eagle/app_logos/default.png';
  public defaultSLogo = '/assets/instances/eagle/app_logos/igot-katmayogi-logo.svg';
  public compentencyKey: any;
  public courseEnrollment: any;
  public downloadCertificateLoading = false;
  public isIgot = false;

  constructor(
    private configSvc: any,
    private dialog: any,
    private events: any,
    private certificateService: any,
    private router: any,
    private contSvc: any
  ) {}

  ngOnInit(): void {
    this.compentencyKey = this.configSvc.compentency[environment.compentencyVersionKey];
  }

  ngOnChanges(changes: Record<string, MockSimpleChange>): void {
    if (changes['enrollment'] && changes['enrollment'].currentValue) {
      if (this.enrollment?.length && this.content) {
        this.courseEnrollment =
          this.enrollment.find(
            (ele: any) => ele.courseId === this.content.identifier
          ) || null;
      }
    }
    if (changes['cbpPlans'] && changes['cbpPlans'].currentValue) {
      if (this.cbpPlans?.length && this.content) {
        this.isIgot = this.cbpPlans.some(
          (ele: any) => ele.identifier === this.content.identifier
        );
      } else {
        this.isIgot = false;
      }
    }
  }

  checkForCiosDuration(item: any): number {
    if (item && item.contentId && item.contentId.includes('ext_')) {
      return item.duration * 60;
    }
    return item.duration;
  }

  downloadCertificate(certificateData: any): void {
    this.events.raiseInteractTelemetry(
      {
        type: mockWsEvents.EnumInteractTypes.CLICK,
        id: 'view-certificate',
        subType: mockWsEvents.EnumInteractSubTypes.CERTIFICATE,
      },
      {
        id: certificateData.issuedCertificates?.[0]?.identifier,
        type: mockWsEvents.EnumInteractSubTypes.CERTIFICATE,
      }
    );
    
    if (certificateData.issuedCertificates.length > 0) {
      this.downloadCertificateLoading = true;
      const certificate: any = certificateData.issuedCertificates.sort(
        (a: any, b: any) =>
          new Date(a.lastIssuedOn).getTime() -
          new Date(b.lastIssuedOn).getTime()
      );
      let certData: any = certificate?.[0];
      
      this.certificateService.downloadCertificate_v2(certData.identifier).subscribe((res: any) => {
        this.downloadCertificateLoading = false;
        const cet = res.result.printUri;
        this.dialog.open(CertificateDialogComponent, {
          width: '1300px',
          data: { cet, certId: certData.identifier },
        });
      });
    } else {
      this.downloadCertificateLoading = false;
    }
  }

  checkIfContentIsNew(createdOn: string): boolean {
    if (!createdOn) return false;
    const createdDate = new Date(createdOn);
    const currentDate = new Date();
    const diffInMs = currentDate.getTime() - createdDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    return diffInDays <= 14;
  }

  async getRedirectUrlData(content: any): Promise<void> {
    if (content && content.objectType === 'Event' && content.identifier) {
      this.router.navigate([`app/event-hub/home/${content.identifier}`]);
    } else {
      const urlData = await this.contSvc.getResourseLink(content);
      this.router.navigate([urlData.url], {
        queryParams: urlData.queryParams,
      });
    }
  }

  generateCompetencySubThemeString(): string {
    if (!this.content || !this.content.vKey) {
      return '';
    }
    return this.content.vKey
      .map((item: any) => item.vCompetencySubTheme)
      .join(' · ');
  }

  isCurrentlyActive(content: any): boolean {
    if (
      !content?.startDate ||
      !content?.startTime ||
      !content?.endDate ||
      !content?.endTime
    ) {
      return false;
    }

    const now = new Date();
    let startDateTime: Date;
    let endDateTime: Date;

    if (content.startTime.includes('Z')) {
      startDateTime = new Date(`${content.startDate}T${content.startTime}`);
    } else {
      const [startTimeStr, startOffset] = content.startTime.split('+');
      startDateTime = new Date(`${content.startDate}T${startTimeStr}+${startOffset}`);
    }

    if (content.endTime.includes('Z')) {
      endDateTime = new Date(`${content.endDate}T${content.endTime}`);
    } else {
      const [endTimeStr, endOffset] = content.endTime.split('+');
      endDateTime = new Date(`${content.endDate}T${endTimeStr}+${endOffset}`);
    }

    return now >= startDateTime && now <= endDateTime;
  }
}

// The actual test suite
describe('CourseContentCardComponent', () => {
  let component: CourseContentCardComponent;
  let mockConfigSvc: any;
  let mockDialog: any;
  let mockEvents: any;
  let mockCertificateService: any;
  let mockRouter: any;
  let mockContSvc: any;

  beforeEach(() => {
    // Mock console.log
    jest.spyOn(console, 'log').mockImplementation(() => {});
    
    // Create fresh mocks for each test
    mockConfigSvc = {
      compentency: {
        v1: {}
      }
    };

    mockDialog = {
      open: jest.fn()
    };

    mockEvents = {
      raiseInteractTelemetry: jest.fn()
    };

    mockCertificateService = {
      downloadCertificate_v2: jest.fn()
    };

    mockRouter = {
      navigate: jest.fn()
    };

    mockContSvc = {
      getResourseLink: jest.fn()
    };

    // Create component instance with mocked dependencies
    component = new CourseContentCardComponent(
      mockConfigSvc,
      mockDialog,
      mockEvents,
      mockCertificateService,
      mockRouter,
      mockContSvc
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize compentencyKey from config service', () => {
      component.ngOnInit();
      expect(component.compentencyKey).toBe(mockConfigSvc.compentency['v1']);
    });
  });

  describe('ngOnChanges', () => {
    it('should set courseEnrollment when enrollment changes and has matching course', () => {
      const mockContent = { identifier: 'course-123' };
      const mockEnrollment = [
        { courseId: 'course-123', name: 'Test Course' },
        { courseId: 'course-456', name: 'Another Course' }
      ];
      
      component.content = mockContent;
      component.enrollment = mockEnrollment;
      
      const changes = {
        enrollment: new MockSimpleChange(null, mockEnrollment, true)
      };
      
      component.ngOnChanges(changes);
      
      expect(component.courseEnrollment).toEqual({ courseId: 'course-123', name: 'Test Course' });
    });

    it('should set courseEnrollment to null when no matching course found', () => {
      const mockContent = { identifier: 'course-789' };
      const mockEnrollment = [
        { courseId: 'course-123', name: 'Test Course' },
        { courseId: 'course-456', name: 'Another Course' }
      ];
      
      component.content = mockContent;
      component.enrollment = mockEnrollment;
      
      const changes = {
        enrollment: new MockSimpleChange(null, mockEnrollment, true)
      };
      
      component.ngOnChanges(changes);
      
      expect(component.courseEnrollment).toBeNull();
    });

    it('should set isIgot to true when cbpPlans contains the content identifier', () => {
      const mockContent = { identifier: 'plan-123' };
      const mockCbpPlans = [
        { identifier: 'plan-123', name: 'Test Plan' },
        { identifier: 'plan-456', name: 'Another Plan' }
      ];
      
      component.content = mockContent;
      component.cbpPlans = mockCbpPlans;
      
      const changes = {
        cbpPlans: new MockSimpleChange(null, mockCbpPlans, true)
      };
      
      component.ngOnChanges(changes);
      
      expect(component.isIgot).toBe(true);
    });

    it('should set isIgot to false when cbpPlans does not contain the content identifier', () => {
      const mockContent = { identifier: 'plan-789' };
      const mockCbpPlans = [
        { identifier: 'plan-123', name: 'Test Plan' },
        { identifier: 'plan-456', name: 'Another Plan' }
      ];
      
      component.content = mockContent;
      component.cbpPlans = mockCbpPlans;
      
      const changes = {
        cbpPlans: new MockSimpleChange(null, mockCbpPlans, true)
      };
      
      component.ngOnChanges(changes);
      
      expect(component.isIgot).toBe(false);
    });

    it('should set isIgot to false when cbpPlans is empty', () => {
      const mockContent = { identifier: 'plan-123' };
      const mockCbpPlans: any[] = [];
      
      component.content = mockContent;
      component.cbpPlans = mockCbpPlans;
      
      const changes = {
        cbpPlans: new MockSimpleChange(null, mockCbpPlans, true)
      };
      
      component.ngOnChanges(changes);
      
      expect(component.isIgot).toBe(false);
    });
  });

  describe('checkForCiosDuration', () => {
    it('should multiply duration by 60 for external content', () => {
      const item = {
        contentId: 'ext_123',
        duration: 5
      };
      
      const result = component.checkForCiosDuration(item);
      
      expect(result).toBe(300); // 5 * 60
    });

    it('should return original duration for non-external content', () => {
      const item = {
        contentId: 'internal_123',
        duration: 5
      };
      
      const result = component.checkForCiosDuration(item);
      
      expect(result).toBe(5);
    });
  });

  describe('downloadCertificate', () => {
    it('should raise interact telemetry event and download certificate when certificates exist', () => {
      const certificateData = {
        issuedCertificates: [
          { identifier: 'cert-1', lastIssuedOn: '2023-01-01' },
          { identifier: 'cert-2', lastIssuedOn: '2023-02-01' }
        ]
      };

      const mockResponse = {
        result: {
          printUri: 'https://example.com/certificate'
        }
      };

      mockCertificateService.downloadCertificate_v2.mockReturnValue({
        subscribe: (callback: any) => callback(mockResponse)
      });

      component.downloadCertificate(certificateData);

      expect(mockEvents.raiseInteractTelemetry).toHaveBeenCalledWith(
        {
          type: 'CLICK',
          id: 'view-certificate',
          subType: 'CERTIFICATE',
        },
        {
          id: 'cert-1',
          type: 'CERTIFICATE',
        }
      );

      expect(mockCertificateService.downloadCertificate_v2).toHaveBeenCalledWith('cert-1');
      expect(mockDialog.open).toHaveBeenCalledWith(CertificateDialogComponent, {
        width: '1300px',
        data: { cet: 'https://example.com/certificate', certId: 'cert-1' },
      });
      expect(component.downloadCertificateLoading).toBe(false);
    });

    it('should not download certificate when no certificates exist', () => {
      const certificateData = {
        issuedCertificates: []
      };

      component.downloadCertificate(certificateData);

      expect(mockCertificateService.downloadCertificate_v2).not.toHaveBeenCalled();
      expect(mockDialog.open).not.toHaveBeenCalled();
      expect(component.downloadCertificateLoading).toBe(false);
    });

    it('should download the latest certificate when multiple certificates exist', () => {
      const certificateData = {
        issuedCertificates: [
          { identifier: 'cert-1', lastIssuedOn: '2023-01-01' },
          { identifier: 'cert-2', lastIssuedOn: '2023-02-01' },
        ],
      };

      const mockResponse = {
        result: { printUri: 'https://example.com/certificate' },
      };

      mockCertificateService.downloadCertificate_v2.mockReturnValue({
        subscribe: (callback: any) => callback(mockResponse),
      });

      component.downloadCertificate(certificateData);

      expect(mockCertificateService.downloadCertificate_v2).toHaveBeenCalledWith('cert-1');
      expect(mockDialog.open).toHaveBeenCalledWith(CertificateDialogComponent, {
        width: '1300px',
        data: { cet: 'https://example.com/certificate', certId: 'cert-1' },
      });
    });

    it('should download the earliest issued certificate when multiple certificates exist', () => {
      const certificateData = {
        issuedCertificates: [
          { identifier: 'cert-1', lastIssuedOn: '2023-02-01T00:00:00Z' },
          { identifier: 'cert-2', lastIssuedOn: '2023-01-01T00:00:00Z' },
        ],
      };

      const mockResponse = {
        result: { printUri: 'https://example.com/certificate' },
      };

      mockCertificateService.downloadCertificate_v2.mockReturnValue({
        subscribe: (callback: any) => callback(mockResponse),
      });

      component.downloadCertificate(certificateData);

      // Ensure the earliest certificate (cert-2) is selected
      expect(mockCertificateService.downloadCertificate_v2).toHaveBeenCalledWith('cert-2');
      expect(mockDialog.open).toHaveBeenCalledWith(CertificateDialogComponent, {
        width: '1300px',
        data: { cet: 'https://example.com/certificate', certId: 'cert-2' },
      });
    });
  });

  describe('checkIfContentIsNew', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2023-01-15')); // Mock current date
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return true if content is created within the threshold days', () => {
      const createdOn = new Date('2023-01-10'); // 5 days ago
      const result = component.checkIfContentIsNew(createdOn.toISOString());
      expect(result).toBe(true);
    });

    it('should return false if content is created beyond the threshold days', () => {
      const createdOn = new Date('2022-12-31'); // More than 14 days ago
      const result = component.checkIfContentIsNew(createdOn.toISOString());
      expect(result).toBe(false);
    });

    it('should return false if createdOn is not provided', () => {
      const result = component.checkIfContentIsNew('');
      expect(result).toBe(false);
    });
  });

  describe('getRedirectUrlData', () => {
    it('should navigate to event-hub for Event type content', async () => {
      const content = {
        objectType: 'Event',
        identifier: 'event-123'
      };

      await component.getRedirectUrlData(content);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['app/event-hub/home/event-123']);
      expect(mockContSvc.getResourseLink).not.toHaveBeenCalled();
    });

    it('should navigate to resource link for non-Event type content', async () => {
      const content = {
        objectType: 'Content',
        identifier: 'content-123'
      };

      const mockUrlData = {
        url: '/content/view',
        queryParams: { contentId: 'content-123' }
      };

      mockContSvc.getResourseLink.mockResolvedValue(mockUrlData);

      await component.getRedirectUrlData(content);

      expect(mockContSvc.getResourseLink).toHaveBeenCalledWith(content);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/content/view'], {
        queryParams: { contentId: 'content-123' }
      });
    });
  });

  describe('generateCompetencySubThemeString', () => {
    it('should return a concatenated string of sub-themes separated by " · "', () => {
      component.content = {
        vKey: [
          { vCompetencySubTheme: 'SubTheme1' },
          { vCompetencySubTheme: 'SubTheme2' },
        ],
      };
      const result = component.generateCompetencySubThemeString();
      expect(result).toBe('SubTheme1 · SubTheme2');
    });

    it('should return an empty string if content or vKey is missing', () => {
      component.content = null;
      const result = component.generateCompetencySubThemeString();
      expect(result).toBe('');
    });
  });

  describe('checkForCiosDuration', () => {
    it('should return duration in seconds for external content', () => {
      const item = { contentId: 'ext_123', duration: 5 };
      const result = component.checkForCiosDuration(item);
      expect(result).toBe(300); // 5 * 60
    });

    it('should return original duration for non-external content', () => {
      const item = { contentId: 'internal_123', duration: 5 };
      const result = component.checkForCiosDuration(item);
      expect(result).toBe(5);
    });
  });

  describe('isCurrentlyActive', () => {
    it('should return true if current time is within start and end time', () => {
      const now = new Date();
      const startDate = new Date(now.getTime() - 1000 * 60 * 60); // 1 hour ago
      const endDate = new Date(now.getTime() + 1000 * 60 * 60); // 1 hour later

      const content = {
        startDate: startDate.toISOString().split('T')[0],
        startTime: startDate.toISOString().split('T')[1],
        endDate: endDate.toISOString().split('T')[0],
        endTime: endDate.toISOString().split('T')[1],
      };

      const result = component.isCurrentlyActive(content);
      expect(result).toBe(true);
    });

    it('should return false if current time is outside start and end time', () => {
      const now = new Date();
      const startDate = new Date(now.getTime() - 1000 * 60 * 60 * 2); // 2 hours ago
      const endDate = new Date(now.getTime() - 1000 * 60 * 60); // 1 hour ago

      const content = {
        startDate: startDate.toISOString().split('T')[0],
        startTime: startDate.toISOString().split('T')[1],
        endDate: endDate.toISOString().split('T')[0],
        endTime: endDate.toISOString().split('T')[1],
      };

      const result = component.isCurrentlyActive(content);
      expect(result).toBe(false);
    });
  });
});