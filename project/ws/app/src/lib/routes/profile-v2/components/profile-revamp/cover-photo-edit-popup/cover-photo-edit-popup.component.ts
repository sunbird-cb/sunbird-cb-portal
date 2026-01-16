import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA, MatLegacyDialogRef } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { IMAGE_SIZE_1MB } from '../../../models/profile-revamp.model';

@Component({
  selector: 'ws-app-cover-photo-edit-popup',
  templateUrl: './cover-photo-edit-popup.component.html',
  styleUrls: ['./cover-photo-edit-popup.component.scss']
})
export class CoverPhotoEditPopupComponent implements OnInit {
  //#region (global variables)
  coverPhotoUrl = '';
  imageChangedEvent: any = '';
  showCropper = false; // Changed to false initially
  cropperPosition = {
    x1: 0,
    y1: 0,
    x2: 858,
    y2: 215
  };
  imageFile: File | null = null;
  fileName = ''
  uploadImage = true
  //#endregion (global variables)

  constructor(
    private dialogRef: MatLegacyDialogRef<CoverPhotoEditPopupComponent>,
    @Inject(MAT_LEGACY_DIALOG_DATA) public data: any,
    private snackBar: MatLegacySnackBar,
  ) { }

  ngOnInit(): void {
    if (this.data && this.data.coverPhotoUrl) {
      this.coverPhotoUrl = this.data.coverPhotoUrl;
      // this.loadImageFromUrl(this.coverPhotoUrl);
    }
  }

  // private async loadImageFromUrl(url: string): Promise<void> {
  //   try {
  //     const response = await fetch(url);
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
      
  //     const blob = await response.blob();
  //     const file = new File([blob], 'coverPhoto.png', { type: 'image/png' });
      
  //     this.imageChangedEvent = { 
  //       target: { 
  //         files: [file] 
  //       } 
  //     };
  //     this.fileName = file.name;
      
  //     // Wait for next tick to ensure image is loaded
  //     setTimeout(() => {
  //       this.showCropper = true;
  //     });
  //   } catch (error) {
  //     console.error('Error loading image:', error);
  //     this.showCropper = false;
  //   }
  // }

  onFileChange(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0]

      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.snackBar.open('Only png, jpg, jpeg, svg, webp image types are supported', 'X', {
          duration: 1500,
        })
        return
      }
      if (file.size > IMAGE_SIZE_1MB * 2) { // 2MB
        this.snackBar.open('Maximum upload file size: 2MB', 'X', {
          duration: 1500,
        })
        return
      }
      if (file.type === 'image/svg+xml') {
      // Convert SVG to PNG for cropping
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const svgData = e.target.result;
        this.convertSvgToPng(svgData).then((pngDataUrl: any) => {
          this.imageChangedEvent = { target: { files: [this.dataURLtoFile(pngDataUrl, 'converted-image.png')] } };
          this.showCropper = true;
        });
      };
      reader.readAsText(file);
    } else {
      // Handle PNG/JPEG files directly
      this.imageChangedEvent = event;
      this.showCropper = true;
    }
      this.fileName = event.target.files[0].name || 'coverPhoto.png';
      this.uploadImage = false
    }
  }

  private convertSvgToPng(svgData: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });
}

private dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || '';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

  imageCropped(event: ImageCroppedEvent) {
    const base64 = event.base64;
    this.uploadImage = true
    if (base64) {
      this.coverPhotoUrl = base64;
      this.imageFile = this.base64ToFile(base64, this.fileName || 'coverPhoto.png');
    }
  }

  private base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || '';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

  applyChanges() {
    // Handle saving the cropped image
    this.showCropper = false;
    this.closePopup(true);
  }

  closePopup(isUpdated = false) {
    const croppedImage = {
      isUpdated: isUpdated,
      coverPhotoUrl: this.coverPhotoUrl,
      file : this.imageFile
    }
    this.dialogRef.close(croppedImage);
  }

  deleteCoverPhoto() {
    this.coverPhotoUrl = '';
    this.imageFile = null;
    this.fileName = '';
    this.showCropper = false;
    this.uploadImage = true;
  }

}
