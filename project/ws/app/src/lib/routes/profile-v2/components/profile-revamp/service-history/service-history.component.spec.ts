import { ServiceHistoryComponent } from './service-history.component'
import { of, throwError } from 'rxjs'
import { EventEmitter } from '@angular/core'

describe('ServiceHistoryComponent (Jest, no TestBed)', () => {
  let component: any
  let mockDatePipe: any
  let mockDialogRef: any
  let mockData: any
  let mockProfileV2RevampSvc: any
  let mockSnackBar: any
  let mockCdr: any

  beforeEach(() => {
    mockDatePipe = { transform: jest.fn(() => 'Jan 2020') }
    mockDialogRef = { close: jest.fn() }
    mockData = { userId: 'user1', isCurrentUser: true, currentDesignation: 'Dev', currentOrgName: 'Org' }
    mockProfileV2RevampSvc = { fetchProfileEntries: jest.fn() }
    mockSnackBar = { open: jest.fn() }
    mockCdr = { detectChanges: jest.fn() }

    component = new ServiceHistoryComponent(
      mockDatePipe,
      mockDialogRef,
      mockData,
      mockProfileV2RevampSvc,
      mockSnackBar,
      mockCdr
    )
    component.serviceHistoryList = []
    component.isCurrentUser = false
    component.openProfileEntryEditDialog = new EventEmitter()
    component.userId = ''
    component.isPopup = false
    component.currentDesignation = ''
    component.currentOrgName = ''
    component.serviceHistoryDetails = {}
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize with data in constructor', () => {
    const testData = { userId: 'u123', isCurrentUser: true, currentDesignation: 'D', currentOrgName: 'O' }
    const c = new ServiceHistoryComponent(
      mockDatePipe,
      mockDialogRef,
      testData,
      mockProfileV2RevampSvc,
      mockSnackBar,
      mockCdr
    )
    expect(c.userId).toBe('u123')
    expect(c.isPopup).toBe(true)
    expect(c.isCurrentUser).toBe(true)
    expect(c.currentDesignation).toBe('D')
    expect(c.currentOrgName).toBe('O')
  })

  it('should handle null data in constructor', () => {
    const c = new ServiceHistoryComponent(
      mockDatePipe,
      mockDialogRef,
      null,
      mockProfileV2RevampSvc,
      mockSnackBar,
      mockCdr
    )
    expect(c.userId).toBe('')
    expect(c.isPopup).toBe(false)
    expect(c.isCurrentUser).toBe(false)
  })

  it('should call getServiceHistoryList in ngOnInit if isPopup', () => {
    component.isPopup = true
    const spy = jest.spyOn(component, 'getServiceHistoryList').mockImplementation(() => {})
    component.ngOnInit()
    expect(spy).toHaveBeenCalled()
  })

  it('should not call getServiceHistoryList in ngOnInit if not isPopup', () => {
    component.isPopup = false
    const spy = jest.spyOn(component, 'getServiceHistoryList').mockImplementation(() => {})
    component.ngOnInit()
    expect(spy).not.toHaveBeenCalled()
  })

  it('should fetch service history and format data', () => {
    component.userId = 'user1'
    const mockList = [{ orgName: 'Org', designation: 'Dev' }]
    const mockResponse = { result: { response: { serviceHistory: mockList } } }
    mockProfileV2RevampSvc.fetchProfileEntries.mockReturnValue(of(mockResponse))
    jest.spyOn(component, 'formateData').mockImplementation(() => {})
    component.getServiceHistoryList()
    expect(mockProfileV2RevampSvc.fetchProfileEntries).toHaveBeenCalledWith('user1', 'serviceHistory')
    expect(component.serviceHistoryList).toEqual(mockList)
    expect(component.formateData).toHaveBeenCalled()
  })

  it('should handle error in getServiceHistoryList', () => {
    component.userId = 'user1'
    mockProfileV2RevampSvc.fetchProfileEntries.mockReturnValue(throwError({ error: 'err' }))
    jest.spyOn(component, 'openSnackbar')
    component.getServiceHistoryList()
    expect(component.openSnackbar).toHaveBeenCalledWith(
      'something went wrong while fetching service history please try again later',
      5000
    )
  })

  it('should not fetch if userId is empty', () => {
    component.userId = ''
    component.getServiceHistoryList()
    expect(mockProfileV2RevampSvc.fetchProfileEntries).not.toHaveBeenCalled()
  })

  it('should call formateData in ngOnChanges if serviceHistoryDetails exists', () => {
    component.serviceHistoryDetails = { serviceHistoryList: [{ orgName: 'Org', designation: 'Dev' }] }
    jest.spyOn(component, 'formateData')
    component.ngOnChanges()
    expect(component.formateData).toHaveBeenCalled()
  })

  it('should not call formateData in ngOnChanges if serviceHistoryDetails is falsy', () => {
    component.serviceHistoryDetails = null
    jest.spyOn(component, 'formateData')
    component.ngOnChanges()
    expect(component.formateData).not.toHaveBeenCalled()
  })

  it('should format service history data and set isCurrentOrgDetails', () => {
    component.currentOrgName = 'Org'
    component.currentDesignation = 'Dev'
    component.serviceHistoryList = [
      { orgName: 'Org', designation: 'Dev', startDate: '2020-01-01', endDate: '2021-01-01', currentlyWorking: 'false' }
    ]
    component.formateData()
    expect(component.serviceHistoryList[0].isCurrentOrgDetails).toBe(true)
    expect(component.serviceHistoryList[0].orgDetails).toContain('Org')
    expect(component.serviceHistoryList[0].period).toContain('year')
    expect(component.serviceHistoryList[0].showMore).toBe(false)
    expect(mockCdr.detectChanges).toHaveBeenCalled()
  })

  it('should add orgDetails if not present in serviceHistoryList', () => {
    component.currentOrgName = 'Org'
    component.currentDesignation = 'Dev'
    component.isPopup = false
    component.serviceHistoryList = []
    component.serviceHistoryDetails = { count: 0 }
    component.formateData()
    expect(component.serviceHistoryList.length).toBe(1)
    expect(component.serviceHistoryList[0].isCurrentOrgDetails).toBe(true)
    expect(component.serviceHistoryList[0].orgName).toBe('Org')
    expect(component.serviceHistoryDetails.count).toBe(1)
    expect(mockCdr.detectChanges).toHaveBeenCalled()
  })

  it('should slice serviceHistoryList if not popup and more than 2 entries', () => {
    component.currentOrgName = 'Org'
    component.currentDesignation = 'Dev'
    component.isPopup = false
    component.serviceHistoryList = [
      { orgName: 'A', designation: 'X' },
      { orgName: 'B', designation: 'Y' },
      { orgName: 'C', designation: 'Z' }
    ]
    component.serviceHistoryDetails = { count: 3 }
    component.formateData()
    expect(component.serviceHistoryList.length).toBe(2)
    expect(mockCdr.detectChanges).toHaveBeenCalled()
  })

  it('should not slice serviceHistoryList if popup', () => {
    component.currentOrgName = 'Org'
    component.currentDesignation = 'Dev'
    component.isPopup = true
    component.serviceHistoryList = [
      { orgName: 'A', designation: 'X' },
      { orgName: 'B', designation: 'Y' },
      { orgName: 'C', designation: 'Z' }
    ]
    component.serviceHistoryDetails = { count: 3 }
    component.formateData()
    expect(component.serviceHistoryList.length).toBe(4) // orgDetails added + 3
    expect(mockCdr.detectChanges).toHaveBeenCalled()
  })

  it('should not throw if serviceHistoryList is null', () => {
    component.serviceHistoryList = null
    expect(() => component.formateData()).not.toThrow()
  })

  it('should close dialog in closePopup if isPopup', () => {
    component.isPopup = true
    component.closePopup()
    expect(mockDialogRef.close).toHaveBeenCalled()
  })

  it('should not close dialog in closePopup if not isPopup', () => {
    component.isPopup = false
    component.closePopup()
    expect(mockDialogRef.close).not.toHaveBeenCalled()
  })

  it('should close dialog with entry in openEditDialog if isPopup', () => {
    component.isPopup = true
    component.openEditDialog({ id: 1 })
    expect(mockDialogRef.close).toHaveBeenCalledWith({ id: 1 })
  })

  it('should emit openProfileEntryEditDialog if not popup', () => {
    component.isPopup = false
    jest.spyOn(component.openProfileEntryEditDialog, 'emit')
    component.openEditDialog({ id: 1 })
    expect(component.openProfileEntryEditDialog.emit).toHaveBeenCalledWith({ id: 1 })
  })

  it('should call snackBar.open in openSnackbar', () => {
    component.openSnackbar('msg', 1234)
    expect(mockSnackBar.open).toHaveBeenCalledWith('msg', 'X', { duration: 1234 })
  })

  // Use all variables to avoid lint errors
  afterEach(() => {
    expect(component).toBeDefined()
    expect(mockDatePipe).toBeDefined()
    expect(mockDialogRef).toBeDefined()
    expect(mockData).toBeDefined()
    expect(mockProfileV2RevampSvc).toBeDefined()
    expect(mockSnackBar).toBeDefined()
    expect(mockCdr).toBeDefined()
  })
})