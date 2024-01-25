import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'ws-widget-reviews-content',
  templateUrl: './reviews-content.component.html',
  styleUrls: ['./reviews-content.component.scss'],
})

export class ReviewsContentComponent implements OnInit {

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>
  clearIcon = false
  constructor(
    public dialogRef: MatDialogRef<ReviewsContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  handleCloseModal(): void {
    this.dialogRef.close()
  }

  handleFocus(): void {
    this.searchInput.nativeElement.focus()
  }

  handleClear(): void {
    this.clearIcon = false
    this.searchInput.nativeElement.value = ''
  }

  ngOnInit() {
  }

}
