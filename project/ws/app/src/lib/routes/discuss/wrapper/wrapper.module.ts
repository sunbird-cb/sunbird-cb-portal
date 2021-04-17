import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DiscussionUiModule } from '@project-sunbird/discussions-ui-v8'

import { CsModule } from '@project-sunbird/client-services'

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        DiscussionUiModule,
    ],
    exports: [DiscussionUiModule],
})
export class WrapperModule {
    processed: any
    constructor() {

        const lastSaved = localStorage.getItem('kc')
        if (lastSaved) {
            this.processed = JSON.parse(lastSaved)
        }
        const locationOrigin = location.origin

        CsModule.instance.init({
            core: {
                httpAdapter: 'HttpClientBrowserAdapter',
                global: {
                    channelId: '', // required
                    producerId: '', // required
                    deviceId: '', // required
                    sessionId: '',
                },
                api: {
                    host: `${locationOrigin}/apis/proxies/v8`, // default host
                    // host: 'http://localhost:3004/proxies/v8', // default host
                    // host: 'http://localhost:3002', // default host
                    authentication: {
                        // bearerToken: "", // optional
                        // userToken: "5574b3c5-16ca-49d8-8059-705304f2c7fb"
                        bearerToken: this.processed.token,
                        // optional
                    },
                },
            },
            services: {
                groupServiceConfig: {
                    apiPath: '/learner/group/v1',
                    dataApiPath: '/learner/data/v1/group',
                    updateGroupGuidelinesApiPath: '/learner/group/membership/v1',
                },
                userServiceConfig: {
                    apiPath: '/learner/user/v2',
                },
                formServiceConfig: {
                    apiPath: '/learner/data/v1/form',
                },
                courseServiceConfig: {
                    apiPath: '/learner/course/v1',
                    certRegistrationApiPath: '/learner/certreg/v2/certs',
                },
                discussionServiceConfig: {
                    apiPath: '/discussion',
                },
            },
        })
    }
}
