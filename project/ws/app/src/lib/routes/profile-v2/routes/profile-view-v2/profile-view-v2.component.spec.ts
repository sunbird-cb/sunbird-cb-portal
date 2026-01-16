import { ProfileViewV2Component } from './profile-view-v2.component';

// Mock all dependencies
const mockDialog = {
  open: jest.fn().mockReturnValue({
    afterClosed: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
    componentInstance: { enableWithdraw: { subscribe: jest.fn() }, enableMakeTransfer: { subscribe: jest.fn() } }
  })
};

const mockActivatedRoute = {
  data: { subscribe: jest.fn() },
  parent: { snapshot: { data: { pageData: { data: {} } } } }
};

const mockProfileV2RevampService = {
  getGroups: jest.fn().mockReturnValue({ pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) }),
  getDesignations: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
  fetchProfile: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
  updateBannerPic: jest.fn().mockReturnValue({ pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) }),
  updateProfileDetails: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
  fetchApprovalDetails: jest.fn().mockReturnValue({ pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) }),
  addEntriesToProfile: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
  updateEntriesOfProfile: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
  fetchProfileEntries: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
  connectToNetwork: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
  getInsightsData: jest.fn().mockReturnValue({ pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) }),
  updateDegree: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
  updateInstitution: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
  handleTranslateTo: jest.fn().mockReturnValue('Translated Text')
};

const mockSnackBar = {
  open: jest.fn()
};

const mockPipeImgUrl = {
  transform: jest.fn().mockReturnValue('transformed-url')
};

const mockConfigSvc = {
  userProfile: { userId: 'test-user-id', departmentName: 'Test Department' },
  userRoles: new Set(['mentor'])
};

const mockBreakpointObserver = {
  observe: jest.fn().mockReturnValue({ subscribe: jest.fn() })
};

const mockTranslateService = {
  setDefaultLang: jest.fn(),
  use: jest.fn()
};

