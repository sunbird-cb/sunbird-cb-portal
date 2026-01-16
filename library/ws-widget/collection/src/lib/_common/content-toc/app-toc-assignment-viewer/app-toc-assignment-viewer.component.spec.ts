import { AssignmentViewerComponent } from './app-toc-assignment-viewer.component'

describe('AssignmentViewerComponent', () => {
  let component: AssignmentViewerComponent
  let mockRouter: any
  let mockTocSvc: any
  let mockConfigSvc: any
  let mockSanitizer: any
  let mockDialogRef: any
  let mockDialogLegacy: any
  let mockSnackBar: any
  let mockData: any

  beforeEach(() => {
    mockRouter = { navigate: jest.fn() }
    mockTocSvc = {
      submitDraftAssignment: jest.fn().mockReturnValue({
        subscribe: (success: any) => success({ responseCode: 'OK' }),
      }),
      submitAssignment: jest.fn().mockReturnValue({
        subscribe: (success: any) => success({ responseCode: 'OK' }),
      }),
    }
    mockConfigSvc = {}
    mockSanitizer = {
      bypassSecurityTrustResourceUrl: jest.fn().mockImplementation((url: string) => url),
    }
    mockDialogRef = { close: jest.fn() }
    mockDialogLegacy = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue({
          subscribe: (fn: any) => fn(true),
        }),
      }),
    }
    mockSnackBar = { open: jest.fn() }

    mockData = {
      url: 'https://example.com/file.pdf',
      assessment: { formId: '123' },
    }

    component = new AssignmentViewerComponent(
      mockRouter,
      mockTocSvc,
      mockConfigSvc,
      mockSanitizer,
      mockDialogRef,
      mockData,
      mockDialogLegacy,
      mockSnackBar
    )
  })

  it('should create component', () => {
    expect(component).toBeTruthy()
  })

  it('should detect pdf file type and process URL', () => {
    component.data.url = 'https://example.com/sample.pdf'
    component.ngOnInit()
    expect(component.documentType).toBe('pdf')
    expect(mockSanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalled()
  })

  it('should detect docx file type and process URL', () => {
    jest.useFakeTimers()
    component.data.url = 'https://example.com/sample.docx'
    component.ngOnInit()
    jest.advanceTimersByTime(1000)
    expect(component.documentType).toBe('docx')
    expect(mockSanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalled()
  })

  it('should detect doc file type and process URL', () => {
    jest.useFakeTimers()
    component.data.url = 'https://example.com/sample.doc'
    component.ngOnInit()
    jest.advanceTimersByTime(1000)
    expect(component.documentType).toBe('doc')
  })

  it('should handle iframe load correctly', () => {
    component.loading = true
    component.onIframeLoad()
    expect(component.loading).toBe(false)
  })

  it('should handle iframe error correctly', () => {
    component.loading = true
    component.onIframeError()
    expect(component.error).toBe(true)
    expect(component.errorMessage).toBe('Failed to load the document')
  })

  it('should catch error in processDocumentUrl()', () => {
    component.documentType = 'pdf'
    mockSanitizer.bypassSecurityTrustResourceUrl.mockImplementation(() => {
      throw new Error('Mock error')
    })
    component.processDocumentUrl()
    expect(component.error).toBe(true)
    expect(component.errorMessage).toBe('Mock error')
  })

  it('should call submitAssignmentAsDraft() and open snackbar', () => {
    component.documentUrl = 'https://example.com/doc.pdf'
    component.submitAssignmentAsDraft()
    expect(mockTocSvc.submitDraftAssignment).toHaveBeenCalled()
    expect(mockSnackBar.open).toHaveBeenCalledWith('Assignment saved as a draft', 'X', { duration: 5000 })
    expect(mockDialogRef.close).toHaveBeenCalled()
  })

  it('should call submitAssignment()', () => {
    component.documentUrl = 'https://example.com/doc.pdf'
    component.submitAssignment()
    expect(mockTocSvc.submitAssignment).toHaveBeenCalled()
    expect(mockSnackBar.open).toHaveBeenCalledWith('Assignment Submitted Successfully', 'X', { duration: 5000 })
    expect(mockDialogRef.close).toHaveBeenCalled()
  })

  it('should handle error in submitAssignment()', () => {
    mockTocSvc.submitAssignment.mockReturnValue({
      subscribe: (error: any) => error('Some error'),
    })
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { })
    component.submitAssignment()
    expect(consoleSpy).toHaveBeenCalledWith('Error submitting assignment', 'Some error')
    expect(mockDialogRef.close).toHaveBeenCalled()
  })

  it('should handle handleClose()', () => {
    const spy = jest.spyOn(component, 'submitAssignmentAsDraft').mockImplementation(() => { })
    component.handleClose()
    expect(spy).toHaveBeenCalled()
  })

  it('should handle handleSubmitAssignment() with confirmation', () => {
    const spySubmit = jest.spyOn(component, 'submitAssignment').mockImplementation(() => { })
    component.handleSubmitAssignment()
    expect(spySubmit).toHaveBeenCalled()
  })

  it('should handle handleSubmitAssignment() when cancelled', () => {
    mockDialogLegacy.open.mockReturnValueOnce({
      afterClosed: jest.fn().mockReturnValue({
        subscribe: (fn: any) => fn(false),
      }),
    })
    const spyClose = jest.spyOn(mockDialogRef, 'close')
    component.handleSubmitAssignment()
    expect(spyClose).toHaveBeenCalled()
  })

  it('should call openSnackbar()', () => {
    component.openSnackbar('Test Message')
    expect(mockSnackBar.open).toHaveBeenCalledWith('Test Message', 'X', { duration: 5000 })
  })

  it('should handle ngAfterViewInit() without iframe', () => {
    component.docIframe = undefined
    component.ngAfterViewInit()
    expect(true).toBe(true) // No crash expected
  })

  it('should handle ngAfterViewInit() with iframe but no access', () => {
    const nativeElement: any = {
      contentDocument: undefined,
      contentWindow: { document: { createElement: jest.fn().mockReturnValue({}), head: { appendChild: jest.fn() } } },
    }
    component.docIframe = { nativeElement } as any
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { })
    component.ngAfterViewInit()
    expect(consoleSpy).toHaveBeenCalledWith('Cannot access iframe content due to security restrictions')
  })
})
