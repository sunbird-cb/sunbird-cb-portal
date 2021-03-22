import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { DiscussComponent } from './routes/discuss-home/discuss.component'
import { DiscussTagsResolve } from './resolvers/discuss-tags-resolve'
import { DiscussCategoriesResolve } from './resolvers/discuss-category-resolve'
import { DiscussRecentResolve } from './resolvers/discuss-recent-resolve'
// import { DiscussCategoriesResolve } from './resolvers/discuss-category-resolve'
import { DiscussTopicResolve } from './resolvers/discuss-topic-resolve'
import { DiscussUnreadResolve } from './resolvers/discuss-unread-resolve'
import { DiscussProfileResolve } from './resolvers/discuss-profile-resolve'
import { DiscussTopicsComponent } from './routes/discuss-topics/discuss-topics.component'

const routes: Routes = [
  {
    path: 'home',
    component: DiscussComponent,
  },
  {
    path: 'test',
    component: DiscussTopicsComponent,
    resolve: {
      availCategories: DiscussCategoriesResolve,
      availableTags: DiscussTagsResolve,
      recent: DiscussRecentResolve,
      // unread: DiscussUnreadResolve,
    },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    DiscussTagsResolve,
    DiscussCategoriesResolve,
    DiscussRecentResolve,
    DiscussTopicResolve,
    DiscussUnreadResolve,
    DiscussProfileResolve,
  ],
})
export class TaxonomyRoutingModule { }