describe('ProfileViewV2Component', () => {
  let component: ProfileViewV2Component;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });

    // Mock sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });

    // Mock document methods
    Object.defineProperty(document, 'getElementById', {
      value: jest.fn().mockReturnValue({
        scrollIntoView: jest.fn()
      }),
      writable: true
    });

    Object.defineProperty(document.documentElement.style, 'setProperty', {
      value: jest.fn(),
      writable: true
    });

    // Mock window methods
    Object.defineProperty(window, 'open', {
      value: jest.fn(),
      writable: true
    });

    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn().mockResolvedValue(undefined)
      },
      writable: true
    });

    // Create component instance
    component = new ProfileViewV2Component(
      mockDialog as any,
      mockActivatedRoute as any,
      mockProfileV2RevampService as any,
      mockSnackBar as any,
      mockPipeImgUrl as any,
      mockConfigSvc as any,
      mockBreakpointObserver as any,
      mockTranslateService as any
    );
  });

  describe('Component Initialization', () => {
    it('should create component', () => {
      expect(component).toBeDefined();
    });

    it('should initialize with default values', () => {
      expect(component.isCurrentUser).toBe(false);
      expect(component.userId).toBe('');
      expect(component.profileCompletion).toBe(0);
      expect(component.activeRoutId).toBe('about-me');
      expect(component.connectionStatus).toBe('Connect');
      expect(component.userStats).toHaveLength(3);
      expect(component.profileRoutes).toHaveLength(5);
    });

    it('should call initialization methods on ngOnInit', () => {
      const getProfileDetailsSpy = jest.spyOn(component, 'getProfileDetailsFromRoutes').mockImplementation();
      const getSendApprovalSpy = jest.spyOn(component, 'getSendApprovalStatus').mockImplementation();
      const getRejectedSpy = jest.spyOn(component, 'getRejectedStatus').mockImplementation();
      const getGroupDataSpy = jest.spyOn(component, 'getGroupData').mockImplementation();
      const loadDesignationsSpy = jest.spyOn(component, 'loadDesignations').mockImplementation();
      const checkIsMentorSpy = jest.spyOn(component, 'checkIsMentor').mockImplementation();
      const getInsightsDataSpy = jest.spyOn(component, 'getInsightsData').mockImplementation();

      component.ngOnInit();

      expect(getProfileDetailsSpy).toHaveBeenCalled();
      expect(getSendApprovalSpy).toHaveBeenCalled();
      expect(getRejectedSpy).toHaveBeenCalled();
      expect(getGroupDataSpy).toHaveBeenCalled();
      expect(loadDesignationsSpy).toHaveBeenCalled();
      expect(checkIsMentorSpy).toHaveBeenCalled();
      expect(getInsightsDataSpy).toHaveBeenCalled();
    });

    it('should set default language if websiteLanguage exists in localStorage', () => {
      (window.localStorage.getItem as jest.Mock).mockReturnValue('fr');
      
      component.ngOnInit();

      expect(mockTranslateService.setDefaultLang).toHaveBeenCalledWith('en');
      expect(mockTranslateService.use).toHaveBeenCalledWith('fr');
    });
  });

  describe('Profile Details', () => {
    it('should patch profile details correctly', () => {
      component.profesionalDetails = {
        profileImageUrl: 'test-image.jpg',
        profileBannerUrl: 'test-banner.jpg',
        personalDetails: { firstname: 'John Doe' },
        employmentDetails: { aboutme: 'Test about me' }
      };
      component.profileData = { firstname: 'John' };

      const getInitialsSpy = jest.spyOn(component, 'getInitials').mockImplementation();
      const setProfileCompletionSpy = jest.spyOn(component, 'setProfileCompletionGraph').mockImplementation();

      component.patchProfileDetails();

      expect(component.profileImageUrl).toBe('test-image.jpg');
      expect(component.profileBannerUrl).toBe('test-banner.jpg');
      expect(component.aboutme).toBe('Test about me');
      expect(getInitialsSpy).toHaveBeenCalled();
      expect(setProfileCompletionSpy).toHaveBeenCalled();
    });

    it('should generate initials correctly for single name', () => {
      component.profesionalDetails = {
        personalDetails: { firstname: 'John' }
      };

      component.getInitials();

      expect(component.nameInitials).toBe('J');
    });

    it('should generate initials correctly for multiple names', () => {
      component.profesionalDetails = {
        personalDetails: { firstname: 'John Doe' }
      };

      component.getInitials();

      expect(component.nameInitials).toBe('JD');
    });

    it('should set profile completion graph', () => {
      component.profileCompletion = 75;
      
      component.setProfileCompletionGraph();

      expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--i', '61.75');
    });
  });

  describe('User Stats', () => {
    it('should set user stats correctly', () => {
      component.profileData = {
        karmaPoints: 100,
        certificateCount: 5,
        postCount: 10
      };

      component.setUserStats();

      expect(component.userStats[0].totalPoints).toBe(100);
      expect(component.userStats[1].totalPoints).toBe(5);
      expect(component.userStats[2].totalPoints).toBe(10);
    });
  });

  describe('Route Selection', () => {
    it('should select route and scroll to element', () => {
      const mockElement = { scrollIntoView: jest.fn() };
      (document.getElementById as jest.Mock).mockReturnValue(mockElement);

      component.selectRoute('about-me');

      expect(document.getElementById).toHaveBeenCalledWith('about-me');
      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start'
      });
      expect(component.activeRoutId).toBe('about-me');
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('lastProfileSection', 'about-me');
    });
  });

  describe('Dialog Operations', () => {
    it('should open cover photo dialog', () => {
      component.profileBannerUrl = 'test-banner.jpg';
      component.isMobile = false;

      component.openCoverPhotoDialog();

      expect(mockDialog.open).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          width: '500px',
          maxWidth: '500px',
          height: 'auto',
          panelClass: 'cover-photo-edit-popup',
          data: { coverPhotoUrl: 'test-banner.jpg' },
          disableClose: true,
          autoFocus: false
        })
      );
    });

    it('should open profile edit dialog', () => {
      component.primaryDetails = { firstname: 'John' };
      component.locationDetails = { state: 'Test State' };

      component.openProfileEditDialog('Profile');

      expect(mockDialog.open).toHaveBeenCalled();
    });
  });

  describe('Profile Entry Operations', () => {
    it('should generate service history form body', () => {
      const serviceHistory = { title: 'Test Job', company: 'Test Company', showMore: true };
      const oldDetails = { uuid: 'test-uuid' };
      component.userId = 'test-user';

      const result = component.generateServiceHistoryFormBody(serviceHistory, oldDetails);

      expect(result.request.userId).toBe('test-user');
      expect(result.request.serviceHistory[0].uuid).toBe('test-uuid');
      expect(result.request.serviceHistory[0].showMore).toBeUndefined();
    });

    it('should generate achievements form body', () => {
      const achievements = { title: 'Test Achievement', year: '2023' };
      const oldDetails = { uuid: 'test-uuid' };
      component.userId = 'test-user';

      const result = component.generateAchievementsFormBody(achievements, oldDetails);

      expect(result.request.userId).toBe('test-user');
      expect(result.request.achievements[0].uuid).toBe('test-uuid');
      expect(result.request.achievements[0].title).toBe('Test Achievement');
    });
  });

  describe('API Calls', () => {
    it('should fetch profile details', () => {
      const mockResponse = {
        result: {
          profiledetails: { personalDetails: { firstname: 'John' } },
          profileCompletion: 80
        }
      };
      mockProfileV2RevampService.fetchProfile.mockReturnValue({
        subscribe: jest.fn().mockImplementation(({ next }) => next(mockResponse))
      });

      const patchSpy = jest.spyOn(component, 'patchProfileDetails').mockImplementation();
      component.userId = 'test-user';

      component.fetchProfileDetails();

      expect(mockProfileV2RevampService.fetchProfile).toHaveBeenCalledWith('test-user');
      expect(patchSpy).toHaveBeenCalled();
    });

    it('should handle API error in fetchProfile', () => {
      const mockError = { ok: false };
      mockProfileV2RevampService.fetchProfile.mockReturnValue({
        subscribe: jest.fn().mockImplementation(({ error }) => error(mockError))
      });

      const openSnackbarSpy = jest.spyOn(component, 'openSnackbar' as any).mockImplementation();

      component.fetchProfileDetails();

      expect(openSnackbarSpy).toHaveBeenCalledWith('Something went wrong please try again');
    });

    it('should get groups data', () => {
      const mockResponse = { result: { response: ['Group1', 'Group2', 'Others'] } };
      mockProfileV2RevampService.getGroups.mockReturnValue({
        pipe: jest.fn().mockReturnValue({
          subscribe: jest.fn().mockImplementation((callback) => callback(mockResponse))
        })
      });

      component.getGroupData();

      expect(component.groupsList).toEqual(['Group1', 'Group2']);
    });

    it('should load designations', () => {
      const mockData = { responseData: ['Designation1', 'Designation2'] };
      mockProfileV2RevampService.getDesignations.mockReturnValue({
        subscribe: jest.fn().mockImplementation((callback) => callback(mockData))
      });

      component.loadDesignations();

      expect(component.designationsList).toEqual(['Designation1', 'Designation2']);
    });
  });

  describe('Connection Operations', () => {
    it('should send connection request', () => {
      component.userId = 'target-user';
      component.primaryDetails = { departmentName: 'Target Department' };
      mockProfileV2RevampService.connectToNetwork.mockReturnValue({
        subscribe: jest.fn().mockImplementation(({ next }) => next({}))
      });

      const openSnackbarSpy = jest.spyOn(component, 'openSnackbar' as any).mockImplementation();

      component.sendConnectionRequest();

      expect(mockProfileV2RevampService.connectToNetwork).toHaveBeenCalledWith({
        connectionId: 'target-user',
        userIdFrom: 'test-user-id',
        userNameFrom: 'test-user-id',
        userDepartmentFrom: 'Test Department',
        userIdTo: 'target-user',
        userNameTo: 'target-user',
        userDepartmentTo: 'Target Department'
      });
      expect(component.connectionStatus).toBe('Pending');
      expect(openSnackbarSpy).toHaveBeenCalledWith('Connection request sent successfully');
    });

    it('should handle connection request error', () => {
      component.userId = 'target-user';
      mockProfileV2RevampService.connectToNetwork.mockReturnValue({
        subscribe: jest.fn().mockImplementation(({ error }) => error({}))
      });

      const openSnackbarSpy = jest.spyOn(component, 'openSnackbar' as any).mockImplementation();

      component.sendConnectionRequest();

      expect(openSnackbarSpy).toHaveBeenCalledWith('Something went wrong while sending connection request');
    });

    it('should block profile', () => {
      component.blockProfile();
      expect(component.connectionStatus).toBe('Unblock');
    });
  });

  describe('Utility Functions', () => {
    it('should copy profile link', async () => {
      Object.defineProperty(window, 'location', {
        value: { href: 'http://test.com/profile' },
        writable: true
      });

      const openSnackbarSpy = jest.spyOn(component, 'openSnackbar' as any).mockImplementation();

      await component.copyProfileLink();

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://test.com/profile');
      expect(openSnackbarSpy).toHaveBeenCalledWith('Profile link copied to clipboard');
    });

    it('should handle copy profile link error', async () => {
      (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(new Error('Copy failed'));
      const openSnackbarSpy = jest.spyOn(component, 'openSnackbar' as any).mockImplementation();

      await component.copyProfileLink();

      expect(openSnackbarSpy).toHaveBeenCalledWith('Failed to copy profile link');
    });

    it('should check if user is mentor', () => {
      component.checkIsMentor();
      expect(component.isMentor).toBe(true);
    });

    it('should handle translate to', () => {
      const result = component.handleTranslateTo('test-key');
      expect(mockProfileV2RevampService.handleTranslateTo).toHaveBeenCalledWith('test-key');
      expect(result).toBe('Translated Text');
    });

    it('should view mentor profile', () => {
      component.viewMentorProfile();
      expect(window.open).toHaveBeenCalledWith(expect.stringContaining('/mentorship'), '_blank');
    });
  });

  describe('Approval Status', () => {
    it('should get send approval status', () => {
      const mockResponse = {
        result: {
          data: [
            { name: 'Test Org', group: 'Test Group', lastUpdatedOn: 123456 }
          ]
        }
      };
      mockProfileV2RevampService.fetchApprovalDetails.mockReturnValue({
        pipe: jest.fn().mockReturnValue({
          subscribe: jest.fn().mockImplementation((callback) => callback(mockResponse))
        })
      });

      component.getSendApprovalStatus();

      expect(component.unVerifiedObj.organization).toBe('Test Org');
      expect(component.unVerifiedObj.group).toBe('Test Group');
      expect(component.enableWTR).toBe(true);
    });

    it('should get rejected status', () => {
      const mockResponse = {
        result: {
          data: [
            { 
              name: 'Rejected Org', 
              group: 'Rejected Group', 
              comment: 'Rejection comment',
              lastUpdatedOn: 789012 
            }
          ]
        }
      };
      mockProfileV2RevampService.fetchApprovalDetails.mockReturnValue({
        pipe: jest.fn().mockReturnValue({
          subscribe: jest.fn().mockImplementation((callback) => callback(mockResponse))
        })
      });

      component.getRejectedStatus();

      expect(component.rejectedFields.name).toBe('Rejected Org');
      expect(component.rejectedFields.group).toBe('Rejected Group');
      expect(component.rejectedFields.groupRejectionComments).toBe('Rejection comment');
    });
  });

  describe('Insights Data', () => {
    it('should get insights data', () => {
      const mockResponse = {
        result: {
          response: {
            nudges: [
              { label: 'Test Nudge', growth: 'positive', progress: 15 }
            ],
            'weekly-claps': 50
          }
        }
      };
      mockProfileV2RevampService.getInsightsData.mockReturnValue({
        pipe: jest.fn().mockReturnValue({
          subscribe: jest.fn().mockImplementation((callback) => callback(mockResponse))
        })
      });

      const constructNudgeSpy = jest.spyOn(component, 'constructNudgeData').mockImplementation();
      component.orgId = 'test-org';

      component.getInsightsData();

      expect(component.insightsData).toBe(mockResponse.result.response);
      expect(constructNudgeSpy).toHaveBeenCalled();
      expect(component.insightsData.weeklyClaps).toBe(50);
    });

    it('should construct nudge data', () => {
      component.insightsData = {
        nudges: [
          { label: 'Test Nudge', growth: 'positive', progress: 15 },
          { label: 'Test Nudge 2', growth: 'negative', progress: -5 }
        ]
      };

      component.constructNudgeData();

      expect(component.insightsData.sliderData).toBeDefined();
      expect(component.insightsData.sliderData.sliderData).toHaveLength(2);
      expect(component.insightsData.sliderData.sliderData[0].title).toBe('Test Nudge');
      expect(component.insightsData.sliderData.sliderData[0].data).toBe('+15%');
      expect(component.insightsDataLoading).toBe(false);
    });
  });

  describe('Transfer Requests', () => {
    it('should handle transfer request', () => {
      component.profesionalDetails = { profileDetails: { name: 'Test' } };
      component.groupsList = ['Group1'];
      component.designationsList = ['Designation1'];

      component.handleTransferRequest();

      expect(mockDialog.open).toHaveBeenCalled();
    });

    it('should handle withdraw transfer request', () => {
      component.approvalPendingFields = [{ name: 'Test' }];

      component.handleWithdrawTransferRequest();

      expect(mockDialog.open).toHaveBeenCalled();
    });
  });

  describe('Entry Filtering', () => {
    it('should filter profile routes', () => {
      const initialRoutesLength = component.profileRoutes.length;
      
      component.filterProfileRoutes('about-me');

      expect(component.profileRoutes.length).toBe(initialRoutesLength - 1);
      expect(component.profileRoutes.find(route => route.id === 'about-me')).toBeUndefined();
    });

    it('should patch entries and filter empty sections for non-current user', () => {
      component.isCurrentUser = false;
      const filterSpy = jest.spyOn(component, 'filterProfileRoutes').mockImplementation();

      const entries = {
        serviceHistory: { data: [], count: 0 },
        educationalQualifications: { data: [], count: 0 },
        achievements: { data: [], count: 0 },
        locationDetails: { data: [{ state: 'Test State' }] }
      };

      component.patchEntries(entries);

      expect(filterSpy).toHaveBeenCalledWith('service-history');
      expect(filterSpy).toHaveBeenCalledWith('educational-qualifications');
      expect(filterSpy).toHaveBeenCalledWith('achievements');
      expect(component.locationDetails.state).toBe('Test State');
    });
  });

  describe('Component Lifecycle', () => {
    it('should set selectedTabIndex on ngAfterViewInit', () => {
      component.ngAfterViewInit();
      expect(component.selectedTabIndex).toBe(0);
    });

    it('should unsubscribe on destroy', () => {
      const unsubscribeSpy = jest.spyOn(component['destroySubject$'], 'unsubscribe');
      
      component.ngOnDestroy();
      
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });

  describe('Educational Qualifications', () => {
    it('should generate educational qualifications form body with other degree', async () => {
      const educationalQualifications = {
        degree: 'other',
        otherDegree: 'Custom Degree',
        institutionName: 'Test Institute',
        fieldOfStudy: 'Computer Science',
        startYear: '2020',
        endYear: '2024'
      };
      const oldDetails = { uuid: 'test-uuid' };
      component.userId = 'test-user';

      mockProfileV2RevampService.updateDegree.mockReturnValue({ toPromise: () => Promise.resolve() });

      const result = await component.generateEducationalQualificationsFormBody(educationalQualifications, oldDetails);

      expect(result.request.educationalQualifications[0].degree).toBe('Custom Degree');
      expect(result.request.educationalQualifications[0].uuid).toBe('test-uuid');
      expect(mockProfileV2RevampService.updateDegree).toHaveBeenCalledWith({
        degreeName: 'Custom Degree'
      });
    });

    it('should generate educational qualifications form body with other institute', async () => {
      const educationalQualifications = {
        degree: 'Bachelor',
        institutionName: 'other',
        otherInstituteName: 'Custom Institute',
        fieldOfStudy: 'Engineering',
        startYear: '2020',
        endYear: '2024'
      };
      component.userId = 'test-user';

      mockProfileV2RevampService.updateInstitution.mockReturnValue({ toPromise: () => Promise.resolve() });

      const result = await component.generateEducationalQualificationsFormBody(educationalQualifications, {});

      expect(result.request.educationalQualifications[0].institutionName).toBe('Custom Institute');
      expect(mockProfileV2RevampService.updateInstitution).toHaveBeenCalledWith({
        institutionName: 'Custom Institute'
      });
    });
  });

  describe('Profile Entry List Dialogs', () => {
    it('should open service history list dialog', () => {
      component.userId = 'test-user';
      component.isCurrentUser = true;
      
      component.openProfileEntryListDialog('Service History');

      expect(mockDialog.open).toHaveBeenCalled();
    });

    it('should open educational qualifications list dialog', () => {
      component.userId = 'test-user';
      component.isCurrentUser = true;
      
      component.openProfileEntryListDialog('Educational qualifications');

      expect(mockDialog.open).toHaveBeenCalled();
    });

    it('should open achievements list dialog', () => {
      component.userId = 'test-user';
      component.isCurrentUser = true;
      
      component.openProfileEntryListDialog('Achievements');

      expect(mockDialog.open).toHaveBeenCalled();
    });
  });

  describe('Form Body Generation', () => {
    it('should generate basic profile form body with changes', () => {
      component.userId = 'test-user';
      component.primaryDetails = {
        firstname: 'Old Name',
        primaryEmail: 'old@email.com',
        group: 'Old Group'
      };

      const result = {
        firstname: 'New Name',
        primaryEmail: 'new@email.com',
        group: 'New Group'
      };

      const updateSpy = jest.spyOn(component, 'updateProfileDetails').mockImplementation();

      component.generateBasicProfileFormBody(result, false);

      expect(updateSpy).toHaveBeenCalled();
    });
  });
});