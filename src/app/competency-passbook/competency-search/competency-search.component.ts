import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, EventEmitter, Output } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { MultilingualTranslationsService } from '@sunbird-cb/utils/src/public-api'
import { fromEvent } from 'rxjs'
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators'

@Component({
  selector: 'ws-competency-search',
  templateUrl: './competency-search.component.html',
  styleUrls: ['./competency-search.component.scss'],
})

export class CompetencySearchComponent implements OnInit, AfterViewInit {

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>
  clearIcon = false
  @Output() searchValue = new EventEmitter<string>()
  @Output() enableFilter = new EventEmitter<boolean>()
  constructor(private translate: TranslateService, private langtranslations: MultilingualTranslationsService,) {
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        // get value
        map((event: any) => {
          return event.target.value.trim()
        }),
        // Time in milliseconds between key events
        debounceTime(250),
        // If previous query is diffent from current
        distinctUntilChanged(),
        // subscription for response
      )
      .subscribe((text: string) => {
        // tslint:disable-next-line
        text = text.trim()
        this.clearIcon = (text.length) ? true : false
        this.searchValue.emit(text)
      })
  }

  handleFocus(): void {
    this.searchInput.nativeElement.focus()
  }

  handleFilter(): void {
    this.enableFilter.emit(true)
  }

  handleClear(): void {
    this.clearIcon = false
    this.searchInput.nativeElement.value = ''
    this.searchValue.emit('')
  }
}
