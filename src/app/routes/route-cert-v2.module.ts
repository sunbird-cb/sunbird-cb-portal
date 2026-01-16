import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CertificateModuleV2 } from '@ws/app'

@NgModule({
  imports: [CommonModule, CertificateModuleV2],
  exports: [CertificateModuleV2],
})
export class RouteCertificateV2Module {

}
