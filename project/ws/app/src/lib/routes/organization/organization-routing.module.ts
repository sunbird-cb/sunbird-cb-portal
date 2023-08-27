import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageResolve } from '@sunbird-cb/utils/src/public-api';
import { OrganizationHomeComponent } from './routes/organization-home/organization-home.component';


const routes: Routes = [
  {
    path: ':orgName',
    pathMatch: 'full',
    component: OrganizationHomeComponent,
    data: {
      pageType: 'feature',
      pageKey: 'search',
      pageId: '',
    },
    resolve: {
      searchPageData: PageResolve,
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule { }
