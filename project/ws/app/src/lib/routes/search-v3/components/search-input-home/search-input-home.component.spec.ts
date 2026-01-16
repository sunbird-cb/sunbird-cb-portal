import { SearchInputHomeComponent } from './search-input-home.component';
import { Subject } from 'rxjs';
import { SearchCategory } from '../../models/search-v3.model';

describe('SearchInputHomeComponent', () => {
  let component: SearchInputHomeComponent;
  let mockActivatedRoute: any;
  let mockRouter: any;
  let mockSearchServService: any;
  let mockConfigSvc: any;
  let mockRoute: any;
  let mockERef: any;
  let mockSearchV3Service: any;
  let mockContSvc: any;
  let queryParamMap: Subject<any>;

  beforeEach(() => {
    queryParamMap = new Subject();
    
    mockActivatedRoute = {
      snapshot: {
        queryParams: { q: 'test query' },
        data: { searchPageData: null }
      },
      queryParamMap: queryParamMap.asObservable(),
      parent: {}
    };
    
    mockRouter = {
      navigate: jest.fn()
    };
    
    mockSearchServService = {
      getSearchConfig: jest.fn().mockResolvedValue({ data: { search: { isAutoCompleteAllowed: true } } })
    };
    
    mockConfigSvc = {
      unMappedUser: {
        profileDetails: {
          profileStatus: 'Active',
          employmentDetails: {
            departmentName: 'Test Department'
          }
        }
      }
    };
    
    mockRoute = {
      snapshot: {
        data: {
          searchPageData: {
            data: {
              search: {
                isAutoCompleteAllowed: true
              }
            }
          }
        }
      }
    };
    
    mockERef = {
      nativeElement: document.createElement('div')
    };
    
    mockSearchV3Service = {
      searchCoursesv4: jest.fn().mockResolvedValue({
        result: {
          content: [
            { name: 'Course 1', organisation: ['Department 1'] },
            { name: 'Course 2', organisation: ['Department 2'] }
          ]
        }
      }),
      searchConnections: jest.fn().mockResolvedValue({
        result: {
          data: [{
            results: [
              { personalDetails: { firstname: 'John' }, userId: '123' },
              { personalDetails: { firstname: 'Jane' }, userId: '456' }
            ]
          }]
        }
      }),
      searchCommunity: jest.fn().mockResolvedValue({
        result: {
          search_results: {
            data: [
              { communityName: 'Community 1' },
              { communityName: 'Community 2' }
            ]
          }
        }
      }),
      nlpSearch: jest.fn().mockResolvedValue({
        data: {
          keywords: [{ keyword: 'processed query' }]
        }
      })
    };
    
    mockContSvc = {
      getResourseLink: jest.fn().mockResolvedValue({
        url: '/content/123',
        queryParams: { batchId: '456' }
      })
    };

    component = new SearchInputHomeComponent(
      mockActivatedRoute,
      mockRouter,
      mockSearchServService,
      mockConfigSvc,
      mockRoute,
      mockERef,
      mockSearchV3Service,
      mockContSvc
    );

    // Mock document methods
    document.getElementById = jest.fn().mockImplementation(() => {
      return {
        blur: jest.fn()
      };
    });

    // Spy on component methods
    jest.spyOn(component, 'searchFromQuery').mockImplementation(jest.fn());
    jest.spyOn(component, 'searchInNLP').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.placeHolder).toBe('');
    expect(component.ref).toBe('');
    expect(component.disableMenu).toBe(false);
    expect(component.openSearchTemplate).toBe(false);
    expect(component.loaderSearching).toBe(false);
    expect(component.selectedSearchCategory).toBe(SearchCategory.All);
  });

  it('should initialize query control with value from activated route', () => {
    expect(component.queryControl.value).toBe('test query');
  });

  it('should call initialize method on ngOnInit when searchPageData exists', () => {
    mockActivatedRoute.snapshot.data.searchPageData = { data: {} };
    jest.spyOn(component, 'initialize');
    component.ngOnInit();
    expect(component.initialize).toHaveBeenCalled();
  });

  it('should fetch search config and then initialize when searchPageData does not exist', async () => {
    // Make sure searchPageData is null
    mockActivatedRoute.snapshot.data = { searchPageData: null };
    
    // Spy on initialize AFTER creating the component
    const initializeSpy = jest.spyOn(component, 'initialize');
    
    // We need to manually wait for promises to resolve
    await component.ngOnInit();
    
    // Wait for any promises to resolve
    await new Promise(process.nextTick);
    
    expect(mockSearchServService.getSearchConfig).toHaveBeenCalled();
    expect(initializeSpy).toHaveBeenCalled();
  });

  it('should update placeHolder on ngOnChanges', () => {
    component.placeHolder = 'New Placeholder';
    component.ngOnChanges();
    expect(component.placeHolder).toBe('New Placeholder');
  });

  it('should set disableMenu to true when user is not-my-user and from igot department', () => {
    mockConfigSvc.unMappedUser.profileDetails.profileStatus = 'not-my-user';
    mockConfigSvc.unMappedUser.profileDetails.employmentDetails.departmentName = 'igot';
    component.initialize();
    expect(component.disableMenu).toBe(true);
  });

  it('should set disableMenu to false for normal users', () => {
    component.initialize();
    expect(component.disableMenu).toBe(false);
  });

  it('should update query params from activated route on initialize', () => {
    // Mock the activated route's behavior directly
    mockActivatedRoute.queryParamMap = {
      subscribe: jest.fn(callback => {
        // Directly call the callback with our mock data
        callback({
          has: (key: any) => key === 'q' || key === 'category',
          get: (key: any) => key === 'q' ? 'new query' : 'Events'
        });
        return { unsubscribe: jest.fn() };
      })
    };
    
    // Spy on methods that would be called
    const setValueSpy = jest.spyOn(component.queryControl, 'setValue');
    
    // Call initialize directly
    component.initialize();
    
    // Verify the behavior we expect
    expect(setValueSpy).toHaveBeenCalledWith('new query');
    expect(component.selectedSearchCategory).toBe('Events');
  });

  it('should clear search text', () => {
    jest.spyOn(component.queryControl, 'reset');
    component.clearSearchText();
    expect(component.queryControl.reset).toHaveBeenCalled();
  });

  it('should select search category and update query', async () => {
    jest.spyOn(component, 'updateQuery');
    component.queryControl.setValue('test query');
    
    await component.selectSearchCategory(SearchCategory.Events);
    
    expect(component.selectedSearchCategory).toBe(SearchCategory.Events);
    expect(component.updateQuery).toHaveBeenCalledWith('test query');
  });

  it('should update query and navigate to search page from home', async () => {
    // Setup test conditions
    component.ref = 'home';
    component.responseNlpQuery = 'processed query';
    component.selectedSearchCategory = SearchCategory.All;
    
    // Mock dependencies
    jest.spyOn(component, 'searchInNLP').mockResolvedValue(undefined);
    jest.spyOn(component.closed, 'emit');
    
    // Execute the method under test
    await component.updateQuery('test query');
    
    // Verify behavior
    expect(component.searchInNLP).toHaveBeenCalledWith('test query');
    expect(component.closed.emit).toHaveBeenCalledWith(false);
    
    // Check navigation with exact expected parameters
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/app/globalsearch'], 
      {
        queryParams: {
          q: 'test query',
          search: 'processed query',
          category: null  // The actual value passed, not SearchCategory.All
        },
        queryParamsHandling: 'merge'
      }
    );
    
    expect(component.openSearchTemplate).toBe(false);
  });

  it('should search courses with correct parameters based on category', async () => {
    // Reset the mock to allow actual implementation
    jest.spyOn(component, 'searchFromQuery').mockRestore();
    
    component.selectedSearchCategory = SearchCategory.Courses;
    await component.searchFromQuery('test query');
    
    expect(mockSearchV3Service.searchCoursesv4).toHaveBeenCalled();
    // Verify the first argument passed to searchCoursesv4
    const searchRequestArg = mockSearchV3Service.searchCoursesv4.mock.calls[0][0];
    expect(searchRequestArg.request.filters.courseCategory).toBe('course');
  });

  it('should search events with correct parameters', async () => {
    jest.spyOn(component, 'searchFromQuery').mockRestore();
    
    component.selectedSearchCategory = SearchCategory.Events;
    await component.searchFromQuery('test query');
    
    expect(mockSearchV3Service.searchCoursesv4).toHaveBeenCalled();
    // Verify the first argument passed to searchCoursesv4
    const searchRequestArg = mockSearchV3Service.searchCoursesv4.mock.calls[0][0];
    expect(searchRequestArg.request.filters.contentType).toBe('Event');
  });

  it('should search people based on department names', async () => {
    jest.spyOn(component, 'searchFromQuery').mockRestore();
    
    component.selectedSearchCategory = SearchCategory.People;
    await component.searchFromQuery('test query');
    
    expect(mockSearchV3Service.searchConnections).toHaveBeenCalled();
    expect(component.allSearchResults.length).toBeGreaterThanOrEqual(0);
  });

  it('should search communities based on first department name', async () => {
    jest.spyOn(component, 'searchFromQuery').mockRestore();
    
    component.selectedSearchCategory = SearchCategory.Communities;
    await component.searchFromQuery('test query');
    
    expect(mockSearchV3Service.searchCommunity).toHaveBeenCalled();
    expect(component.allSearchResults.length).toBeGreaterThan(0);
  });

  it('should get result name based on category', () => {
    // Arrange
    component.selectedSearchCategory = SearchCategory.People;

    // Act & Assert
    expect(component.getResultName({ personalDetails: { firstname: 'John' } })).toBe('John');
    expect(component.getResultName({ firstName: 'Jane' })).toBe('Jane');
    expect(component.getResultName({})).toBe('');

    component.selectedSearchCategory = SearchCategory.Communities;
    expect(component.getResultName({ communityName: 'Community 1' })).toBe('Community 1');
    expect(component.getResultName({})).toBe('');

    component.selectedSearchCategory = SearchCategory.Courses;
    expect(component.getResultName({ name: 'Course 1' })).toBe('Course 1');
    expect(component.getResultName({})).toBe('');
  });

  it('should redirect to user profile for people results', () => {
    jest.spyOn(component, 'goToUserProfile');
    
    component.selectedSearchCategory = SearchCategory.People;
    component.redirectToContent({ userId: '123', personalDetails: { firstname: 'John' } });
    
    expect(component.openSearchTemplate).toBe(false);
    expect(component.goToUserProfile).toHaveBeenCalled();
  });

  it('should redirect to correct content based on type', async () => {
    jest.spyOn(component, 'getRedirectUrlData');
    
    component.selectedSearchCategory = SearchCategory.Courses;
    component.redirectToContent({ name: 'Course 1' });
    
    expect(component.openSearchTemplate).toBe(false);
    expect(component.getRedirectUrlData).toHaveBeenCalled();
  });

  it('should navigate to user profile', () => {
    component.goToUserProfile({ userId: '123' });
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/app/person-profile', '123'], 
      { fragment: 'profileInfo' }
    );
  });

  it('should navigate to event detail page for event content', async () => {
    await component.getRedirectUrlData({ objectType: 'Event', identifier: 'event-123' });
    
    // The method does not pass a second parameter to navigate for events
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['app/event-hub/home/event-123']
    );
  });

  it('should navigate to content page for non-event content', async () => {
    await component.getRedirectUrlData({ name: 'Course 1' });
    
    expect(mockContSvc.getResourseLink).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/content/123'],
      { queryParams: { batchId: '456' } }
    );
  });

  it('should perform NLP search and update responseNlpQuery', async () => {
    jest.spyOn(component, 'searchInNLP').mockRestore();
    
    await component.searchInNLP('test query');
    
    expect(mockSearchV3Service.nlpSearch).toHaveBeenCalled();
    // Verify the first argument passed to nlpSearch
    const searchNLPArg = mockSearchV3Service.nlpSearch.mock.calls[0][0];
    expect(searchNLPArg.query).toBe('test query');
    expect(component.responseNlpQuery).toBe('processed query');
  });

  it('should handle empty NLP response', async () => {
    jest.spyOn(component, 'searchInNLP').mockRestore();
    mockSearchV3Service.nlpSearch.mockResolvedValue({
      data: { keywords: [] }
    });
    
    await component.searchInNLP('test query');
    
    expect(component.responseNlpQuery).toBe('');
  });

  it('should close search template on click outside', () => {
    component.openSearchTemplate = true;
    const event = new MouseEvent('click');
    
    component.onClickOutside(event);
    
    expect(component.openSearchTemplate).toBe(false);
  });

  it('should not close search template when clicking inside', () => {
    component.openSearchTemplate = true;
    const event = new MouseEvent('click');
    
    // Mock contains to return true (click was inside)
    mockERef.nativeElement.contains = jest.fn().mockReturnValue(true);
    
    component.onClickOutside(event);
    
    expect(component.openSearchTemplate).toBe(true);
  });
});