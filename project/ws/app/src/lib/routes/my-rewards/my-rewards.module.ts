import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { BtnPageBackModule } from '@sunbird-cb/collection'
import { MyRewardsHomeComponent } from './components/my-rewards-home/my-rewards-home.component'
import { MyRewardsRoutingModule } from './my-rewards-routing.module'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'

@NgModule({
  declarations: [MyRewardsHomeComponent],
  imports: [
    CommonModule,
    MyRewardsRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    BtnPageBackModule,
  ], exports: [MyRewardsHomeComponent],
})
export class MyRewardsModule { }
