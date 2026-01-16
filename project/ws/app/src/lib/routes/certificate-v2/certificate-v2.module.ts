import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CertificateV2RoutingModule } from './certificate-v2-routing.module'
import { FormsModule } from '@angular/forms'
import { CertificateDetailsComponent } from './components/index'
import { CertificateService } from './services/certificate.service'
import { ApiService } from '@ws/author/src/public-api'
import { MatIconModule } from '@angular/material/icon'

@NgModule({
  declarations: [
    CertificateDetailsComponent,
  ],
  imports: [
    CommonModule,
    CertificateV2RoutingModule,
    FormsModule,
    MatIconModule,
  ],
  providers: [CertificateService, ApiService],
})
export class CertificateModuleV2 { }
