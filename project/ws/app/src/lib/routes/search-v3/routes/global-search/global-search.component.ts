import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NsContent } from '@sunbird-cb/collection/src/public-api';
import { ConfigurationsService, MultilingualTranslationsService } from '@sunbird-cb/utils-v2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ws-app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
})
export class GlobalSearchComponent implements OnInit {
  searchParam = { query: '', nlp: '', searchCategory: '' };
  userValue = '';
  searchparamFilters: any;
  filtersPanel!: string | null;
  selectedTab = 1;
  tabs = ['All', 'Learn', 'Network', 'Discuss', 'Careers'];
  compentencyKey!: NsContent.ICompentencyKeys;
  searchCategory: string = '';
  constructor(
    private activated: ActivatedRoute,
    private translate: TranslateService,
    private configService: ConfigurationsService,
    private router: Router,
    private langtranslations: MultilingualTranslationsService

  ) {
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      this.translate.setDefaultLang('hi')
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en');
      const lang = localStorage.getItem('websiteLanguage')!;
      this.translate.use(lang);
    }
  }

  ngOnInit() {
    this.compentencyKey =
      this.configService.compentency[environment.compentencyVersionKey];
    this.activated.queryParamMap.subscribe((queryParams) => {
      this.userValue = '';
      if (queryParams.has('tab')) {
        const tabn = queryParams.get('tab');
        this.tabs.forEach((t: any, index: number) => {
          if (t === tabn) {
            this.selectedTab = index;
          }
        });
      }
      if (queryParams.has('q')) {
        this.searchParam = {
          query: queryParams.get('q') || '',
          nlp: queryParams.get('search') || '',
          searchCategory: queryParams.get('category') || ''
        };
      }
      if (queryParams.has('t')) {
        this.searchParam = {
          query: 'moderatedCourses',
          nlp: queryParams.get('search') || '',
          searchCategory: queryParams.get('category') || ''

        };
        this.userValue = 'moderatedCourses';
      }
      if (queryParams.has('f')) {
        const sfilters = JSON.parse(queryParams.get('f') || '{}');
        const paramfilter = [
          {
            mainType: 'course',
            subType: sfilters?.primaryCategory
            ,
          }
        ];
        this.searchparamFilters = paramfilter;
      }

      if (queryParams.has('filtersPanel')) {
        this.filtersPanel = queryParams.get('filtersPanel');
      }

      
    });
  }

  translateTo(menuName: string): string {
    // tslint:disable-next-line: prefer-template
    const translationKey = 'globalsearch.' + menuName.replace(/\s/g, '');
    return this.translate.instant(translationKey);
  }

  filterSelectcategory(queryParams: any) {
    this.router.navigate([], {
      relativeTo: this.activated.parent,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
