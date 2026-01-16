import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'ws-app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements AfterViewInit {
    @ViewChild('descriptionElement') descriptionElement !: ElementRef
    @Input() description = ''
    @Input() minHeight = 56
    @Output() showViewMoreBtn = new EventEmitter<boolean>()

    // showViewMoreBtn = false

    ngAfterViewInit(): void {
      this.setViewMoreButton(); // Ensure the button is set after the view is initialized
    }


    setViewMoreButton() {
      if (this.description !== '') {
        if(this.descriptionElement && this.descriptionElement.nativeElement && this.descriptionElement.nativeElement.offsetHeight) {
          const showViewMoreBtn = this.descriptionElement.nativeElement.offsetHeight > this.minHeight ? true : false
          this.showViewMoreBtn.emit(showViewMoreBtn)
        }
      }
    }
}
