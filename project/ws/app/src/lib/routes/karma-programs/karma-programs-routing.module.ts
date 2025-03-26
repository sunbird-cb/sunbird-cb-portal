import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// import { KarmaProgramsFormV1Service } from './service/karma-programs-form-v1.service'
import { KarmaProgramsComponent } from './karma-programs/karma-programs.component'
// import { KarmaProgramsMicrositeV1Component } from './karma-programs-microsite-v1/karma-programs-microsite-v1.component'
import { KarmaProgramDataService } from './service/karma-program-data.service'
import { KarmaProgramsMicrositeV2Component } from './karma-programs-microsite-v2/karma-programs-microsite-v2.component'
import { KarmaProgramsFormV2Service } from './service/karma-programs-form-v2.service.'

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'all-programs',
    },
    {
        path: 'all-programs',
        component: KarmaProgramsComponent,
        data: {
            pageId: 'all-programs',
            module: 'Learn',
        },
        resolve: {
            programData: KarmaProgramDataService,
        },
    },
    // {
    //     path: ':programName/:playListKey/:orgId/micro-sites',
    //     component: KarmaProgramsMicrositeV1Component,
    //     data: {
    //         pageId: ':programName/:playListKey/:orgId/micro-sites',
    //         module: 'Learn',
    //     },
    //     resolve: {
    //         formData: KarmaProgramsFormV1Service,
    //     },
    // },
    {
        path: ':programName/:playListKey/:orgId/micro-sites',
        component: KarmaProgramsMicrositeV2Component,
        data: {
            pageId: ':programName/:playListKey/:orgId/micro-sites',
            module: 'Learn',
        },
        resolve: {
            formData: KarmaProgramsFormV2Service,
        },
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class KarmaProgramsRoutingModule { }
