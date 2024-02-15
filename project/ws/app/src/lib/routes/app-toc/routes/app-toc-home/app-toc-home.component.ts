import { Component, OnInit, ComponentFactoryResolver, ViewChild, Input } from '@angular/core'
import { AppTocHomeDirective } from './app-toc-home.directive'
import { AppTocHomeService } from './app-toc-home.service'
import { TranslateService } from '@ngx-translate/core'

// import { TranslateService } from '@ngx-translate/core'
// import { MultilingualTranslationsService } from '@sunbird-cb/utils/src/public-api'
import { ConfigurationsService } from '@sunbird-cb/utils/src/public-api'
@Component({
  selector: 'ws-app-app-toc-home-root',
  templateUrl: './app-toc-home.component.html',
  styleUrls: ['./app-toc-home.component.scss'],
})
export class AppTocHomeComponent implements OnInit {
  @ViewChild(AppTocHomeDirective, { static: true }) wsAppAppTocHome!: AppTocHomeDirective
  @Input() forPreview:any
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appTocHomeSvc: AppTocHomeService,
    private translate: TranslateService,
    private configSvc:ConfigurationsService
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
    // this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    //   console.log('onLangChange', event)d
    // })
   }

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.appTocHomeSvc.getComponent())
    const viewContainerRef = this.wsAppAppTocHome.viewContainerRef
    viewContainerRef.clear()
    viewContainerRef.createComponent(componentFactory)
  }

  ngOnInit() {
    this.configSvc.languageTranslationFlag.subscribe(()=>{
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
    // this.loadComponent()
  }

  // translateLabels(label: string, type: any) {
  //   return this.langtranslations.translateLabel(label, type, '')
  // }
}
