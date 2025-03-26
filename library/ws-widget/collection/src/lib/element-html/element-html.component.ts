import { Component, OnInit, Input } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { IWidgetElementHtml } from './element-html.model'
import { SafeHtml, DomSanitizer } from '@angular/platform-browser'
import mustache from 'mustache'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import { TranslateService } from '@ngx-translate/core'
@Component({
  selector: 'ws-widget-element-html',
  templateUrl: './element-html.component.html',
  styleUrls: ['./element-html.component.scss'],
})
export class ElementHtmlComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<IWidgetElementHtml> {
  @Input() widgetData!: IWidgetElementHtml
  html: SafeHtml | null = null
  transilateObject: any
  constructor(
    private domSanitizer: DomSanitizer,
    private http: HttpClient,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService
  ) {
    super()
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      let lang = JSON.stringify(localStorage.getItem('websiteLanguage'))
      lang = lang.replace(/\"/g, '')
      this.translate.use(lang)
    }
  }

  async ngOnInit() {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8')
    if (this.widgetData.html) {
      this.transilateObject = this.transilateTo(this.widgetData.html)
      this.html = this.domSanitizer.bypassSecurityTrustHtml(this.transilateObject)
    } else if (this.widgetData.template && this.widgetData.templateData) {
      this.render(this.widgetData.template, this.widgetData.templateData)
    } else if (this.widgetData.template && this.widgetData.templateDataUrl) {
      try {
        const data = await this.http.get<any>(this.widgetData.templateDataUrl).toPromise()
        this.render(this.widgetData.template, data)
      } catch (er) { }
    } else if (this.widgetData.templateUrl && this.widgetData.templateData) {
      // For template, response needs to be modiefed
      const template = await this.http
        .get<string>(this.widgetData.templateUrl, {
          headers,
        })
        .toPromise()
      this.render(template, this.widgetData.templateData)
    } else if (this.widgetData.templateUrl && this.widgetData.templateDataUrl) {
      try {
        const [template, data] = await Promise.all([
          this.http.get<string>(this.widgetData.templateUrl, { headers }).toPromise(),
          this.http.get<any>(this.widgetData.templateDataUrl).toPromise(),
        ])
        this.render(template, data)
      } catch (er) { }
    }
  }

  render(template: string, templateData: any) {
    const data = {
      ...templateData,
      __pageBase: `.${location.pathname}`.split('#')[0],
    }
    this.html = this.domSanitizer.bypassSecurityTrustHtml(mustache.render(template, data))
  }

  transilateTo(data: any) {
    const splitedData = data.split('$$')
    const part1 = splitedData[0]
    const part2 = splitedData[1]
    const part3 = splitedData[2]
    const tranlatedValue = this.translateLabels(part2, 'contentstripmultiple')
    return `${part1}${tranlatedValue}${part3}`
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateActualLabel(label, type, '')
  }
}
