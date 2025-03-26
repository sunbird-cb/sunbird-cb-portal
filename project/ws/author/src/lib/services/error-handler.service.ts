import { ErrorHandler, Injectable } from '@angular/core'
import { LoggerService } from '@sunbird-cb/utils-v2'
import { LoaderService } from './loader.service'

@Injectable()
export class AuthoringErrorHandler implements ErrorHandler {

  constructor(
    private loaderService: LoaderService,
    private loggerService: LoggerService,
  ) { }

  handleError(error: any) {
    this.loaderService.changeLoad.next(false)
    this.loggerService.error(error)
  }
}
