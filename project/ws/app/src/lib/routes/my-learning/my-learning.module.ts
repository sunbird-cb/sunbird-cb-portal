import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import {
  MatButtonModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
} from '@angular/material'
import { MatCardModule } from '@angular/material/card'
import { MatSidenavModule } from '@angular/material/sidenav'
import { BtnPageBackModule, CardContentModule } from '@sunbird-cb/collection'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { MyLearningRoutingModule } from './my-learning-routing.module'
import { HomeComponent } from './routes/home/home.component'
import { CardContentV2Module } from '@sunbird-cb/collection/src/lib/card-content-v2/card-content-v2.module'
@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    MyLearningRoutingModule,
    MatCardModule,
    MatSidenavModule,
    CardContentModule,
    CardContentV2Module,
    MatToolbarModule,
    WidgetResolverModule,
    MatButtonModule,
    MatIconModule,
    BtnPageBackModule,
    MatProgressSpinnerModule,
  ],
})
export class MyLearningModule {}
