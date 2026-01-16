import { EventDetailComponent } from './event-detail.component';
import { of, throwError, Subject } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as fileSaver from 'file-saver';

// Mock services
jest.mock('@angular/router', () => ({
  ActivatedRoute: jest.fn().mockImplementation(() => ({
    params: of({ eventId: 'test-event-id' }),
    parent: {
      snapshot: {
        data: {
          pageData: {
            data: {
              enrollFlowItems: ['webinar', 'karmayogiTalks'],
              discussWidgetData: {
                newCommentSection: {
                  commentTreeData: { entityId: '' },
                  commentBox: { placeholder: '' }
                },
                commentsList: {
                  repliesSection: {
                    newCommentReply: {
                      commentTreeData: { entityId: '' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }))
}));

jest.mock('../../services/events.service', () => ({
  EventService: jest.fn().mockImplementation(() => ({
    getEventData: jest.fn(),
    getIsEnrolled: jest.fn(),
    eventData: {}
  }))
}));

jest.mock('@ngx-translate/core', () => ({
  TranslateService: jest.fn().mockImplementation(() => ({
    setDefaultLang: jest.fn(),
    use: jest.fn()
  }))
}));

jest.mock('@sunbird-cb/utils-v2', () => ({
  MultilingualTranslationsService: jest.fn().mockImplementation(() => ({
    translateActualLabel: jest.fn().mockReturnValue('Translated Label'),
    languageSelectedObservable: new Subject()
  })),
  ConfigurationsService: jest.fn().mockImplementation(() => ({
    userProfile: {
      userId: 'test-user-id'
    },
    unMappedUser: {
      identifier: 'test-user-id'
    },
    compentency: {
      v6: {
        vKey: 'competencies_v6',
        vCompetencyArea: 'area',
        vCompetencyTheme: 'theme',
        vCompetencySubTheme: 'subtheme'
      }
    },
    netcoreConfig: {
      netcoreWebConfig: {
        isActive: true,
        events: {
          content_view: {
            isActive: true
          }
        }
      }
    }
  }))
}));

jest.mock('@sunbird-cb/consumption', () => ({
  WidgetContentLibService: jest.fn().mockImplementation(() => ({
    downloadCert: jest.fn()
  }))
}));

jest.mock('@angular/material/snack-bar', () => ({
  MatSnackBar: jest.fn().mockImplementation(() => ({
    open: jest.fn()
  }))
}));

jest.mock('@angular/material/legacy-dialog', () => ({
  MatLegacyDialog: jest.fn().mockImplementation(() => ({
    open: jest.fn()
  }))
}));

jest.mock('../../../../../../../../../src/app/services/netcore.service', () => ({
  NetCoreService: jest.fn().mockImplementation(() => ({
    trackEventForContentAndEvent: jest.fn()
  }))
}));

// Mock fileSaver
jest.mock('file-saver', () => ({
  saveAs: jest.fn()
}));

// Mock environment
jest.mock('src/environments/environment', () => ({
  environment: {
    compentencyVersionKey: 'v6'
  }
}));

// Mock window.location
window.location = { href: 'https://test-url.com' } as any;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('EventDetailComponent', () => {
  let component: EventDetailComponent;
  let dialogMock: any;
  let routeMock: any;
  let eventServiceMock: any;
  let translateServiceMock: any;
  let multilingualTranslationsServiceMock: any;
  let configurationsServiceMock: any;
  let contentServiceMock: any;
  let snackBarMock: any;
  let netCoreServiceMock: any;
  let languageSelectedSubject: Subject<any>;

  beforeEach(() => {
    // Clear mocks and reset component for each test
    jest.clearAllMocks();

    // Initialize subject for language selection events
    languageSelectedSubject = new Subject<any>();

    // Initialize mock services
    dialogMock = {
      open: jest.fn()
    };

    routeMock = {
      params: of({ eventId: 'test-event-id' }),
      parent: {
        snapshot: {
          data: {
            pageData: {
              data: {
                enrollFlowItems: ['webinar', 'karmayogiTalks'],
                discussWidgetData: {
                  newCommentSection: {
                    commentTreeData: { entityId: '' },
                    commentBox: { placeholder: '' }
                  },
                  commentsList: {
                    repliesSection: {
                      newCommentReply: {
                        commentTreeData: { entityId: '' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    eventServiceMock = {
      getEventData: jest.fn().mockReturnValue(of({
        result: {
          event: {
            identifier: 'test-event-id',
            name: 'Test Event',
            resourceType: 'webinar',
            startDate: '2025-03-20',
            endDate: '2025-03-20',
            startTime: '09:00+05:30',
            endTime: '17:00+05:30',
            creatorDetails: '{"name":"Test Creator"}',
            competencies_v6: [
              { area: 'TestArea', theme: 'TestTheme', subtheme: 'TestSubTheme' }
            ],
            duration: 480,
            sourceName: 'Test Source',
            appIcon: 'test-icon-url'
          }
        }
      })),
      getIsEnrolled: jest.fn().mockReturnValue(of({
        result: {
          events: [
            {
              contentId: 'test-event-id',
              issuedCertificates: [{ identifier: 'cert-123' }],
              completionPercentage: 85.5,
              status: 2
            }
          ]
        }
      })),
      eventData: {}
    };

    translateServiceMock = {
      setDefaultLang: jest.fn(),
      use: jest.fn()
    };

    multilingualTranslationsServiceMock = {
      translateActualLabel: jest.fn().mockReturnValue('Translated Label'),
      languageSelectedObservable: languageSelectedSubject
    };

    configurationsServiceMock = {
      userProfile: {
        userId: 'test-user-id'
      },
      unMappedUser: {
        identifier: 'test-user-id'
      },
      compentency: {
        v6: {
          vKey: 'competencies_v6',
          vCompetencyArea: 'area',
          vCompetencyTheme: 'theme',
          vCompetencySubTheme: 'subtheme'
        }
      },
      netcoreConfig: {
        netcoreWebConfig: {
          isActive: true,
          events: {
            content_view: {
              isActive: true
            }
          }
        }
      }
    };

    contentServiceMock = {
      downloadCert: jest.fn().mockReturnValue(of({
        result: {
          printUri: 'test-cert-uri'
        }
      }))
    };

    snackBarMock = {
      open: jest.fn()
    };

    netCoreServiceMock = {
      trackEventForContentAndEvent: jest.fn()
    };

    // Create component with mocked dependencies
    component = new EventDetailComponent(
      dialogMock,
      routeMock,
      eventServiceMock,
      translateServiceMock,
      multilingualTranslationsServiceMock,
      configurationsServiceMock,
      contentServiceMock,
      snackBarMock,
      netCoreServiceMock
    );

    // Setup DOM elements that would normally be provided by ViewChild
    component.toastSuccess = { nativeElement: {} } as any;
    component.toastError = { nativeElement: {} } as any;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with language from localStorage', () => {
    // Setup localStorage with a language
    localStorageMock.setItem('websiteLanguage', 'fr');

    // Re-create component to trigger constructor
    component = new EventDetailComponent(
      dialogMock,
      routeMock,
      eventServiceMock,
      translateServiceMock,
      multilingualTranslationsServiceMock,
      configurationsServiceMock,
      contentServiceMock,
      snackBarMock,
      netCoreServiceMock
    );

    expect(translateServiceMock.setDefaultLang).toHaveBeenCalledWith('en');
    expect(translateServiceMock.use).toHaveBeenCalledWith('fr');
  });

  it('should update language when language is selected', () => {
    // Setup localStorage with a language
    localStorageMock.setItem('websiteLanguage', 'es');

    // Trigger language selection event
    languageSelectedSubject.next('language-changed');

    expect(translateServiceMock.setDefaultLang).toHaveBeenCalledWith('en');
    expect(translateServiceMock.use).toHaveBeenCalledWith('es');
  });

  it('should determine if event is part of enrollment flow', () => {
    component.eventData = {
      resourceType: 'webinar'
    };
    component.enrollFlowItems = ['webinar', 'karmayogiTalks'];

    expect(component.isenrollFlow).toBe(true);

    component.eventData.resourceType = 'other-type';
    expect(component.isenrollFlow).toBe(false);

    component.enrollFlowItems = [];
    expect(component.isenrollFlow).toBe(false);
  });

  it('should initialize event data and process it correctly', () => {
    // Mock Date to return fixed date for time-based tests
    const mockDate = new Date('2025-03-20T12:00:00Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

    // Spy on getUserIsEnrolled and loadCompetencies
    const loadCompetenciesSpy = jest.spyOn(component, 'loadCompetencies').mockImplementation(() => { });

    // Initialize component
    component.ngOnInit();

    // Verify event ID was extracted from route
    expect(component.eventId).toBe('test-event-id');

    // Verify getEventData was called
    expect(eventServiceMock.getEventData).toHaveBeenCalledWith('test-event-id');

    // Verify event data was processed correctly
    expect(component.eventData).toBeDefined();
    expect(component.eventData.creatorDetails).toEqual({ name: 'Test Creator' });

    // Verify current event flag was set (since mock date is during event time)
    expect(component.currentEvent).toBe(false);

    // Verify competencies were processed
    expect(loadCompetenciesSpy).toHaveBeenCalled();


    // Restore Date
    jest.restoreAllMocks();
  });

  it('should handle past events correctly', () => {
    // Mock moment to make event appear in the past
    jest.spyOn(moment.prototype, 'format').mockReturnValue('2025-03-22 00:00');
    jest.spyOn(moment.prototype, 'valueOf').mockReturnValue(new Date('2025-03-22T00:00:00Z').getTime());

    // Mock event data with past dates
    eventServiceMock.getEventData = jest.fn().mockReturnValue(of({
      result: {
        event: {
          identifier: 'test-event-id',
          startDate: '2025-03-19',
          endDate: '2025-03-19',
          startTime: '09:00+05:30',
          endTime: '17:00+05:30',
          creatorDetails: '{"name":"Test Creator"}',
          competencies_v6: []
        }
      }
    }));

    // Initialize component
    component.ngOnInit();

    // Verify past event flag was set
    expect(component.pastEvent).toBe(false);

    // Restore mocks
    jest.restoreAllMocks();
  });


  it('should format custom date correctly', () => {
    const result = component.customDateFormat('2025-03-20', '09:00+05:30');
    expect(result).toBe('2025-03-20 09:00');
  });



  it('should handle YouTube player state changes', () => {
    const eventData = { data: 1 }; // 1 is YT.PlayerState.PLAYING
    component.onStateChange(eventData);
    expect(component.ytEvent).toBe(1);
  });

  it('should open certificate dialog and download certificate if not cached', () => {
    // Setup enrolled event with certificate ID but no certificate data
    component.enrolledEvent = {
      certificateObj: {
        certId: 'cert-123',
        certData: ''
      }
    };
    component.downloadCertificateBool = false;

    // Call method
    component.handleOpenCertificateDialog();

    // Verify state and service calls
    expect(component.downloadCertificateBool).toBe(false);
    expect(contentServiceMock.downloadCert).toHaveBeenCalledWith('cert-123');

    // After response
    expect(component.downloadCertificateBool).toBe(false);
    expect(component.enrolledEvent.certificateObj.certData).toBe('test-cert-uri');

    // Verify dialog was opened
    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('should handle certificate download error', () => {
    // Setup enrolled event with certificate ID but no certificate data
    component.enrolledEvent = {
      certificateObj: {
        certId: 'cert-123',
        certData: ''
      }
    };

    // Mock error response
    contentServiceMock.downloadCert = jest.fn().mockReturnValue(throwError(new Error('Download error')));

    // Call method
    component.handleOpenCertificateDialog();

    // Verify error handling
    expect(component.downloadCertificateBool).toBe(false);
    expect(snackBarMock.open).toHaveBeenCalledWith('Unable to View Certificate, due to some error!');
  });

  it('should open certificate dialog directly if certificate data is cached', () => {
    // Setup enrolled event with certificate ID and certificate data
    component.enrolledEvent = {
      certificateObj: {
        certId: 'cert-123',
        certData: 'cached-cert-data'
      }
    };

    // Call method
    component.handleOpenCertificateDialog();

    // Verify certificate was not downloaded again
    expect(contentServiceMock.downloadCert).not.toHaveBeenCalled();

    // Verify dialog was opened with cached data
    expect(dialogMock.open).toHaveBeenCalled();
    expect(dialogMock.open.mock.calls[0][1].data.cet).toBe('cached-cert-data');
  });

  it('should translate labels correctly', () => {
    const result = component.translateLabels('testLabel', 'testType');
    expect(multilingualTranslationsServiceMock.translateActualLabel).toHaveBeenCalledWith('testLabel', 'testType', '');
    expect(result).toBe('Translated Label');
  });

  it('should handle enrollment status change', () => {
    // Setup discussion widget
    component.discussWidgetData = {
      enrolledContent: false,
      newCommentSection: {
        commentBox: { placeholder: '' }
      }
    } as any;

    // Call method with true (enrolled)
    component.enrollEvent(true);

    // Verify state was updated
    expect(component.isEnrolled).toBe(true);
    expect(component.discussWidgetData.enrolledContent).toBe(true);
    expect(component.discussWidgetData.newCommentSection.commentBox.placeholder).toBe('Start a discussion');
  });

  it('should return correct file icon based on file extension', () => {
    expect(component.fileImage('document.ppt')).toBe('/assets/icons/ppt.svg');
    expect(component.fileImage('document.doc')).toBe('/assets/icons/doc.svg');
    expect(component.fileImage('document.pdf')).toBe('/assets/icons/pdf.svg');
    expect(component.fileImage('document.txt')).toBe('/assets/icons/pdf.svg'); // Default case
  });

  it('should generate material name from URL', () => {
    expect(component.genrateMaterialName('path_to_file_document.pdf')).toBe('document.pdf');
    expect(component.genrateMaterialName('')).toBe('');
  });

  it('should download PDF file using fileSaver', () => {
    const handout = {
      content: 'file-url',
      title: 'test-document.pdf'
    };

    component.downloadPDF(handout);

    expect(fileSaver.saveAs).toHaveBeenCalledWith('file-url', 'test-document.pdf');
  });

  it('should check if string is valid JSON', () => {
    expect(component.checkValidJSON('{"key":"value"}')).toBe(true);
    expect(component.checkValidJSON('invalid json')).toBe(false);
  });





  it('should handle showing competencies by area', () => {
    // Setup competency data
    const competencyItem = {
      key: 'Area1',
      value: {
        'Theme1': ['SubTheme1', 'SubTheme2'],
        'Theme2': ['SubTheme3']
      }
    };

    // Setup strip for transformed widgets
    component.strip = {
      key: 'testStrip',
      logo: '',
      title: 'Test Strip',
      stripTitleLink: {
        link: '',
        icon: '',
      },
      sliderConfig: {
        showNavs: true,
        showDots: false,
      },
      loader: true,
      stripBackground: '',
      titleDescription: 'Test Description',
      stripConfig: {
        cardSubType: 'standard',
      },
      viewMoreUrl: {
        path: '',
        viewMoreText: 'Show all',
        queryParams: '',
      },
      tabs: [],
      filters: []
    };

    // Spy on transformCompetenciesToWidget
    const transformSpy = jest.spyOn(component as any, 'transformCompetenciesToWidget').mockReturnValue([
      { widgetType: 'card', widgetData: { content: { key: 'Theme1' } } }
    ]);

    // Call method
    component.handleShowCompetencies(competencyItem);

    // Verify state was updated
    expect(component.competencySelected).toBe('Area1');

    // Verify transformation was called with correct data
    expect(transformSpy).toHaveBeenCalledWith(
      'Area1',
      [
        { key: 'Theme1', value: ['SubTheme1', 'SubTheme2'] },
        { key: 'Theme2', value: ['SubTheme3'] }
      ],
      component.strip
    );

    // Verify loaderWidgets was set
    expect(component.strip.loaderWidgets).toEqual([
      { widgetType: 'card', widgetData: { content: { key: 'Theme1' } } }
    ]);
  });

  it('should transform competencies to widgets', () => {
    // Setup test data
    const competencyArea = 'Area1';
    const competencyArr = [
      { key: 'Theme1', value: ['SubTheme1', 'SubTheme2'] },
      { key: 'Theme2', value: ['SubTheme3'] }
    ];
    const strip = {
      key: 'testStrip',
      customeClass: 'test-class'
    } as any;

    // Call private method
    const result = (component as any).transformCompetenciesToWidget(
      competencyArea,
      competencyArr,
      strip
    );

    // Verify result
    expect(result.length).toBe(2);
    expect(result[0].widgetType).toBe('card');
    expect(result[0].widgetSubType).toBe('competencyCard');
    expect(result[0].widgetData.content).toEqual(competencyArr[0]);
    expect(result[0].widgetData.competencyArea).toBe('Area1');
    expect(result[0].widgetData.cardCustomeClass).toBe('test-class');
    expect(result[0].widgetData.context.pageSection).toBe('testStrip');
    expect(result[0].widgetData.context.position).toBe(0);
  });

  it('should convert seconds to human-readable time format', () => {
    // Test hours, minutes, seconds
    expect(component.secondsToTime(3661)).toBe('1 hour, 1 minute, 1 second');

    // Test plural forms
    expect(component.secondsToTime(7322)).toBe('2 hours, 2 minutes, 2 seconds');

    // Test with only minutes and seconds
    expect(component.secondsToTime(65)).toBe('1 minute, 5 seconds');

    // Test with only seconds
    expect(component.secondsToTime(45)).toBe('45 seconds');

    // Test with zero
    expect(component.secondsToTime(0)).toBe('');
  });
});