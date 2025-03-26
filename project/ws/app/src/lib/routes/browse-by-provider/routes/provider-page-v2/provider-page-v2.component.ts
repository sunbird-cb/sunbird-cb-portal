import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'ws-app-provider-page-v2',
  templateUrl: './provider-page-v2.component.html',
  styleUrls: ['./provider-page-v2.component.scss'],
})
export class ProviderPageV2Component implements OnInit {

  providerName = ''
  providerId = ''
  sectionList: any = []
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school', disableTranslate: false },
    { title: `All Providers`,
      url: `/app/learn/browse-by/provider/all-providers`,
      icon: '', disableTranslate: true,
    },
  ]
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.route.snapshot.data && this.route.snapshot.data.formData
      && this.route.snapshot.data.formData.data
      && this.route.snapshot.data.formData.data.result
      && this.route.snapshot.data.formData.data.result.form
      && this.route.snapshot.data.formData.data.result.form.data
      && this.route.snapshot.data.formData.data.result.form.data.sectionList
    ) {
      this.sectionList = this.route.snapshot.data.formData.data.result.form.data.sectionList
    }
    this.route.params.subscribe(params => {
      this.providerName = params['provider']
      this.providerId = params['orgId']
      this.titles.push({
        title: this.providerName, icon: '', url: 'none', disableTranslate: true,
      })
    })
  }

}
