import { AfterViewChecked, ChangeDetectorRef, OnDestroy, Component, OnInit } from '@angular/core'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { Subscription } from 'rxjs'
import { ValueService } from '@sunbird-cb/utils-v2'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { RootService } from 'src/app/component/root/root.service'
import { TStatus, ViewerDataService } from '@ws/viewer/src/lib/viewer-data.service'
import { ActivatedRoute, Router } from '@angular/router'

// import { Router } from '@angular/router';
// import { CompetenciesAssessmentComponent } from '../../components/competencies-assessment/competencies-assessment.component';

export enum ErrorType {
  accessForbidden = 'accessForbidden',
  notFound = 'notFound',
  internalServer = 'internalServer',
  serviceUnavailable = 'serviceUnavailable',
  somethingWrong = 'somethingWrong',
  mimeTypeMismatch = 'mimeTypeMismatch',
  previewUnAuthorised = 'previewUnAuthorised',
}

@Component({
  selector: 'ws-app-competency-test',
  templateUrl: './competence-test.component.html',
  styleUrls: ['./competence-test.component.scss'],
  // tslint:disable-next-line
  host: { class: 'competency_main_test_wrapper' },
})
export class CompetencyTestComponent implements OnInit, OnDestroy, AfterViewChecked {
  fullScreenContainer: HTMLElement | null = null
  forPreview = window.location.href.includes('/author/')
  private isLtMedium$ = this.valueSvc.isLtMedium$
  assessmentId: string | null = this.route.snapshot.params['assessmentId']
  sideNavBarOpened = false
  mode: 'over' | 'side' = 'side'
  private screenSizeSubscription: Subscription | null = null
  private resourceChangeSubscription: Subscription | null = null
  status: TStatus = 'none'
  error: any | null = null
  errorType = ErrorType
  errorWidgetData: NsWidgetResolver.IRenderConfigWithTypedData<any> = {
    widgetType: 'errorResolver',
    widgetSubType: 'errorResolver',
    widgetData: {
      errorType: '',
    },
  }
  assessmentData: any
  constructor(
    public dialog: MatDialog,
    private valueSvc: ValueService,
    private rootSvc: RootService,
    private changeDetector: ChangeDetectorRef,
    private dataSvc: ViewerDataService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.route.params.subscribe(params => {
      this.assessmentId = params['assessmentId']
    })
    this.assessmentData = this.route.snapshot.data.compAssData.data
  }

  ngOnInit() {
    // const dialogRef = this.dialog.open(CompetenciesAssessmentComponent, {
    //     minHeight: '100vh',
    //     width: '100%',
    //     panelClass: 'remove-pad',
    //     data: {},
    // });
    // // const instance = dialogRef.componentInstance;
    // //   instance.isUpdate = true;
    // dialogRef.afterClosed().subscribe((response: any) => {
    //     console.log(response)
    //     this.router.navigate(['app', 'competencies', 'all', 'list'])
    // })

    this.screenSizeSubscription = this.isLtMedium$.subscribe(isSmall => {
      // this.sideNavBarOpened = !isSmall
      this.sideNavBarOpened = isSmall ? false : false
      this.mode = isSmall ? 'over' : 'side'
    })

    this.resourceChangeSubscription = this.dataSvc.changedSubject.subscribe(_ => {
      this.status = this.dataSvc.status
      this.error = this.dataSvc.error
      if (this.error && this.error.status) {
        switch (this.error.status) {
          case 403: {
            this.errorWidgetData.widgetData.errorType = ErrorType.accessForbidden
            break
          }
          case 404: {
            this.errorWidgetData.widgetData.errorType = ErrorType.notFound
            break
          }
          case 500: {
            this.errorWidgetData.widgetData.errorType = ErrorType.internalServer
            break
          }
          case 503: {
            this.errorWidgetData.widgetData.errorType = ErrorType.serviceUnavailable
            break
          }
          default: {
            this.errorWidgetData.widgetData.errorType = ErrorType.somethingWrong
            break
          }
        }
      }
      if (this.error && this.error.errorType === this.errorType.mimeTypeMismatch) {
        setTimeout(() => {
          this.router.navigate([this.error.probableUrl])
          // tslint:disable-next-line: align
        }, 3000)
      }
      if (this.error && this.error.errorType === this.errorType.previewUnAuthorised) {
      }
      // //console.log(this.error)
    })
  }

  ngAfterViewChecked() {
    const container = document.getElementById('fullScreenContainer')
    if (container) {
      this.fullScreenContainer = container
      this.changeDetector.detectChanges()
    } else {
      this.fullScreenContainer = null
      this.changeDetector.detectChanges()
    }
  }

  ngOnDestroy() {
    this.rootSvc.showNavbarDisplay$.next(true)
    if (this.screenSizeSubscription) {
      this.screenSizeSubscription.unsubscribe()
    }
    if (this.resourceChangeSubscription) {
      this.resourceChangeSubscription.unsubscribe()
    }
  }

  toggleSideBar() {
    this.sideNavBarOpened = !this.sideNavBarOpened
  }

}
