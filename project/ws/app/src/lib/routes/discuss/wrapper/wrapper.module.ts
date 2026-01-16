import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DiscussionEventsService, DiscussionUiModule } from '@sunbird-cb/discussions-ui-v8'
import { TelemetryService, EventService, WsEvents } from '@sunbird-cb/utils-v2'
// import {TelemetryService }
// import { ConfigService } from '../services/config.service'

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        DiscussionUiModule,
    ],
    exports: [DiscussionUiModule],
})
export class WrapperModule {
    // processed: any
    constructor(private discussionEventsService: DiscussionEventsService,
                private teleSvc: TelemetryService,
                private eventsSvc: EventService,

    ) {
        this.discussionEventsService.telemetryEvent.subscribe(data => {
            switch (data.eid) {
                case 'IMPRESSION':
                   this.teleSvc.impression({ pageId: data.edata.pageid,  module: WsEvents.EnumTelemetrymodules.DISCUSS })
                    break
                case 'INTERACT':
                    this.eventsSvc.raiseInteractTelemetry(
                        {
                            type: data.edata.type,
                            subType: data.edata.pageid,
                            id: 'discussion',
                        },
                        data.object,
                        {
                        pageId: data.edata.pageid,
                        module: WsEvents.EnumTelemetrymodules.DISCUSS,
                      })
                    break
            }
        })

        // const lastSaved = localStorage.getItem('kc')
        // if (lastSaved) {
        //     this.processed = JSON.parse(lastSaved)
        // }
        // const locationOrigin = location.origin

        // CsModule.instance.init({
        //     core: {
        //         httpAdapter: 'HttpClientBrowserAdapter',
        //         global: {
        //             channelId: '', // required
        //             producerId: '', // required
        //             deviceId: '', // required
        //             sessionId: '',
        //         },
        //         api: {
        //             host: `${locationOrigin}/apis/proxies/v8`, // default host
        //             // host: 'http://localhost:3004/proxies/v8', // default host
        //             // host: 'http://localhost:3002', // default host
        //             authentication: {
        //                 // bearerToken: "", // optional
        //                 // userToken: "5574b3c5-16ca-49d8-8059-705304f2c7fb"
        //                 bearerToken: this.processed.token,
        //                 // optional
        //             },
        //         },
        //     },
        //     services: {
        //         groupServiceConfig: {
        //             apiPath: '/learner/group/v1',
        //             dataApiPath: '/learner/data/v1/group',
        //             updateGroupGuidelinesApiPath: '/learner/group/membership/v1',
        //         },
        //         userServiceConfig: {
        //             apiPath: '/learner/user/v2',
        //         },
        //         formServiceConfig: {
        //             apiPath: '/learner/data/v1/form',
        //         },
        //         courseServiceConfig: {
        //             apiPath: '/learner/course/v1',
        //             certRegistrationApiPath: '/learner/certreg/v2/certs',
        //         },
        //         discussionServiceConfig: {
        //             apiPath: '/discussion',
        //         },
        //     },
        // })
    }
}
