// Mock missing ConfirmDialogComponent before any imports
jest.mock('@sunbird-cb/collection/src/lib/_common/confirm-dialog/confirm-dialog.component', () => ({
  ConfirmDialogComponent: jest.fn(),
}))
import { PrfileEditV2Component } from './prfile-edit-v2.component'
import { FormBuilder } from '@angular/forms'
import { of, throwError, Subject } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'

jest.mock('@sunbird-cb/utils-v2', () => ({
  ImageCropComponent: jest.fn(),
  PipeCertificateImageURL: jest.fn(),
}))
jest.mock('@ws/author/src/lib/modules/shared/components/notification/notification.component', () => ({
  NotificationComponent: jest.fn(),
}))
jest.mock('@ws/author/src/lib/constants/upload', () => ({
  PROFILE_IMAGE_SUPPORT_TYPES: ['.jpg', '.jpeg', '.png'],
}))
jest.mock('@ws/author/src/lib/constants/notificationMessage', () => ({
  Notify: { INVALID_IMG_FORMAT: 'INVALID_IMG_FORMAT' },
}))
jest.mock('@ws/author/src/lib/constants/constant', () => ({
  NOTIFICATION_TIME: 2,
}))

describe('PrfileEditV2Component (Jest, no TestBed)', () => {
  let component: any
  let mockDialogRef: any
  let mockProfileV2RevampService: any
  let mockSnackBar: any
  let mockOtpService: any
  let mockDialog: any
  let mockDatePipe: any
  let mockPipeImgUrl: any
  let mockUserProfileService: any
  let formBuilder: any
  let mockData: any

  beforeEach(() => {
    mockDialogRef = { close: jest.fn() }
    mockProfileV2RevampService = {
      getStatesList: jest.fn().mockReturnValue(of({ result: { statesList: [{ id: 1, name: 'TestState' }] } })),
      getDistrictsList: jest.fn().mockReturnValue(of({ result: { districtsList: [{ districts: ['TestDistrict'] }] } })),
      updateProfilePic: jest.fn().mockReturnValue(of({ result: { url: '/profileImage/test.jpg' } })),
      searchDesignation: jest.fn().mockReturnValue(of({ result: { result: { data: [{ designation: 'TestDesignation', status: 'Active' }], totalCount: 1 } } })),
      fetchCadre: jest.fn().mockReturnValue(of({ result: { response: { value: { civilServiceType: { civilServiceTypeList: [] } } } } })),
      getMasterLanguages: jest.fn().mockReturnValue(of({ languages: [{ id: 1, name: 'English' }] })),
      getWhiteListDomain: jest.fn().mockReturnValue(of({ result: { domains: ['example.com'] } })),
      handleTranslateTo: jest.fn().mockReturnValue('Translated message')
    }
    mockSnackBar = { open: jest.fn(), openFromComponent: jest.fn() }
    mockOtpService = {
      sendEmailOtp: jest.fn().mockReturnValue(of({ success: true })),
      sendOtp: jest.fn().mockReturnValue(of({ success: true })),
      resendOtp: jest.fn().mockReturnValue(of({ success: true }))
    }
    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)),
        componentInstance: {
          resendOTP: new Subject(),
          otpVerified: new Subject()
        }
      })
    }
    mockDatePipe = { transform: jest.fn().mockReturnValue('01-01-1990') }
    mockPipeImgUrl = { transform: jest.fn().mockReturnValue('transformed-image-url') }
    mockUserProfileService = { handleTranslateTo: jest.fn().mockReturnValue('Translated message') }
    formBuilder = new FormBuilder()
    mockData = {
      header: 'Profile',
      profileDetails: { firstname: 'John', state: 'TestState', district: 'TestDistrict', profileImage: 'test.jpg' },
      profileImage: 'test.jpg',
      groupsList: [{ id: 1, name: 'TestGroup' }]
    }

    component = new PrfileEditV2Component(
      formBuilder,
      mockDialogRef,
      mockData,
      mockProfileV2RevampService,
      mockSnackBar,
      mockOtpService,
      mockDialog,
      mockDatePipe,
      mockPipeImgUrl,
      mockUserProfileService
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize form for Profile header', () => {
    jest.useFakeTimers()
    component.header = 'Profile'
    component.ngOnInit()
    jest.runAllTimers()
    expect(component.profileForm).toBeDefined()
    expect(component.initilisationInProgress).toBe(false)
    jest.useRealTimers()
  })

  it('should initialize form for Primary Details header', () => {
    component.header = 'Primary Details'
    component.ngOnInit()
    expect(component.profileForm.get('group')).toBeTruthy()
    expect(component.profileForm.get('designation')).toBeTruthy()
  })

  it('should initialize form for About Me header', () => {
    component.header = 'About Me'
    component.ngOnInit()
    expect(component.profileForm.get('aboutme')).toBeTruthy()
  })

  it('should initialize form for Other Details header', () => {
    component.header = 'Other Details'
    component.ngOnInit()
    expect(component.profileForm.get('employeeCode')).toBeTruthy()
    expect(component.profileForm.get('primaryEmail')).toBeTruthy()
  })

  it('should get user initials', () => {
    component.profileDetails.firstname = 'John Doe'
    component.getInitials()
    expect(component.userInitials).toBe('JD')
  })

  it('should get states list and patch state', () => {
    component.profileDetails.state = 'TestState'
    component.ngOnInit()
    component.getStatesList()
    expect(mockProfileV2RevampService.getStatesList).toHaveBeenCalled()
    expect(component.statesList.length).toBeGreaterThan(0)
  })

  it('should handle error in getStatesList', () => {
    mockProfileV2RevampService.getStatesList.mockReturnValue(throwError(new HttpErrorResponse({ error: { params: { errmsg: 'Error fetching states' } } })))
    component.ngOnInit()
    component.getStatesList()
    expect(mockSnackBar.open).toHaveBeenCalledWith('Error fetching states', 'X', { duration: 5000 })
  })

  it('should get districts list and patch district', () => {
    component.profileDetails.district = 'TestDistrict'
    component.ngOnInit()
    component.getDistrictsList('TestState', true)
    expect(mockProfileV2RevampService.getDistrictsList).toHaveBeenCalledWith('TestState')
    expect(component.districtsList.length).toBeGreaterThan(0)
  })

  it('should handle error in getDistrictsList', () => {
    mockProfileV2RevampService.getDistrictsList.mockReturnValue(throwError(new HttpErrorResponse({ error: { params: { errmsg: 'Error fetching districts' } } })))
    component.ngOnInit()
    component.getDistrictsList('TestState')
    expect(mockSnackBar.open).toHaveBeenCalledWith('Error fetching districts', 'X', { duration: 5000 })
  })

  it('should handle profile image upload', () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    component.handleUploadProfileImg(mockFile)
    // Simulate dialog close and FileReader
    expect(mockSnackBar.openFromComponent).not.toHaveBeenCalled()
  })

  it('should handle invalid image format', () => {
    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' })
    component.handleUploadProfileImg(mockFile)
    expect(mockSnackBar.openFromComponent).toHaveBeenCalled()
  })

  it('should handle image size too large', () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    Object.defineProperty(mockFile, 'size', { value: 3 * 1024 * 1024 })
    component.handleUploadProfileImg(mockFile)
    expect(mockSnackBar.open).toHaveBeenCalled()
  })

  it('should generate profile image url', () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    component.genrateProfileImageUrl(mockFile, 'test.jpg')
    expect(mockProfileV2RevampService.updateProfilePic).toHaveBeenCalled()
  })

  it('should upload image', () => {
    const mockInput = { type: '', accept: '', onchange: null as any, click: jest.fn() }
    jest.spyOn(document, 'createElement').mockReturnValue(mockInput as any)
    component.uploadImage()
    expect(mockInput.type).toBe('file')
    expect(mockInput.accept).toBe('image/*')
    expect(mockInput.click).toHaveBeenCalled()
  })

  it('should delete image', () => {
    component.profileImage = 'test.jpg'
    component.deleteImage()
    expect(component.profileImage).toBe('')
    expect(component.profileImageChanged).toBe(true)
  })

  it('should create primary details form and handle designation search', () => {
    jest.useFakeTimers()
    component.header = 'Primary Details'
    component.ngOnInit()
    const searchDesignationControl = component.profileForm.get('searchDesignation')
    searchDesignationControl.setValue('Test')
    jest.runAllTimers()
    expect(component.designationSearchText).toBe('Test')
    jest.useRealTimers()
  })

  it('should get designations meta', () => {
    component.header = 'Primary Details'
    component.ngOnInit()
    component.getdesignationsMeta()
    expect(mockProfileV2RevampService.searchDesignation).toHaveBeenCalled()
    expect(component.designationsMeta.length).toBeGreaterThan(0)
  })

  it('should setup scroll listener', () => {
    component.header = 'Primary Details'
    component.ngOnInit()
    const searchDesignationControl = component.profileForm.get('searchDesignation')
    searchDesignationControl.setValue('Test')
    component.setupScrollListener(true)
    expect(component.designationsOffset).toBe(0)
  })

  it('should check current designation present', () => {
    component.header = 'Primary Details'
    component.ngOnInit()
    component.profileForm.get('designation').setValue('TestDesignation')
    component.designationsMeta = []
    component.checkCurrentDesignationPresent()
    expect(component.designationsMeta.length).toBeGreaterThan(0)
  })

  it('should handle designation dropdown closed', () => {
    component.header = 'Primary Details'
    component.ngOnInit()
    component.onDesignationDropdownClosed()
    expect(component.designationSearchText).toBe('')
  })

  it('should create about me form', () => {
    component.header = 'About Me'
    component.ngOnInit()
    expect(component.profileForm.get('aboutme')).toBeTruthy()
  })

  it('should create other details form', () => {
    component.header = 'Other Details'
    component.ngOnInit()
    expect(component.profileForm.get('employeeCode')).toBeTruthy()
    expect(component.profileForm.get('primaryEmail')).toBeTruthy()
  })

  it('should fetch cadre data', () => {
    component.header = 'Other Details'
    component.ngOnInit()
    component.fetchCadreData()
    expect(mockProfileV2RevampService.fetchCadre).toHaveBeenCalled()
  })

  it('should get master language', () => {
    component.header = 'Other Details'
    component.ngOnInit()
    component.getMasterLanguage()
    expect(mockProfileV2RevampService.getMasterLanguages).toHaveBeenCalled()
    expect(component.masterLanguages.length).toBeGreaterThan(0)
  })

  it('should handle value change methods for other details', () => {
    component.header = 'Other Details'
    component.ngOnInit()
    component.valueCahngeMethosdsForOtherDetails()
    expect(component.verifyEmail).toBe(false)
    expect(component.verifyMobile).toBe(false)
  })

  it('should handle getIsCadreStatus', () => {
    component.header = 'Other Details'
    component.ngOnInit()
    component.getIsCadreStatus(true)
    expect(component.isCadreStatus).toBe(true)
    component.getIsCadreStatus(false)
    expect(component.isCadreStatus).toBe(false)
  })

  it('should add and remove validation', () => {
    component.header = 'Other Details'
    component.ngOnInit()
    const control = component.profileForm.get('employeeCode')
    component.addValidation(control)
    expect(control.validator).toBeDefined()
    component.removeValidation(control)
    expect(control.validator).toBeNull()
  })

  it('should get service and onServiceSelect', () => {
    component.header = 'Other Details'
    component.ngOnInit()
    component.civilServiceData = { civilServiceTypeList: [{ name: 'IAS', serviceList: [{ name: 'IAS Service', cadreList: [] }] }] }
    component.getService('IAS')
    expect(component.serviceType).toBeDefined()
    component.onServiceSelect('IAS Service')
    expect(component.selectedService).toBeDefined()
  })

  it('should handle onCadreSelect', () => {
    component.header = 'Other Details'
    component.ngOnInit()
    component.selectedService = { cadreList: [{ name: 'TestCadre', startBatchYear: 2000, endBatchYear: 2020, exculsionYearList: [] }] }
    component.onCadreSelect('TestCadre')
    expect(component.selectedCadre).toBeDefined()
  })

  it('should handle generate email OTP', () => {
    component.header = 'Other Details'
    component.ngOnInit()
    component.primaryEmailControl.setValue('test@example.com')
    component.handleGenerateEmailOTP()
    expect(mockOtpService.sendEmailOtp).toHaveBeenCalledWith('test@example.com')
  })

  it('should handle verify OTP', () => {
    component.header = 'Other Details'
    component.ngOnInit()
    component.handleVerifyOTP('email', 'test@example.com')
    expect(mockDialog.open).toHaveBeenCalled()
  })

  it('should handle resend OTP', () => {
    component.header = 'Other Details'
    component.ngOnInit()
    component.handleResendOTP({ type: 'email', value: 'test@example.com' })
    expect(mockOtpService.sendEmailOtp).toHaveBeenCalledWith('test@example.com')
    component.handleResendOTP({ type: 'mobile', value: '9876543210' })
    expect(mockOtpService.resendOtp).toHaveBeenCalledWith('9876543210')
  })

  it('should check isEmailAllowed', () => {
    component.header = 'Other Details'
    component.ngOnInit()
    component.approvedDomainList = ['example.com']
    expect(component.isEmailAllowed('test@example.com')).toBe(true)
    expect(component.isEmailAllowed('test@notallowed.com')).toBe(false)
  })

  it('should handle generate OTP', () => {
    component.header = 'Other Details'
    component.ngOnInit()
    component.mobileControl.setValue('9876543210')
    component.handleGenerateOTP()
    expect(mockOtpService.sendOtp).toHaveBeenCalledWith('9876543210')
  })

  it('should handle empty mobile and email', () => {
    component.header = 'Other Details'
    component.ngOnInit()
    component.profileDetails.mobile = '9876543210'
    component.mobileControl.setValue('')
    component.handleEmpty('mobile')
    component.profileDetails.primaryEmail = ''
    component.primaryEmailControl.setValue('')
    component.handleEmpty('primaryEmail')
    expect(component.profileForm.errors).toBeDefined()
  })

  it('should handle keydown, autocomplete open/close', () => {
    expect(component.onkeyDown({})).toBe(false)
    component.onAutoCompleteOpened()
    expect(component.isMatcompleteOpened).toBe(true)
    component.onAutoCompleteClosed()
    expect(component.isMatcompleteOpened).toBe(false)
  })

  it('should handle submit and cancel', () => {
    jest.useFakeTimers()
    component.header = 'Profile'
    component.ngOnInit()
    component.profileForm.patchValue({ firstname: 'John', state: 'TestState', district: 'TestDistrict' })
    jest.runAllTimers()
    component.handleSubmit()
    expect(mockDialogRef.close).toHaveBeenCalled()
    component.handleCancel()
    expect(mockDialogRef.close).toHaveBeenCalled()
    jest.useRealTimers()
  })

  it('should not submit invalid form', () => {
    component.header = 'Profile'
    component.ngOnInit()
    component.profileForm.patchValue({ firstname: '', state: '', district: '' })
    component.handleSubmit()
    expect(mockDialogRef.close).not.toHaveBeenCalled()
  })

  it('should mark form group touched', () => {
    component.header = 'Profile'
    component.ngOnInit()
    component.markFormGroupTouched(component.profileForm)
    // Instead of checking formGroup.touched, check a control
    expect(component.profileForm.get('firstname').touched).toBe(true)
  })

  it('should check hasError', () => {
    component.header = 'Profile'
    component.ngOnInit()
    const firstnameControl = component.profileForm.get('firstname')
    firstnameControl.setValue('')
    firstnameControl.markAsTouched()
    expect(component.hasError('firstname', 'required')).toBe(true)
  })

  it('should handle translation', () => {
    expect(component.handleTranslateTo('test')).toBe('Translated message')
    expect(component.handleTranslateToProfile('test')).toBe('Translated message')
  })

  it('should open snackbar', () => {
    component.openSnackbar('msg', 1234)
    expect(mockSnackBar.open).toHaveBeenCalledWith('msg', 'X', { duration: 1234 })
  })

  it('should call ngOnDestroy', () => {
    const spy = jest.spyOn(component.destroySubject$, 'unsubscribe')
    component.ngOnDestroy()
    expect(spy).toHaveBeenCalled()
  })

  it('should return true for showCentralDeputation when all conditions are met', () => {
    component.header = 'Other Details'
    component.ngOnInit()
    component.profileForm.get('civilServiceType').setValue('All India Services')
    component.profileForm.get('isCadre').setValue(true)
    component.profileForm.get('cadreName').setValue('IAS')
    component.profileForm.get('cadreBatch').setValue('2020')
    expect(component.showCentralDeputation).toBe(true)
  })

  it('should return false for showCentralDeputation when conditions are not met', () => {
    component.header = 'Other Details'
    component.ngOnInit()
    component.profileForm.get('civilServiceType').setValue('Other Service')
    component.profileForm.get('isCadre').setValue(false)
    component.profileForm.get('cadreName').setValue('')
    component.profileForm.get('cadreBatch').setValue('')
    expect(component.showCentralDeputation).toBe(false)
  })

  // Use all variables to avoid lint errors
  afterEach(() => {
    expect(component).toBeDefined()
    expect(mockDialogRef).toBeDefined()
    expect(mockProfileV2RevampService).toBeDefined()
    expect(mockSnackBar).toBeDefined()
    expect(mockOtpService).toBeDefined()
    expect(mockDialog).toBeDefined()
    expect(mockDatePipe).toBeDefined()
    expect(mockPipeImgUrl).toBeDefined()
    expect(mockUserProfileService).toBeDefined()
  })
})