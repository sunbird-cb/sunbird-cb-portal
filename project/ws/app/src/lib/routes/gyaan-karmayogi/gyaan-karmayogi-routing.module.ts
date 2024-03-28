import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GyaanKarmayogiHomeComponent } from './components/gyaan-karmayogi-home/gyaan-karmayogi-home.component';
import { GyaanResolverService } from './resolver/gyaan-resolver.service';


const routes: Routes = [
  { path: '',
   component: GyaanKarmayogiHomeComponent,
   data: {
    key: 'tenant-admin',
  },
  resolve: {
    featureData: GyaanResolverService,
  },

  children: [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'all',
    },
    {
      path: 'all',
      component: GyaanKarmayogiHomeComponent,
      data: {
        pageId: 'all',
        module: 'Knowledge Resources',
      },
      // resolve: {
      //   allResources : AllResourceResolveService,
      // },
    }
  ],
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GyaanKarmayogiRoutingModule { }
