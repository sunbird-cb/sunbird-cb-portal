import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
// tslint:disable-next-line
import _ from 'lodash';

@Component({
    selector: 'ws-app-welcome-onboard',
    templateUrl: './welcome-onboard.component.html',
    styleUrls: ['./welcome-onboard.component.scss'],
})
export class WelcomeOnboardComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute, private route: Router) {
        if (this.activatedRoute.snapshot) {
            const isSignuped = _.get(this.activatedRoute.snapshot, 'data.basicProfile.data.isUpdateRequired') || false
            if (isSignuped) {
                this.route.navigate(['public', 'welcome'])
            }
        }
    }

    ngOnInit() {
    }
}
