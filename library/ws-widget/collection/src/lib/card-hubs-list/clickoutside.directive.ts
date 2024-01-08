import { Directive, ElementRef, Output, EventEmitter, HostListener, OnInit } from '@angular/core'
import { fromEvent } from 'rxjs'
import { take } from 'rxjs/operators'

@Directive({
  selector: '[wsWidgetClickOutside]',
})
export class ClickOutsideDirective implements OnInit {
  @Output() wsWidgetClickOutside = new EventEmitter()

  captured = false

  constructor(private elRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  onClick(target: any) {
    if (!this.captured) {
      return
    }

    if (!this.elRef.nativeElement.contains(target)) {
      this.wsWidgetClickOutside.emit()
    }
  }

  ngOnInit() {
    fromEvent(document, 'click', { capture: true })
      .pipe(take(1))
      .subscribe(() => (this.captured = true))
  }
}
