import { Component, OnInit, OnDestroy } from '@angular/core'
// import { ConfigurationsService, NsPage } from '@sunbird-cb/utils'
import { Subscription } from 'rxjs'
import { ActivatedRoute, Params } from '@angular/router'
import { HttpClient } from '@angular/common/http'
// tslint:disable-next-line
import _ from 'lodash'

@Component({
    selector: 'public-login-w',
    templateUrl: './public-login-w.component.html',
    styleUrls: ['./public-login-w.component.scss'],
})
export class PublicLoginWComponent implements OnInit, OnDestroy {
    userMail = ''
    data: any
    platform = 'Learner'
    private subscriptionContact: Subscription | null = null
    constructor(
        private activateRoute: ActivatedRoute,
        private httpClient: HttpClient,
        // private authSvc: AuthKeycloakService,
    ) { }

    ngOnInit() {
        this.subscriptionContact = this.activateRoute.queryParamMap.subscribe((response: Params) => {
            this.data = response.get('params')
            // tslint:disable-next-line
            console.log(response.params)
            this.httpClient.get(`/apis/public/v8/google/callback?code=${_.get(response, 'params.code')}`).subscribe(rData => {
                // tslint:disable-next-line
                console.log(rData)
            })
        })
    }
    ngOnDestroy() {
        if (this.subscriptionContact) {
            this.subscriptionContact.unsubscribe()
        }
    }
    login() {
        const host = window.location.origin
        window.location.href = `${host}/protected/v8/resource`
        // window.location.reload()
    }
}
