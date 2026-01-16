import { WindowRef } from './WindowRef'
import { Injectable } from '@angular/core'

@Injectable()
export class BrowserWindowRef extends WindowRef {
  constructor() {
    super()
  }

  get nativeWindow(): Window | Object {
    return window
  }
}
