import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'ws-app-mdo-channels-microsite-v2',
  templateUrl: './mdo-channels-microsite-v2.component.html',
  styleUrls: ['./mdo-channels-microsite-v2.component.scss'],
})
export class MdoChannelsMicrositeV2Component implements OnInit {
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school', disableTranslate: false },
    {
      title: `MDO Channels`,
      url: `/app/learn/mdo-channels/all-channels`,
      icon: '', disableTranslate: true,
    },
  ]
  channnelName = ''
  orgId = ''
  sectionList: any = []
  constructor(
    private route: ActivatedRoute) {

  }

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
      this.channnelName = params['channel']
      this.orgId = params['orgId']
      this.titles.push({
        title: this.channnelName, icon: '', url: 'none', disableTranslate: true,
      })
    })
  }

}
