import { Subject } from 'rxjs'

export class PdfScormDataService {
  handleBackFromPdfScormFullScreen = new Subject()
  handlePdfMarkComplete = new Subject()
  constructor() { }
}
