import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { MultilingualTranslationsService } from '@sunbird-cb/utils/src/public-api'

@Component({
  selector: 'ws-app-provider-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class ProviderLeftMenuComponent implements OnInit, OnDestroy {

  @Input()
  tabsData!: any
  constructor(private langtranslations: MultilingualTranslationsService) { }

  ngOnInit(): void {
  }
  ngOnDestroy() {

  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }

}
