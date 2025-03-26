import { Component, OnInit, OnDestroy } from '@angular/core'
// import { ConfigurationsService, NsPage } from '@sunbird-cb/utils-v2'
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
        // private router: Router,
        private httpClient: HttpClient,
        // private authSvc: AuthKeycloakService,
    ) { }

    ngOnInit() {
        this.subscriptionContact = this.activateRoute.queryParamMap.subscribe((response: Params) => {
            this.data = _.get(response, 'params')
            const code = _.get(this.data, 'code')
            // const authuser = _.get(this.data, 'authuser')
            // const hd = _.get(this.data, 'hd')
            // const prompt = _.get(this.data, 'prompt')
            // const scope = _.get(this.data, 'scope')
            const state = _.get(this.data, 'state')
            // tslint:disable-next-line
            // console.log(`/apis/public/v8/google/callback?code=${code}&scope=${scope}&authuser=${authuser}&hd=${hd}&prompt=${prompt}`)
            if (code) {
                this.httpClient.get(`/apis/public/v8/parichay/callback`, { params: { code, state } }).subscribe(rData => {
                    // tslint:disable-next-line
                    console.log(rData)
                })
            }
            // this.router.navigate(['public', 'welcome'])
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
