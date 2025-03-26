import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// import { MdoChannelsMicrositeComponent } from './mdo-channels-microsite/mdo-channels-microsite.component'
import { MdoChannelsComponent } from './mdo-channels/mdo-channels.component'
import { MdoChannelFormService } from './service/mdo-channel-form.service'
import { MdoChannelDataService } from './service/mdo-channel-data.service'
import { MdoChannelsAllContentComponent } from './mdo-channels-all-content/mdo-channels-all-content.component'
import { MdoChannelsMicrositeV2Component } from './mdo-channels-microsite-v2/mdo-channels-microsite-v2.component'

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'all-channels',
    },
    {
        path: 'all-channels',
        component: MdoChannelsComponent,
        data: {
            pageId: 'all-channels',
            module: 'Learn',
        },
        resolve: {
            channelData: MdoChannelDataService,
        },
    },
    // {
    //     path: ':channel/:orgId/micro-sites',
    //     component: MdoChannelsMicrositeComponent,
    //     data: {
    //         pageId: ':channel/:orgId/micro-sites',
    //         module: 'Learn',
    //     },
    //     resolve: {
    //         formData: MdoChannelFormService,
    //     },
    // },

    {
        path: ':channel/:orgId/micro-sites',
        component: MdoChannelsMicrositeV2Component,
        data: {
            pageId: ':channel/:orgId/v2/micro-sites',
            module: 'Learn',
        },
        resolve: {
            formData: MdoChannelFormService,
        },
    },
    {
        path: ':channel/:orgId/all-content',
        component: MdoChannelsAllContentComponent,
        data: {
          pageId: 'all-content',
          module: 'explore',
        },
      },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MdoChannelsRoutingModule { }
