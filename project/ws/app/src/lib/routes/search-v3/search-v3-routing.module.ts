import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { PageResolve } from '@sunbird-cb/utils-v2';
import { GlobalSearchComponent } from './routes/global-search/global-search.component';
import { CommonModule } from '@angular/common';
import { ShowAllComponent } from './routes/show-all/show-all.component';
// import { MyMdoResolveService } from '../network-v2/resolvers/my-mdo-resolve.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: GlobalSearchComponent,
    data: {
      pageType: 'feature',
      pageKey: 'search',
      pageId: '',
    },
    resolve: {
      // searchPageData: PageResolve,
      // recommendedPeople: MyMdoResolveService
    },
  },
  {
    path: 'all',
    component: ShowAllComponent,
    data: {
      pageType: 'feature',
      pageKey: 'search',
      pageId: '',
    },
    resolve: {
      // searchPageData: PageResolve,
      // recommendedPeople: MyMdoResolveService
    },
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class SearchV3RoutingModule {}
