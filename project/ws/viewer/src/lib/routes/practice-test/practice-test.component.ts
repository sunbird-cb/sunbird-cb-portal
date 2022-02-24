import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { AccessControlService } from '@ws/author/src/public-api'
@Component({
    selector: 'viewer-practice',
    templateUrl: './practice-test.component.html',
    styleUrls: ['./practice-test.component.scss'],
})
export class PracticeTestComponent implements OnInit {
    isPreviewMode = false
    forPreview = window.location.href.includes('/author/')
    constructor(
        private activatedRoute: ActivatedRoute,
        private accessControlSvc: AccessControlService,
    ) {

    }
    ngOnInit(): void {
        if (
            this.activatedRoute.snapshot.queryParamMap.get('preview') &&
            !this.accessControlSvc.authoringConfig.newDesign
        ) {
            this.isPreviewMode = true
        }
    }

}
