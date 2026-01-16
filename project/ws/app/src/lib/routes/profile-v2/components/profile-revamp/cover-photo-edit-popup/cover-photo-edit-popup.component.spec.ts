import { CoverPhotoEditPopupComponent } from './cover-photo-edit-popup.component';

describe('CoverPhotoEditPopupComponent (Jest, no TestBed)', () => {
  let component: any;
  let mockDialogRef: any;
  let mockSnackBar: any;
  let mockData: any;

  beforeEach(() => {
    mockDialogRef = { close: jest.fn() };
    mockSnackBar = { open: jest.fn() };
    mockData = { coverPhotoUrl: 'http://test.com/photo.png' };
    component = new CoverPhotoEditPopupComponent(mockDialogRef, mockData, mockSnackBar);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set coverPhotoUrl from data in ngOnInit', () => {
    component.ngOnInit();
    expect(component.coverPhotoUrl).toBe('http://test.com/photo.png');
  });

  it('should not set coverPhotoUrl if data is missing', () => {
    const c: any = new CoverPhotoEditPopupComponent(mockDialogRef, {}, mockSnackBar);
    c.ngOnInit();
    expect(c.coverPhotoUrl).toBe('');
  });

  it('should handle onFileChange with unsupported file type', () => {
    const event = {
      target: {
        files: [{ type: 'application/pdf', size: 100, name: 'file.pdf' }]
      }
    };
    component.onFileChange(event);
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Only png, jpg, jpeg, svg, webp image types are supported',
      'X',
      { duration: 1500 }
    );
  });

  it('should handle onFileChange with file size > 2MB', () => {
    const event = {
      target: {
        files: [{ type: 'image/png', size: 3 * 1024 * 1024, name: 'big.png' }]
      }
    };
    // IMAGE_SIZE_1MB is 1048576, so 2MB = 2097152
    component.onFileChange(event);
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Maximum upload file size: 2MB',
      'X',
      { duration: 1500 }
    );
  });

  it('should handle onFileChange with PNG file', () => {
    const event = {
      target: {
        files: [{ type: 'image/png', size: 100, name: 'file.png' }]
      }
    };
    component.onFileChange(event);
    expect(component.imageChangedEvent).toBe(event);
    expect(component.showCropper).toBe(true);
    expect(component.fileName).toBe('file.png');
    expect(component.uploadImage).toBe(false);
  });

  it('should handle onFileChange with SVG file (simulate convertSvgToPng)', async () => {
    const file = { type: 'image/svg+xml', size: 100, name: 'file.svg' };
    const event = { target: { files: [file] } };
    // Mock FileReader and convertSvgToPng
    const mockReadAsText = jest.fn(function(this: any) {
      this.onload({ target: { result: '<svg></svg>' } });
    });
    (globalThis as any).FileReader = function() {
      this.readAsText = mockReadAsText;
      this.onload = () => {};
    };
    component.convertSvgToPng = jest.fn().mockResolvedValue('data:image/png;base64,abc');
    await component.onFileChange(event);
    expect(component.convertSvgToPng).toHaveBeenCalled();
    expect(component.showCropper).toBe(true);
  });

  it('should handle imageCropped with base64', () => {
    const event = { base64: 'data:image/png;base64,abc' };
    component.fileName = 'test.png';
    component.base64ToFile = jest.fn().mockReturnValue('fileObj');
    component.imageCropped(event);
    expect(component.coverPhotoUrl).toBe('data:image/png;base64,abc');
    expect(component.imageFile).toBe('fileObj');
    expect(component.uploadImage).toBe(true);
  });

  it('should handle imageCropped with no base64', () => {
    const event = { base64: '' };
    component.coverPhotoUrl = 'old';
    component.imageFile = 'oldFile';
    component.imageCropped(event);
    expect(component.coverPhotoUrl).toBe('old');
    expect(component.imageFile).toBe('oldFile');
    expect(component.uploadImage).toBe(true);
  });

  it('should call dialogRef.close with cropped image on closePopup', () => {
    component.coverPhotoUrl = 'url';
    component.imageFile = 'file';
    component.closePopup(true);
    expect(mockDialogRef.close).toHaveBeenCalledWith({
      isUpdated: true,
      coverPhotoUrl: 'url',
      file: 'file'
    });
  });

  it('should call dialogRef.close with isUpdated false if not passed', () => {
    component.coverPhotoUrl = 'url';
    component.imageFile = 'file';
    component.closePopup();
    expect(mockDialogRef.close).toHaveBeenCalledWith({
      isUpdated: false,
      coverPhotoUrl: 'url',
      file: 'file'
    });
  });

  it('should set showCropper false and call closePopup on applyChanges', () => {
    component.closePopup = jest.fn();
    component.showCropper = true;
    component.applyChanges();
    expect(component.showCropper).toBe(false);
    expect(component.closePopup).toHaveBeenCalledWith(true);
  });

  it('should reset fields on deleteCoverPhoto', () => {
    component.coverPhotoUrl = 'url';
    component.imageFile = 'file';
    component.fileName = 'name';
    component.showCropper = true;
    component.uploadImage = false;
    component.deleteCoverPhoto();
    expect(component.coverPhotoUrl).toBe('');
    expect(component.imageFile).toBeNull();
    expect(component.fileName).toBe('');
    expect(component.showCropper).toBe(false);
    expect(component.uploadImage).toBe(true);
  });

  // Use all variables to avoid lint errors
  afterEach(() => {});
});
