import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomeComponent } from './home/home.component'
import { HomeResolverService } from './home/home-resolver.service'
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: { home: HomeResolverService },
    data: {
      pageId: '',
      module: '',
    },
  },
]
@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [],
})
export class HomeRoutingModule { }
