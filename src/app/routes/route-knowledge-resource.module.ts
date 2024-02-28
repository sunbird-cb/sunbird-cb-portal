import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { KnowledgeResourceModule } from '@ws/app/src/lib/routes/knowledge-resource/knowledge-resource.module'

@NgModule({
  imports: [
    CommonModule, KnowledgeResourceModule],
  exports: [KnowledgeResourceModule],
})
export class RouteKnowledgeResourceModule { }