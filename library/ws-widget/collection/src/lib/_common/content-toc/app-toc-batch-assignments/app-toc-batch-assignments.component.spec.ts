// app-toc-batch-assignments.component.spec.ts

// Mock all external modules BEFORE importing anything
jest.mock('@sunbird-cb/collection', () => ({
  NsContent: {
    EPrimaryCategory: {
      RESOURCE: 'Resource',
      MODULE: 'Module',
      COURSE: 'Course',
      PRACTICE_RESOURCE: 'PracticeResource',
      FINAL_ASSESSMENT: 'FinalAssessment',
      OFFLINE_SESSION: 'OfflineSession',
      BLENDED_PROGRAM: 'BlendedProgram',
      CURATED_PROGRAM: 'CuratedProgram',
      STANDALONE_ASSESSMENT: 'StandaloneAssessment'
    },
    EMimeTypes: {
      PDF: 'application/pdf',
      MP4: 'video/mp4',
      YOUTUBE: 'video/youtube',
      HTML: 'text/html',
      QUIZ: 'application/quiz'
    },
    EFilterCategory: {
      ALL: 'all',
      LEARN: 'learn',
      PRACTICE: 'practice',
      ASSESS: 'assess'
    },
    EContextLockingType: {
      COURSE_ASSESSMENT_ONLY: 'courseAssessmentOnly'
    },
    ECourseCategory: {
      COURSE: 'Course'
    }
  },
  NsContentConstants: {
    VALID_PRACTICE_RESOURCES: new Set(['practice']),
    VALID_ASSESSMENT_RESOURCES: new Set(['assessment'])
  },
  WidgetContentService: jest.fn().mockImplementation(() => ({
    fetchContent: jest.fn(),
    getFirstChildInHierarchy: jest.fn()
  }))
}));

jest.mock('@sunbird-cb/utils-v2', () => ({
  ConfigurationsService: jest.fn().mockImplementation(() => ({
    userProfile: {
      userId: 'test-user-id',
      userName: 'Test User',
      rootOrgId: 'test-org-id',
      departmentName: 'Test Department',
      country: 'India'
    },
    rootOrg: 'test-root-org',
    org: ['test-org']
  })),
  TFetchStatus: 'none'
}));

jest.mock('@sunbird-cb/consumption', () => ({
  ContentLanguageService: jest.fn().mockImplementation(() => ({
    getContentLanguage: jest.fn().mockReturnValue('en')
  }))
}));

jest.mock('lodash', () => ({
  get: jest.fn(),
  map: jest.fn(),
  each: jest.fn(),
  first: jest.fn(),
  filter: jest.fn(),
  toInteger: jest.fn(),
  defaults: jest.fn()
}));

// Mock the specific AppTocService path
jest.mock('../../../../../../../../project/ws/app/src/lib/routes/app-toc/services/app-toc.service', () => ({
  AppTocService: jest.fn().mockImplementation(() => ({
    searchAssignments: jest.fn(),
    getAssignmentStatus: jest.fn(),
    createContentV2: jest.fn(),
    readContentV2: jest.fn(),
    upload: jest.fn(),
    updateContentWithFewFields: jest.fn(),
    submitAssignment: jest.fn(),
    submitDraftAssignment: jest.fn(),
    analyticsReplaySubject: { next: jest.fn() },
    batchReplaySubject: { next: jest.fn() },
    resumeData: { next: jest.fn() }
  }))
}));

// Now import the required modules
import { of, throwError } from 'rxjs';
import { AppTocBatchAssignmentsComponent } from './app-toc-batch-assignments.component';

