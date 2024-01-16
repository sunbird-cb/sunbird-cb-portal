import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-app-provider-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class ProviderLeftMenuComponent implements OnInit, OnDestroy {

  @Input()
  tabsData!: any
  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
  }
  ngOnDestroy() {

  }

  translateLabels(label: string, type: any) {
    label = label.toLowerCase();
    label = label.replace(/\s/g, "")
    const translationKey = type + '.' +  label;
    return this.translate.instant(translationKey);
  }

}
