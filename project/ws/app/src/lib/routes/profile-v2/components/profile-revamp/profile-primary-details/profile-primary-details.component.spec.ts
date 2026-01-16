import { ProfilePrimaryDetailsComponent } from './profile-primary-details.component'
import { of, throwError } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'

describe('ProfilePrimaryDetailsComponent (Jest, no TestBed)', () => {
  let component: any
  let mockProfileV2RevampSvc: any
  let mockMatSnackBar: any
  let mockConfigService: any
  let mockDialog: any

  beforeEach(() => {
    mockProfileV2RevampSvc = {
      fetchApprovalDetails: jest.fn(),
      withDrawRequest: jest.fn(),
      handleTranslateTo: jest.fn().mockReturnValue('translated-text')
    }
    mockMatSnackBar = { open: jest.fn() }
    mockConfigService = {
      unMappedUser: {
        id: 'test-user-id',
        profileDetails: {
          profileStatus: 'active',
          employmentDetails: { departmentName: 'test-department' }
        }
      }
    }
    mockDialog = { open: jest.fn().mockReturnValue({ afterClosed: jest.fn().mockReturnValue(of(true)) }) }

    component = new ProfilePrimaryDetailsComponent(
      mockProfileV2RevampSvc,
      mockMatSnackBar,
      mockConfigService,
      mockDialog
    )

    component.primaryDetails = { group: 'Test Group', designation: 'Test Designation' }
    component.isCurrentUser = true
    component.enableWTR = false
    component.enableWR = false
    component.unVerifiedObj = {
      designation: 'Pending Designation',
      group: 'Pending Group',
      organization: 'Test Org',
      groupRequestTime: 1640995200000,
      designationRequestTime: 1640995200000
    }
    component.rejectedFields = {
      name: 'Rejected Name',
      group: 'Rejected Group',
      designation: 'Rejected Designation',
      groupRejectionComments: 'Group rejection reason',
      designationRejectionComments: 'Designation rejection reason',
      groupRejectionTime: 1640995200000,
      designationRejectionTime: 1640995200000
    }
    component.approvalPendingFields = [{ wfId: 'wf-001' }, { wfId: 'wf-002' }]
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should call getApprovedFields and set approval times', () => {
    const mockResponse = {
      result: {
        data: [
          { group: 'Test Group', lastUpdatedOn: 1640995200000 },
          { designation: 'Test Designation', lastUpdatedOn: 1640995300000 }
        ]
      }
    }
    mockProfileV2RevampSvc.fetchApprovalDetails.mockReturnValue(of(mockResponse))
    component.getApprovedFields()
    expect(mockProfileV2RevampSvc.fetchApprovalDetails).toHaveBeenCalledWith({
      serviceName: 'profile',
      applicationStatus: 'APPROVED'
    })
    expect(component.groupApprovedTime).toBe(1640995200000)
    expect(component.designationApprovedTime).toBe(1640995300000)
  })

  it('should handle error in getApprovedFields', () => {
    const error = new HttpErrorResponse({ error: 'err', status: 500, statusText: 'Internal Server Error' })
    mockProfileV2RevampSvc.fetchApprovalDetails.mockReturnValue(throwError(error))
    jest.spyOn(component as any, 'openSnackbar')
    component.getApprovedFields()
    expect((component as any).openSnackbar).toHaveBeenCalledWith('translated-text')
  })

  it('should emit openProfileEditDialog on editPrimaryDetails', () => {
    component.openProfileEditDialog = { emit: jest.fn() }
    component.editPrimaryDetails('header')
    expect(component.openProfileEditDialog.emit).toHaveBeenCalledWith('header')
  })

  describe('Computed properties', () => {
    it('showPrimaryDetailsEdit returns true when allowed', () => {
      component.enableWTR = false
      component.enableWR = false
      component.isCurrentUser = true
      component.isNotMyUser = false
      component.isIgotOrg = false
      expect(component.showPrimaryDetailsEdit).toBe(true)
    })
    it('showPrimaryDetailsEdit returns false when enableWTR is true', () => {
      component.enableWTR = true
      expect(component.showPrimaryDetailsEdit).toBe(false)
    })
    it('showPrimaryDetailsEdit returns false when isNotMyUser is true', () => {
      component.enableWTR = false
      component.enableWR = false
      component.isCurrentUser = true
      component.isNotMyUser = true
      component.isIgotOrg = false

      expect(component.showPrimaryDetailsEdit).toBe(false)
    })
    it('disablePrimaryDetailsEdit returns true when enableWTR and not both flags', () => {
      component.enableWTR = true
      component.isNotMyUser = false
      component.isIgotOrg = false
      expect(component.disablePrimaryDetailsEdit).toBe(true)
    })
    it('disablePrimaryDetailsEdit returns false when enableWTR is false', () => {
      component.enableWTR = false
      expect(component.disablePrimaryDetailsEdit).toBe(false)
    })
    it('disablePrimaryDetailsEdit returns false when both isNotMyUser and isIgotOrg are true', () => {
      component.enableWTR = true
      component.isNotMyUser = true
      component.isIgotOrg = true

      expect(component.disablePrimaryDetailsEdit).toBe(false)
    })
    it('showWithdrawRequestBtn returns true when allowed', () => {
      component.enableWR = true
      component.isCurrentUser = true
      component.isNotMyUser = false
      component.isIgotOrg = false
      expect(component.showWithdrawRequestBtn).toBe(true)
    })
    it('showWithdrawRequestBtn returns false when enableWR is false', () => {
      component.enableWR = false
      expect(component.showWithdrawRequestBtn).toBe(false)
    })
    it('showApprovalStatus returns true when groupApprovedTime < groupRejectionTime and isCurrentUser', () => {
      component.groupApprovedTime = 1
      component.rejectedFields.groupRejectionTime = 2
      component.isCurrentUser = true
      expect(component.showApprovalStatus).toBe(true)
    })
    it('showApprovalStatus returns true when designationApprovedTime < designationRequestTime and isCurrentUser', () => {
      component.designationApprovedTime = 1
      component.unVerifiedObj.designationRequestTime = 2
      component.isCurrentUser = true
      expect(component.showApprovalStatus).toBe(true)
    })
    it('showApprovalStatus returns false when isCurrentUser is false', () => {
      component.groupApprovedTime = 1
      component.rejectedFields.groupRejectionTime = 2
      component.isCurrentUser = false

      expect(component.showApprovalStatus).toBe(false)
    })
    it('showGroupPending returns true when pending', () => {
      component.groupApprovedTime = 1
      component.unVerifiedObj.groupRequestTime = 2
      component.rejectedFields.groupRejectionTime = 1
      component.unVerifiedObj.group = 'Pending Group'
      component.rejectedFields.designationRejectionTime = 0
      component.unVerifiedObj.designationRequestTime = 0
      expect(component.showGroupPending).toBe(true)
    })
    it('showGroupPending returns false when group is not set', () => {
      component.groupApprovedTime = 1
      component.unVerifiedObj.groupRequestTime = 2
      component.rejectedFields.groupRejectionTime = 1
      component.unVerifiedObj.group = ''

      expect(component.showGroupPending).toBe(false)
    })
    it('showGroupRejection returns true when rejected', () => {
      component.groupApprovedTime = 1
      component.rejectedFields.groupRejectionTime = 2
      component.unVerifiedObj.groupRequestTime = 1
      component.rejectedFields.group = 'Rejected Group'
      component.rejectedFields.designationRejectionTime = 0
      component.unVerifiedObj.designationRequestTime = 0
      expect(component.showGroupRejection).toBe(true)
    })
    it('showGroupRejection returns false when group rejection field is not set', () => {
      component.groupApprovedTime = 1
      component.rejectedFields.groupRejectionTime = 2
      component.unVerifiedObj.groupRequestTime = 1
      component.rejectedFields.group = ''

      expect(component.showGroupRejection).toBe(false)
    })
    it('showDesignationPending returns true when pending', () => {
      component.designationApprovedTime = 1
      component.unVerifiedObj.designationRequestTime = 2
      component.rejectedFields.designationRejectionTime = 1
      component.unVerifiedObj.designation = 'Pending Designation'
      component.rejectedFields.groupRejectionTime = 0
      component.unVerifiedObj.groupRequestTime = 0
      expect(component.showDesignationPending).toBe(true)
    })
    it('showDesignationPending returns false when designation is not set', () => {
      component.designationApprovedTime = 1
      component.unVerifiedObj.designationRequestTime = 2
      component.rejectedFields.designationRejectionTime = 1
      component.unVerifiedObj.designation = ''

      expect(component.showDesignationPending).toBe(false)
    })
    it('showDesignationRejection returns true when rejected', () => {
      component.designationApprovedTime = 1
      component.rejectedFields.designationRejectionTime = 2
      component.unVerifiedObj.designationRequestTime = 1
      component.rejectedFields.designation = 'Rejected Designation'
      component.rejectedFields.groupRejectionTime = 0
      component.unVerifiedObj.groupRequestTime = 0
      expect(component.showDesignationRejection).toBe(true)
    })
    it('showDesignationRejection returns false when designation rejection field is not set', () => {
      component.designationApprovedTime = 1
      component.rejectedFields.designationRejectionTime = 2
      component.unVerifiedObj.designationRequestTime = 1
      component.rejectedFields.designation = ''

      expect(component.showDesignationRejection).toBe(false)
    })
  })

  it('should open rejection reason dialog in viewReason', () => {
    component.dialog = { open: jest.fn() }
    component.viewReason('reason')
    expect(component.dialog.open).toHaveBeenCalled()
  })

  it('should open withdraw request dialog and handle response', () => {
    const dialogRef = { afterClosed: jest.fn().mockReturnValue(of(true)) }
    component.dialog = { open: jest.fn().mockReturnValue(dialogRef) }
    jest.spyOn(component, 'handleWithdrawRequest')
    component.showWithdrawRequestPopup()
    expect(component.dialog.open).toHaveBeenCalled()
    expect(dialogRef.afterClosed).toHaveBeenCalled()
    expect(component.handleWithdrawRequest).toHaveBeenCalled()
  })

  it('should not call handleWithdrawRequest if dialog returns false', () => {
    const dialogRef = { afterClosed: jest.fn().mockReturnValue(of(false)) }
    component.dialog = { open: jest.fn().mockReturnValue(dialogRef) }
    jest.spyOn(component, 'handleWithdrawRequest')
    component.showWithdrawRequestPopup()
    expect(component.handleWithdrawRequest).not.toHaveBeenCalled()
  })

  it('should handle withdraw request success', () => {
    component.approvalPendingFields = [{ wfId: 'wf-001' }]
    mockProfileV2RevampSvc.withDrawRequest.mockReturnValue(of({ success: true }))
    component.getApprovalStatus = { emit: jest.fn() }
    component.updateWithdrawalStatus = { emit: jest.fn() }
    jest.spyOn(component as any, 'openSnackbar')
    component.handleWithdrawRequest()
    expect(mockProfileV2RevampSvc.withDrawRequest).toHaveBeenCalled()
    expect(component.getApprovalStatus.emit).toHaveBeenCalledWith('withdraw')
    expect(component.unVerifiedObj.group).toBe('')
    expect(component.unVerifiedObj.designation).toBe('')
    expect((component as any).openSnackbar).toHaveBeenCalledWith('translated-text')
    expect(component.enableWR).toBe(false)
    expect(component.updateWithdrawalStatus.emit).toHaveBeenCalledWith(false)
  })

  it('should handle withdraw request error', () => {
    component.approvalPendingFields = [{ wfId: 'wf-001' }]
    const error = new HttpErrorResponse({ error: 'err', status: 500, statusText: 'Internal Server Error' })
    mockProfileV2RevampSvc.withDrawRequest.mockReturnValue(throwError(error))
    jest.spyOn(component as any, 'openSnackbar')
    component.handleWithdrawRequest()
    expect((component as any).openSnackbar).toHaveBeenCalledWith('translated-text')
  })

  it('should not call withDrawRequest if approvalPendingFields is empty', () => {
    component.approvalPendingFields = []
    component.handleWithdrawRequest()
    expect(mockProfileV2RevampSvc.withDrawRequest).not.toHaveBeenCalled()
  })

  it('should call handleTranslateTo', () => {
    mockProfileV2RevampSvc.handleTranslateTo.mockReturnValue('translated')
    const result = component.handleTranslateTo('menu')
    expect(mockProfileV2RevampSvc.handleTranslateTo).toHaveBeenCalledWith('menu')
    expect(result).toBe('translated')
  })

  it('should open snackbar with default duration', () => {
    const message = 'Test message'

    ;(component as any).openSnackbar(message)

    expect(mockMatSnackBar.open).toHaveBeenCalledWith(message, 'X', {
      duration: 5000
    })
  })

  it('should open snackbar with custom duration', () => {
    const message = 'Test message'
    const duration = 3000

    ;(component as any).openSnackbar(message, duration)

    expect(mockMatSnackBar.open).toHaveBeenCalledWith(message, 'X', {
      duration: 3000
    })
  })

  it('should handle empty approval data', () => {
    const mockResponse = {
      result: { data: [] }
    }
    mockProfileV2RevampSvc.fetchApprovalDetails.mockReturnValue(of(mockResponse))

    component.getApprovedFields()

    expect(component.groupApprovedTime).toBe(0)
    expect(component.designationApprovedTime).toBe(0)
  })

  it('should handle approval data without required properties', () => {
    const mockResponse = {
      result: {
        data: [
          { someOtherProperty: 'value', lastUpdatedOn: 1640995200000 }
        ]
      }
    }
    mockProfileV2RevampSvc.fetchApprovalDetails.mockReturnValue(of(mockResponse))

    component.getApprovedFields()

    expect(component.groupApprovedTime).toBe(0)
    expect(component.designationApprovedTime).toBe(0)
  })

  it('should handle empty approvalPendingFields array', () => {
    component.approvalPendingFields = []
    const mockResponse = { success: true }
    mockProfileV2RevampSvc.withDrawRequest.mockReturnValue(of(mockResponse))

    component.handleWithdrawRequest()

    expect(mockProfileV2RevampSvc.withDrawRequest).not.toHaveBeenCalled()
  })

  it('should handle undefined config service values', () => {
    mockConfigService.unMappedUser = undefined

    expect(() => component.ngOnInit()).toThrow()
  })
})