import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AllResourceResolveService } from './resolvers/all-resources-resolver.service'
import { ResourceDetailResolveService } from './resolvers/resource-resolver.service'
import { SavedResourceResolveService } from './resolvers/saved-resource-resolver.services'
import { KnowledgeAllComponent } from './routes/knowledge-all/knowledge-all.component'
import { KnowledgeDetailComponent } from './routes/knowledge-detail/knowledge-detail.component'
import { KnowledgeHomeComponent } from './routes/knowledge-home/knowledge-home.component'
import { KnowledgeSavedComponent } from './routes/knowledge-saved/knowledge-saved.component'

const routes: Routes = [
  { path: '',
   component: KnowledgeHomeComponent,
   data: {
    pageId: '',
    module: 'Knowledge Resources',
  },

  children: [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'all',
    },
    {
      path: 'all',
      component: KnowledgeAllComponent,
      data: {
        pageId: 'all',
        module: 'Knowledge Resources',
      },
      resolve: {
        allResources : AllResourceResolveService,
      },
    },

    {
      path: 'saved',
      component: KnowledgeSavedComponent,
      data: {
        pageId: 'saved',
        module: 'Knowledge Resources',
      },
      resolve: {
        allSavedResources : SavedResourceResolveService,
      },
    },
    {
      path: 'all/:id/:type',
      component: KnowledgeDetailComponent,
      data: {
        pageId: 'id',
        module: 'Knowledge Resources',
      },
      resolve: {
        resourceDetail: ResourceDetailResolveService,
      },
    },
  ],
},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ResourceDetailResolveService,
    AllResourceResolveService,
    SavedResourceResolveService,
  ],
  // Don't forget to pass RouteResolver into the providers array
})
export class KnowledgeResourceRoutingModule { }
