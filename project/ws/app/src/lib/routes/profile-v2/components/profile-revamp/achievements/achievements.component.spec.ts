import * as _ from 'lodash';
import { AchievementsComponent } from './achievements.component';

describe('AchievementsComponent (Jest, no TestBed)', () => {
  let component: any;
  let mockDialogRef: any;
  let mockData: any;
  let mockProfileV2RevampSvc: any;
  let mockSnackBar: any;
  let mockDialog: any;
  let mockCdr: any;

  beforeEach(() => {
    mockDialogRef = { close: jest.fn() };
    mockData = { userId: 'user1', isCurrentUser: true };
    mockProfileV2RevampSvc = { fetchProfileEntries: jest.fn() };
    mockSnackBar = { open: jest.fn() };
    mockDialog = { open: jest.fn() };
    mockCdr = { detectChanges: jest.fn() };
    component = new AchievementsComponent(
      mockDialogRef,
      mockData,
      mockProfileV2RevampSvc,
      mockSnackBar,
      mockDialog,
      mockCdr
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set userId, isPopup, isCurrentUser from data', () => {
    expect(component.userId).toBe('user1');
    expect(component.isPopup).toBe(true);
    expect(component.isCurrentUser).toBe(true);
  });

  it('should set defaults if no data', () => {
    const c: any = new AchievementsComponent(
      mockDialogRef,
      null,
      mockProfileV2RevampSvc,
      mockSnackBar,
      mockDialog,
      mockCdr
    );
    expect(c.userId).toBe('');
    expect(c.isPopup).toBe(false);
    expect(c.isCurrentUser).toBe(false);
  });

  it('should call getAchievementsList in ngOnInit if isPopup', () => {
    component.isPopup = true;
    const spy = jest.spyOn(component, 'getAchievementsList').mockImplementation(() => {});
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call detectChanges in ngOnInit if not isPopup', () => {
    component.isPopup = false;
    component.ngOnInit();
    expect(mockCdr.detectChanges).toHaveBeenCalled();
  });

  it('should fetch achievements and set achievementsList', () => {
    const mockAchievements = [{ id: 1 }, { id: 2 }];
    const mockResponse = { result: { response: { achievements: mockAchievements } } };
    component.userId = 'user1';
    mockProfileV2RevampSvc.fetchProfileEntries.mockReturnValue({
      subscribe: ({ next }: any) => next(mockResponse)
    });
    jest.spyOn(_, 'get');
    component.getAchievementsList();
    expect(mockProfileV2RevampSvc.fetchProfileEntries).toHaveBeenCalledWith('user1', 'achievement');
    expect(component.achievementsList).toEqual(mockAchievements);
    expect(mockCdr.detectChanges).toHaveBeenCalled();
    expect(_.get).toHaveBeenCalledWith(mockResponse, 'result.response.achievements', []);
  });

  it('should handle error in getAchievementsList', () => {
    component.userId = 'user1';
    mockProfileV2RevampSvc.fetchProfileEntries.mockReturnValue({
      subscribe: ({ error }: any) => error('err')
    });
    const spy = jest.spyOn(component as any, 'openSnackbar').mockImplementation(() => {});
    component.getAchievementsList();
    expect(spy).toHaveBeenCalledWith('Something went wrong while fetching achievements, please try again later', 2000);
  });

  it('should not call API if userId is empty', () => {
    component.userId = '';
    component.getAchievementsList();
    expect(mockProfileV2RevampSvc.fetchProfileEntries).not.toHaveBeenCalled();
  });

  it('should emit openProfileEntryEditDialog if not popup', () => {
    component.isPopup = false;
    const spy = jest.spyOn(component.openProfileEntryEditDialog, 'emit');
    component.openEditDialog({ id: 1 });
    expect(spy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should close dialog if popup', () => {
    component.isPopup = true;
    component.openEditDialog({ id: 1 });
    expect(mockDialogRef.close).toHaveBeenCalledWith({ id: 1 });
  });

  it('should toggle showMore in viewMore', () => {
    const ach: any = { showMore: true };
    component.viewMore(ach);
    expect(ach.showMore).toBe(false);
    const ach2: any = { showMore: false };
    component.viewMore(ach2);
    expect(ach2.showMore).toBe(true);
    const ach3: any = {};
    component.viewMore(ach3);
    expect(ach3.showMore).toBe(true);
  });

  it('should open dialog in openDocument if url is provided', () => {
    component.openDocument('url');
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should not open dialog in openDocument if url is empty', () => {
    component.openDocument('');
    expect(mockDialog.open).not.toHaveBeenCalled();
  });

  it('should call window.open in openUrl', () => {
    window.open = jest.fn();
    component.openUrl('url');
    expect(window.open).toHaveBeenCalledWith('url', '_blank');
  });

  it('should close dialog in closePopup if isPopup', () => {
    component.isPopup = true;
    component.closePopup();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should not close dialog in closePopup if not isPopup', () => {
    component.isPopup = false;
    component.closePopup();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should call snackBar.open in openSnackbar', () => {
    (component as any).openSnackbar('msg', 1234);
    expect(mockSnackBar.open).toHaveBeenCalledWith('msg', 'X', { duration: 1234 });
  });

  // Use all variables to avoid lint errors
  afterEach(() => {
    expect(component).toBeDefined();
    expect(mockDialogRef).toBeDefined();
    expect(mockData).toBeDefined();
    expect(mockProfileV2RevampSvc).toBeDefined();
    expect(mockSnackBar).toBeDefined();
    expect(mockDialog).toBeDefined();
    expect(mockCdr).toBeDefined();
  });
});