describe('AppTocBatchAssignmentsComponent', () => {
  let component: AppTocBatchAssignmentsComponent;
  let mockRouter: any;
  let mockSnackBar: any;
  let mockTocSvc: any;
  let mockConfigSvc: any;
  let mockDialog: any;
  let mockDialogLegacy: any;
  let mockRoute: any;

  beforeEach(() => {
    // Mock Router
    mockRouter = {
      navigate: jest.fn().mockReturnValue(Promise.resolve(true)),
      navigateByUrl: jest.fn().mockReturnValue(Promise.resolve(true))
    };

    // Mock MatLegacySnackBar
    mockSnackBar = {
      open: jest.fn().mockReturnValue({
        afterDismissed: jest.fn().mockReturnValue(of({}))
      })
    };

    // Mock AppTocService
    mockTocSvc = {
      searchAssignments: jest.fn().mockReturnValue(of({ result: { response: { content: [] } } })),
      getAssignmentStatus: jest.fn().mockReturnValue(of({ result: { response: { content: [] } } })),
      createContentV2: jest.fn().mockReturnValue(Promise.resolve('test-id')),
      readContentV2: jest.fn().mockReturnValue(Promise.resolve({ identifier: 'test-id' })),
      upload: jest.fn().mockReturnValue(of({ result: {} })),
      updateContentWithFewFields: jest.fn().mockReturnValue(of({ result: {} })),
      submitAssignment: jest.fn().mockReturnValue(of({ result: {} })),
      submitDraftAssignment: jest.fn().mockReturnValue(of({ result: {} }))
    };

    // Mock ConfigurationsService
    mockConfigSvc = {
      userProfile: {
        userId: 'test-user-id',
        userName: 'Test User',
        rootOrgId: 'test-org-id',
        departmentName: 'Test Department'
      }
    };

    // Mock MatDialog
    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({}))
      })
    };

    // Mock MatLegacyDialog
    mockDialogLegacy = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true))
      })
    };

    // Mock ActivatedRoute
    mockRoute = {
      snapshot: {
        queryParams: {
          batchId: 'test-batch-id'
        }
      }
    };

    // Create component instance
    component = new AppTocBatchAssignmentsComponent(
      mockRouter,
      mockSnackBar,
      mockTocSvc,
      mockConfigSvc,
      mockDialog,
      mockDialogLegacy,
      mockRoute
    );

    // Initialize component properties
    component.content = { identifier: 'test-content-id' };
    component.assignments = [];
    component.submissions = [];
    component.allowType = ['.pdf', '.doc', '.docx'];
    component.isLoading = false;
    component.batchId = 'test-batch-id';
    component.resourceFileAdded = null;
    component.selectedAssignment = null;
    component.fileExtention = '';
    component.openSnackbar = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create component instance', () => {
      expect(component).toBeDefined();
      expect(component.assignments).toEqual([]);
      expect(component.batchId).toBe('test-batch-id');
    });

    it('should initialize with default values', () => {
      expect(component.allowType).toEqual(['.pdf', '.doc', '.docx']);
      expect(component.isLoading).toBe(false);
      expect(component.submissions).toEqual([]);
    });
  });

  describe('fetchAssignments', () => {
    it('should fetch assignments successfully', () => {
      const mockResponse = {
        result: {
          response: {
            content: [
              { id: '1', title: 'Assignment 1', formId: 'form1' },
              { id: '2', title: 'Assignment 2', formId: 'form2' }
            ]
          }
        }
      };

      mockTocSvc.searchAssignments.mockReturnValue(of(mockResponse));
      const getUserAssignmentStatusSpy = jest.spyOn(component, 'getUserAssignmentStatus').mockImplementation(() => { });

      component.fetchAssignments();

      expect(mockTocSvc.searchAssignments).toHaveBeenCalledWith({
        query: '',
        filters: {
          "additionalProperties.batchId": 'test-batch-id'
        }
      });
      expect(getUserAssignmentStatusSpy).toHaveBeenCalled();
    });

    it('should handle fetch assignments error', () => {
      const error = new Error('API Error');
      mockTocSvc.searchAssignments.mockReturnValue(throwError(error));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

      component.fetchAssignments();

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching assignments', error);
      consoleSpy.mockRestore();
    });
  });

  describe('getUserAssignmentStatus', () => {
    it('should get assignment status successfully', () => {
      const mockResponse = {
        result: {
          response: {
            content: [
              { formId: 'form1', status: 'SUBMITTED' }
            ]
          }
        }
      };

      mockTocSvc.getAssignmentStatus.mockReturnValue(of(mockResponse));
      const processAssignmentsSpy = jest.spyOn(component, 'processAssignmentsWithStatus').mockImplementation(() => { });

      component.getUserAssignmentStatus();

      expect(mockTocSvc.getAssignmentStatus).toHaveBeenCalled();
      expect(processAssignmentsSpy).toHaveBeenCalled();
    });
  });

  describe('getMarks', () => {
    it('should return marks with maximum when both are available', () => {
      const submissionMeta = { marksGiven: 20, maximumMarks: 100 };
      const result = component.getMarks(submissionMeta);
      expect(result).toBe('20/100');
    });

    it('should return only marks when maximum is not available', () => {
      const submissionMeta = { marksGiven: 20 };
      const result = component.getMarks(submissionMeta);
      expect(result).toBe('20');
    });

    it('should return N/A when no marks are available', () => {
      const submissionMeta = {};
      const result = component.getMarks(submissionMeta);
      expect(result).toBe('N/A');
    });

    it('should handle null submissionMeta', () => {
      const result = component.getMarks(null);
      expect(result).toBe('N/A');
    });
  });

  describe('checkFileType', () => {
    it('should return false for files larger than 1024MB', () => {
      const largeFile = new File(['content'], 'large.pdf', { type: 'application/pdf' });
      Object.defineProperty(largeFile, 'size', { value: 1025 * 1024 * 1024 });

      const result = component.checkFileType(largeFile);
      expect(result).toBe(false);
    });

    it('should return true for valid PDF file', () => {
      const validFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      Object.defineProperty(validFile, 'size', { value: 1024 * 1024 });
      component.allowType = ['.pdf', '.doc', '.docx'];

      const result = component.checkFileType(validFile);
      expect(result).toBe(true);
      expect(component.fileExtention).toBe('.pdf');
    });
  });

  describe('getMimeType', () => {
    it('should return correct mime type for pdf', () => {
      component.fileExtention = '.pdf';
      expect(component.getMimeType()).toBe('application/pdf');
    });

    it('should return correct mime type for doc files', () => {
      component.fileExtention = '.doc';
      expect(component.getMimeType()).toBe('application/msword');

      component.fileExtention = '.docx';
      expect(component.getMimeType()).toBe('application/msword');
    });

    it('should return default mime type for unknown extensions', () => {
      component.fileExtention = '.unknown';
      expect(component.getMimeType()).toBe('application/octet-stream');
    });
  });

  describe('getRandomNumber', () => {
    it('should generate 16 digit random number', () => {
      const result = component.getRandomNumber();
      expect(result.length).toBe(16);
      expect(/^\d{16}$/.test(result)).toBe(true);
    });
  });

  describe('handleViewFeedback', () => {
    it('should expand assignment feedback', () => {
      const assignment = { expand: false };
      component.handleViewFeedback(assignment);
      expect(assignment.expand).toBe(true);
    });
  });

  describe('downloadFile', () => {
    it('should set downloading state', () => {
      const assignment = { downloading: false, enableDownload: false };
      const downloadSpy = jest.spyOn(component, 'downloadFileWithFetch').mockImplementation(() => Promise.resolve());

      component.downloadFile(assignment);

      expect(assignment.downloading).toBe(true);
      expect(assignment.enableDownload).toBe(true);
      expect(component.selectedAssignment).toBe(assignment);
      expect(downloadSpy).toHaveBeenCalledWith(assignment);
    });
  });

  describe('triggerFileUpload', () => {
    it('should call submitAssignment if answerURL exists', () => {
      const assignment = { answerURL: 'test-url' };
      const submitSpy = jest.spyOn(component, 'submitAssignment').mockImplementation(() => { });

      component.triggerFileUpload(assignment);

      expect(component.selectedAssignment).toBe(assignment);
      expect(submitSpy).toHaveBeenCalledWith(assignment);
    });

    it('should trigger file input click if no answerURL', () => {
      const assignment = { answerURL: '' };
      const mockFileInput = { click: jest.fn() };
      jest.spyOn(document, 'getElementById').mockReturnValue(mockFileInput as any);

      component.triggerFileUpload(assignment);

      expect(component.selectedAssignment).toBe(assignment);
      expect(mockFileInput.click).toHaveBeenCalled();
    });
  });

  describe('fileInputEmit', () => {
    it('should return early if no files', () => {
      const checkFileTypeSpy = jest.spyOn(component, 'checkFileType');

      component.fileInputEmit(null);
      component.fileInputEmit([] as any);

      expect(checkFileTypeSpy).not.toHaveBeenCalled();
    });

    it('should process file if valid', () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const mockFileList = [mockFile] as any;
      mockFileList.length = 1;

      const checkFileTypeSpy = jest.spyOn(component, 'checkFileType').mockReturnValue(true);
      const createResourceSpy = jest.spyOn(component, 'createResource').mockImplementation(() => Promise.resolve());
      component.selectedAssignment = { title: 'Test' };

      component.fileInputEmit(mockFileList);

      expect(checkFileTypeSpy).toHaveBeenCalledWith(mockFile);
      expect(createResourceSpy).toHaveBeenCalledWith(mockFile, component.selectedAssignment);
    });
  });
});