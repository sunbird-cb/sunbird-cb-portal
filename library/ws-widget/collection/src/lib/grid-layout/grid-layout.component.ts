import { HttpClient } from '@angular/common/http'
import { Component, OnInit, Input } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { ConfigurationsService } from '@sunbird-cb/utils/src/lib/services/configurations.service'
import { IUserProfileDetailsFromRegistry } from '@ws/app/src/lib/routes/user-profile/models/user-profile.model'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Router } from '@angular/router'
import {
  IGridLayoutData,
  IGridLayoutProcessedData,
  responsiveSuffix,
  sizeSuffix,
  IGridLayoutDataMain,
} from './grid-layout.model'
import _ from 'lodash'


const API_END_POINTS = {
  fetchProfileById: (id: string) => `/apis/proxies/v8/api/user/v2/read/${id}`
}


@Component({
  selector: 'ws-widget-grid-layout',
  templateUrl: './grid-layout.component.html',
  styleUrls: ['./grid-layout.component.scss'],
})

export class GridLayoutComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<IGridLayoutDataMain> {
    constructor(
      private router: Router,
      private configSvc: ConfigurationsService,
      private http: HttpClient,
    ) {
      super()
    }
      
  @Input() widgetData!: IGridLayoutDataMain
  containerClass = ''
  processed: IGridLayoutProcessedData[][] = []
  isNudgeOpen:boolean=true;

  ngOnInit() {
    this.fetchProfileById(this.configSvc.unMappedUser.id).subscribe(x=>{
      if(x.profileDetails.mandatoryFieldsExists){
        this.isNudgeOpen = false
      }
      
    })

    if (this.widgetData.gutter != null) {
      this.containerClass = `-mx-${this.widgetData.gutter}`
    }
    const gutterAdjustment = this.widgetData.gutter !== null ? `p-${this.widgetData.gutter}` : ''
    this.processed = this.widgetData.widgets.map(row =>
      row.map(
        (col: IGridLayoutData): IGridLayoutProcessedData => ({
          className: Object.entries(col.dimensions).reduce(
            (agg, [k, v]) =>
              `${agg} ${(responsiveSuffix as { [id: string]: string })[k]}:${sizeSuffix[v]}`,
            `${col.className} w-full ${gutterAdjustment}`,
          ),
          styles: col.styles,
          widget: col.widget,
        }),
      ),
    )
  }

  remindlater(){
    this.isNudgeOpen=false;
  }
  tracker(index: number, item: any) {
    if (index >= 0) { }
    return item
  }
  tracker2(index: number, item: any) {
    if (index >= 0) { }
    return item
  }

  fetchProfileById(id: any): Observable<any> {
    return this.http.get<[IUserProfileDetailsFromRegistry]>(API_END_POINTS.fetchProfileById(id))
      .pipe(map((res: any) => {
        return _.get(res, 'result.response')
      }))
  }
  fetchProfile()
  {
    this.router.navigate(['/app/user-profile/details'])
  }
}
