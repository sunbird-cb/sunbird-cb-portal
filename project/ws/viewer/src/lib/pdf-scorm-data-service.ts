import { Subject } from 'rxjs'
import { Injectable } from '@angular/core'

@Injectable()
export class PdfScormDataService {
  handleBackFromPdfScormFullScreen = new Subject()
  handlePdfMarkComplete = new Subject()
  constructor() { }
}
