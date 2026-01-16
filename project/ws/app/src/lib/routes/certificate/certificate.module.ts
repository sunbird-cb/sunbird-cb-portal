import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CertificateRoutingModule } from './certificate-routing.module'
// import { SuiModalModule } from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms'
import { CertificateDetailsComponent } from './components/index'
import { CertificateService } from './services/certificate.service'
import { ApiService } from '@ws/author/src/public-api'
import { MatIconModule } from '@angular/material/icon'
// import { SharedModule } from '@sunbird/shared';
// import { TelemetryModule } from '@sunbird/telemetry';
// import { PlayerHelperModule } from '@sunbird/player-helper';

@NgModule({
  declarations: [
    CertificateDetailsComponent,
  ],
  imports: [
    CommonModule,
    // SuiModalModule,
    CertificateRoutingModule,
    FormsModule,
    // SharedModule,
    // TelemetryModule,
    // PlayerHelperModule,
    MatIconModule,
  ],
  providers: [CertificateService, ApiService],
})
export class CertificateModule { }
