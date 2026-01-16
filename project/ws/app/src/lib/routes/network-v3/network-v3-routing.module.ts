import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NetworkComponent } from "./routes/network/network.component";
import { NetworkHomeComponent } from "./routes/network-home/network-home.component";
// import { UpdatesComponent } from "./routes/updates/updates.component";
import { ConnectionsComponent } from "./routes/connections/connections.component";
import { RecommendationsComponent } from "./routes/recommendations/recommendations.component";
import { MentorsComponent } from "./routes/mentors/mentors.component";
import { AllRecommendationsComponent } from "./components/all-recommendations/all-recommendations.component";

const routes: Routes = [
  {
    path: '',
    component: NetworkComponent,
    data: {
      pageId: '',
      module: 'Network',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        component: NetworkHomeComponent,
        data: {
          pageId: 'home',
          module: 'Network',
        }
      },
      // {
      //   path: 'updates',
      //   component: UpdatesComponent,
      //   data: {
      //     pageId: 'connections',
      //     module: 'Network',
      //   }
      // },
      {
        path: 'connections',
        component: ConnectionsComponent,
        data: {
          pageId: 'connections',
          module: 'Network',
        }
      },
      {
        path: 'recommendations',
        component: RecommendationsComponent,
        data: {
          pageId: 'recommendations',
          module: 'Network',
        }
      },
      {
        path: 'recommendations/all',
        component: AllRecommendationsComponent,
        data: {
          pageId: 'recommendations',
          module: 'Network',
          recommendationType: 'peopleYouMayKnow'
        }
      },
      {
        path: 'mentors',
        component: MentorsComponent,
        data: {
          pageId: 'mentors',
          module: 'Network',
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
  ],
})
export class NetworkV3RoutingModule { }