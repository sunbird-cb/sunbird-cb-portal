import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
// tslint:disable-next-line
import _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import {
  ConfigurationsService,
  MultilingualTranslationsService,
} from '@sunbird-cb/utils-v2';
import {
  CATEGORY_TYPE,
} from '../../../../../../../author/src/lib/constants/constant';
import {
  Facet,
  FacetType,
  FormattedFacets,
  SearchCategory,
} from '../../models/search-v3.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { NsContent } from '@sunbird-cb/collection/src/public-api';
import { environment } from '../../../../../../../../../src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { MatRadioChange } from '@angular/material/radio';
@Component({
  selector: 'ws-app-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss'],
})
export class SearchFiltersComponent implements OnInit, OnDestroy, OnChanges {
  @Input() newfacets!: any;
  @Input() urlparamFilters!: any;
  @Output() appliedFilter = new EventEmitter<{ [key: string]: any }>();
  @Output() constructQueryParam = new EventEmitter<string>();
  @Output() applyFilterFromLearn = new EventEmitter<{ [key: string]: any }>();
  @Input() karmayogiBadge: any;
  competencyFactet: any;
  @Input() typesOfEvents: any;

  private subscription: Subscription = new Subscription();
  queryParams: any;

  categoryType = CATEGORY_TYPE;
  categoryTypeDup = CATEGORY_TYPE;
  categoryTypeEnum = SearchCategory;
  showAllLanguage = false;
  showAllContents = false;

  formattedFacets: any = {};
  selectedFilters: any = {};
  compentencyKey!: NsContent.ICompentencyKeys;
  competencyAreaNameKey!: string;
  competencyThemeKey!: string;
  competencySubThemeKey!: string;
  showAllCompetencyTheme: boolean = false;
  showAllOrganisation: boolean = false;
  showAllCompetencySubTheme: boolean = false;
  showAllDesignation: boolean = false;
  showAllSectors: boolean = false;
  showResourceCategory: boolean = false;
  showAllSubSectors: boolean = false;
  showAllContentPartners: boolean = false;
  showAllTopic: boolean = false;

  selectedFilterChips: any;
  filterQueryOrganisation = '';
  filterQueryContents = '';
  filterQueryLanguage = '';
  filterQueryDesignation = '';
  filterQueryRootOrgName = '';
  filterQueryThemes = '';
  filterQuerySectorNames = '';
  filterQueryResourceCategory = ''
  filterQuerySubSectorNames = '';
  filterQuerySubSectors: string = '';
  filterQuerySubThemes = '';
  filterCompetency = '';
  filterQueryContentPartners = '';
  filterQueryTopic = '';

  searchCategory = '';
  searchQuery = '';
  isExploreContentTab = false
  isAllContentSelected = true
  constructor(
    // private searchSrvc: GbSearchService,
    private activated: ActivatedRoute,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService, // private router: Router
    private configSvc: ConfigurationsService,
    
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en');
      const lang = localStorage.getItem('websiteLanguage')!;
      this.translate.use(lang);
    }
  }

  ngOnInit() {
    this.compentencyKey =
      this.configSvc.compentency[environment.compentencyVersionKey];
    this.competencyAreaNameKey = `${this.compentencyKey.vKey}.${this.compentencyKey.vCompetencyArea}`;
    this.competencyThemeKey = `${this.compentencyKey.vKey}.${this.compentencyKey.vCompetencyTheme}`;
    this.competencySubThemeKey = `${this.compentencyKey.vKey}.${this.compentencyKey.vCompetencySubTheme}`;
    
    this.subscription.add(
      this.activated.queryParams.subscribe(params => {
        this.isExploreContentTab = params['tab'] === 'explore-content';
        if(this.isExploreContentTab) {
          this.selectedFilters = {}
          this.selectedFilterChips = []
        }
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes['newfacets'] && changes['newfacets'].currentValue) {
      this.formattedFacets = this.formatFacets(
        changes['newfacets'].currentValue
      );
      
      if (this.formattedFacets?.sectorId?.length) {
        const coursesCategory = _.find(this.categoryTypeDup, {
          name: 'courses',
        });

        if (!coursesCategory) return;

      }
      
      // Handle nested filters for other categories
      if (this.formattedFacets?.nestedCategory?.length) {
        const nestedCategory = _.find(this.categoryTypeDup, {
          name: 'nestedCategory',
        });

        if (nestedCategory) {
          nestedCategory.filters = this.formattedFacets.nestedCategory.map(
            (filter: any) => ({
              name: filter.name,
              count: filter.count,
              isChecked: filter.isChecked,
              displayName: this.formatSectorName(filter.name),
            })
          );
        }
      }

      this.setCategoryType();
    }   
    
    if (changes['typesOfEvents'] && changes['typesOfEvents'].currentValue) {
      this.formattedFacets['typeOfEvents'] = this.typesOfEvents;
    } 

    this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
    
  }

  formatSectorName(name: string): string {
    if (name.startsWith('sector-fw_sector_')) {
      name = name.replace('sector-fw_sector_', '');
    }
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  setCategoryType() {
    const params = this.activated.snapshot.queryParams;
    if(params['q']) {
      this.searchQuery = params['q'];
    }
    if((this.searchCategory && params['category'] && this.searchCategory !== params['category']) ||
    !params['category']) {
      this.selectedFilters = {}
    } 

      this.isExploreContentTab = !!params['tab'];
    
      this.searchCategory = params['category'];
      
      if (this.searchCategory) {
        this.categoryType = this.categoryTypeDup.filter(
          (type) => type.name === this.searchCategory
        );
        if(this.searchCategory === 'case-study' && !this.categoryType.length) {
          this.categoryType = [
            {
              name: 'case-study',
              count: 0,
              isChecked: false,
              displayName: 'Case study',
              filters: [],
              disabled: false,
            }
          ]
        }
        if (this.categoryType.length && !this.isExploreContentTab) {
          this.categoryType[0].isChecked = true;
          this.selectedFilters[this.categoryType[0].name] = [
            this.formatCategoryName(this.categoryType[0].name),
          ];
          this.selectedFilterChips = [
            {
              value: this.categoryType[0].displayName,
              type: this.categoryType[0].name,
            },
          ];
        }

        if (this.searchCategory === SearchCategory.Events) {
          this.formattedFacets['typeOfEvents'] = this.typesOfEvents;

        }
      } else {
        this.categoryType = this.categoryTypeDup.map((cat) => ({
          ...cat,
          isChecked: cat.name === SearchCategory.All ? true : false,
        }));
      }
    // }
    
    
  }

  setCourseCategoryType(contentType:string) {   
      this.categoryTypeDup.map((item, parentIndex)=>{
        if(item.name === contentType) {
          item.isChecked = true
        } else if(item.filters) {
            this.checkForFilter(item, item.filters, contentType, parentIndex, parentIndex)
        }
      })
  }

  checkForFilter(parentData:any, filtersData:any, contentType:string, parentIndex:any, childIndex:any) {
    // this.selectedFilters['Course'] = []
    if(filtersData && filtersData.length) {
      filtersData.map((item:any, index:any)=>{
        if(item.filters && item.filters.length) {
          this.checkForFilter(parentData, item.filters, contentType, parentIndex, index)
        } else {
          if(contentType.indexOf(item.name) > -1) {
            item.isChecked = true
            parentData.filters[childIndex].isChecked = true
            this.categoryTypeDup[parentIndex].isChecked = true
            this.categoryType[0].isChecked = false
            if(Object.keys(this.selectedFilters).length === 0) {
              this.selectedFilters['Course'] = []
              this.selectedFilters['Course'] = contentType
            } else {
              this.selectedFilters['Course'].concat(contentType);
            }            
          } else {
            item.isChecked = false
          }
        }
      })
      // this.appliedFilter.emit(this.selectedFilters);
      // this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
      // console.log('this.selectedFilters',this.selectedFilters, this.categoryTypeDup[parentIndex].name)
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  toggleShowMore(togglesection: string) {
    switch (togglesection) {
      case this.competencyThemeKey:
        this.showAllCompetencyTheme = !this.showAllCompetencyTheme;
        break;
  
      case this.competencySubThemeKey:
        this.showAllCompetencySubTheme = !this.showAllCompetencySubTheme;
        break;
  
      case FacetType.Language:
        this.showAllLanguage = !this.showAllLanguage;
        break;
  
      case FacetType.Organization:
      case FacetType.SourceName:
        this.showAllOrganisation = !this.showAllOrganisation;
        break;
  
      case FacetType.Designation:
        this.showAllDesignation = !this.showAllDesignation;
        break;
  
      case FacetType.courseCategory:
        this.showAllContents = !this.showAllContents;
        break;
  
      case FacetType.sectorNames_v1:
      case FacetType.sectorId:
      case FacetType.sectorNameResource:  
        this.showAllSectors = !this.showAllSectors;
        break;
  
      case FacetType.subSectorNames_v1:
      case FacetType.subSectorId:
      case FacetType.subSectorNameResource:  
        this.showAllSubSectors = !this.showAllSubSectors;
        break;

      case FacetType.resourceCategory:
        this.showResourceCategory = !this.showResourceCategory;
        break;

      case FacetType.contentPartners:
        this.showAllContentPartners = !this.showAllContentPartners;
        break;

      case FacetType.topic:
      case FacetType.topicName:
        this.showAllTopic = !this.showAllTopic;
        break;
    }
  }
  

  translateActualLabels(label: string, type: any) {
    return this.langtranslations.translateActualLabel(label, type, '');
  }

  formatFacets(data: Facet[][]): FormattedFacets {
    const formattedFacets: FormattedFacets | any = {};

    if (!data.length) return formattedFacets;

    const mergedData: { [key: string]: { [key: string]: number } } =
      data.reduce((acc, group) => {
        group.forEach(({ name, values }) => {
          if (!acc[name]) {
            acc[name] = {};
          }
          values.forEach(({ name: valueName, count }) => {
            acc[name][valueName] = (acc[name][valueName] || 0) + count;
          });
        });
        return acc;
      }, {} as { [key: string]: { [key: string]: number } });
    

    Object.entries(mergedData).forEach(([key, values]) => {
      if (key === FacetType.Duration) {
        const formattedDurations = [
          { range: [0, 1800], label: '0 - 30 mins' },
          { range: [1801, 3600], label: '30 - 60 mins' },
          { range: [3601, 5400], label: '60 - 90 mins' },
          { range: [5401, Infinity], label: '90 mins' },
        ]
          .map(({ range, label }) => {
            const count = Object.entries(values)
              .filter(([key]) => {
                const duration = parseInt(key, 10);
                return duration >= range[0] && duration <= range[1];
              })
              .reduce((sum, [, count]) => sum + count, 0);
            return count > 0 ? { name: label, count, isChecked: false } : null;
          })
          .filter(Boolean);

        formattedFacets[key] = formattedDurations;
      } else if (key === FacetType.AvgRating) {
        const ratingRanges = [4.5, 4.0, 3.5, 3.0];
        const formattedRatings = ratingRanges
          .map((rating) => {
            const count = Object.entries(values)
              .filter(([rate]) => parseFloat(rate) >= rating)
              .reduce((sum, [, count]) => sum + count, 0);
            return count > 0
              ? { name: `${rating.toFixed(1)}`, count, isChecked: false }
              : null;
          })
          .filter(Boolean);

        formattedFacets[key] = formattedRatings;
      } else {
        formattedFacets[key] = Object.entries(values).map(([name, count]) => ({
          name,
          count,
          isChecked: false,
        }));
      }
    });

    return formattedFacets;
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  onSelectionFilter(
    event: MatCheckboxChange,
    option: any,
    categoryType: string
  ) {
    const type = option?.name;
    option.isChecked = event.checked;
    if (!this.selectedFilters[categoryType]) {
      this.selectedFilters[categoryType] = [];
    }
    if (event.checked) {
      if (!this.selectedFilters[categoryType].includes(type)) {
        this.selectedFilters[categoryType].push(type);
      }
    } else {
      this.selectedFilters[categoryType] = this.selectedFilters[
        categoryType
      ].filter((item: any) => item !== type);
    } 

    Object.keys(this.selectedFilters).forEach((key) => {
      if (Array.isArray(this.selectedFilters[key]) && this.selectedFilters[key].length === 0) {
        delete this.selectedFilters[key];
      }
    });

    this.appliedFilter.emit(this.selectedFilters);
    this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);

    const types = this.categoryTypeDup.map((category) => category.name);
    if (types.includes(type) && !option.isChecked) {
      this.constructQueryParam.emit('');
    }

    if (categoryType === 'contentType' && this.isAllContentSelected) {
      this.isAllContentSelected = false
    }
  }

  onTypesOfEventsChange(_event: MatRadioChange, option: any, radioType:string) {
    const type = option?.name;
    this.selectedFilters[radioType] = [type];
  
    const eventOptions = this.formattedFacets[radioType];
    if (eventOptions) {
      eventOptions.forEach((opt: any) => {
        opt.isChecked = opt.name === type;
      });
    }
  
    this.appliedFilter.emit(this.selectedFilters);
    this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
  
  }

  togoleThemes(competency: any) {
    competency['showAll'] = !competency['showAll'];
  }

  get filtersAppliedCount(): number {
    return Object.entries(this.selectedFilters).filter(
      ([_, arr]) => Array.isArray(arr) && arr.length > 0
    ).length;
  }

  refactorFilterData(
    data: Record<string, string[]>
  ): { type: string; value: string }[] {
    if (typeof data !== 'object' || data === null) {
      return [];
    }
    const returnedData =  _.flatMap(data, (values, key) =>
      values.map((value) => ({
        type: key,
        value: value === 'Courses' ? 'Contents' : this.formatValue(value),
      }))
    );
    this.categoriseByFacet(returnedData)
    return returnedData
  }

  categoriseByFacet(facetData: any) {
    const groupedData = _.groupBy(facetData, 'type');
    const visibilityMap: { key: string; enableKey: any }[] = [
      { key: FacetType.sectorNames_v1, enableKey: 'showAllSectors' },
      { key: FacetType.subSectorNames_v1, enableKey: 'showAllSubSectors' },
      { key: FacetType.Language, enableKey: 'showAllLanguage' },
      { key: FacetType.Organization, enableKey: 'showAllOrganisation' },
      { key: this.competencyThemeKey, enableKey: 'showAllCompetencyTheme' },
      { key: FacetType.contentPartners, enableKey: 'showAllContentPartners' },
      { key: FacetType.topic, enableKey: 'showAllTopic' },
      { key: FacetType.topicName, enableKey: 'showAllTopic' },
    ];
  
    visibilityMap.forEach(({ key, enableKey }) => {
      (this as any)[enableKey] = groupedData[key]?.length > 0 || false;
    });
  }

  private formatValue(value: string): string {
    if (value.startsWith('sector-fw_sector_')) {
      return this.formatSectorName(value);
    }
    return this.capitalizeFirstLetter(value);
  }

  private reverseFormatSectorName(formattedName: string): string {
    const originalName = formattedName
      .toLowerCase()
      .split(' ')
      .join('-');
    return `sector-fw_sector_${originalName}`;
  }
  

  clearFilterChip(item: { type: string; value: string }) {
    let facets;
    if(item.type === 'sectorId' || item.type === 'subSectorId') {
      item.value = this.reverseFormatSectorName(item.value)
    }

    if(item.type === 'sectorDetails_v1.subSectorName') {
      item.value = (item.value).toLowerCase()
    }
    const types = this.categoryTypeDup.map((category) => category.name);
    if(this.searchCategory === 'case-study') {
      types.push('case-study')
    }
    if (types.includes(item.type)) {
      facets = this.categoryType;

      const category = _.find(facets, { name: item.type });

      if (category) {
        this.clearAllFilters();
        return;
      }

      const foundFilter = _.find(category!.filters, { name: item.value });
      if (foundFilter) {
        foundFilter.isChecked = false;

        if (_.has(this.selectedFilters, item.type)) {
          _.pull(this.selectedFilters[item.type], foundFilter.name);
          if (_.isEmpty(this.selectedFilters[item.type])) {
            // delete this.selectedFilters[item.type];
          }
        }

        this.appliedFilter.emit(this.selectedFilters);
        this.selectedFilterChips = this.refactorFilterData(
          this.selectedFilters
        );
      }
    } else {
      facets = this.formattedFacets;

      const allFilters = _.flatMap(facets);
      let foundFilter: any;
      foundFilter = _.find(allFilters, {
        name: item.value.toLowerCase(),
      });
     
      if (!foundFilter) {
        foundFilter = _.find(allFilters, {
          name: item.value,
        });
      }
      
      
      if (foundFilter) {
        foundFilter.isChecked = false;
        if (_.has(this.selectedFilters, item.type)) {
          _.pull(this.selectedFilters[item.type], foundFilter.name);
          if (_.isEmpty(this.selectedFilters[item.type])) {
            // delete this.selectedFilters[item.type];
          }
        }

        this.appliedFilter.emit(this.selectedFilters);
        this.selectedFilterChips = this.refactorFilterData(
          this.selectedFilters
        );
      }
      else {
        const foundCategory = _.find(this.categoryTypeDup, {
          name: SearchCategory.Courses,
        });
        if (foundCategory) {
          const found = this.recursivelySetIsCheckedFalse(
            foundCategory.filters,
            item.value.toLowerCase()
          );
          if (found) {
            found.isChecked = false;
            if (_.has(this.selectedFilters, item.type)) {
              if (item.value.toLowerCase().startsWith('sector-fw_sector_')) {
                _.pull(
                  this.selectedFilters[item.type],
                  item.value.toLowerCase()
                );
              } else {
                _.pull(this.selectedFilters[item.type], item.value);
              }
              if (_.isEmpty(this.selectedFilters[item.type])) {
                delete this.selectedFilters[item.type];
              }
            }
            this.appliedFilter.emit(this.selectedFilters);
            this.selectedFilterChips = this.refactorFilterData(
              this.selectedFilters
            );
          }
        }
      }
    }
  }

  clearAllFilters() {
    Object.keys(this.selectedFilters).forEach((key) => {
      this.selectedFilters[key] = [];
    });

    if (!this.isExploreContentTab) {
      _.forEach(this.categoryType, (category) => {
        category.isChecked = false;
        _.forEach(category.filters, (filter) => {
          filter.isChecked = false;
        });
      });
    } else {
      this.isAllContentSelected = true
    }

    _.forEach(this.formattedFacets, (filters) => {
      _.forEach(filters, (filter) => {
        filter.isChecked = false;
      });
    });

    this.appliedFilter.emit(this.selectedFilters);
    this.selectedFilterChips = [];

    if (!this.isExploreContentTab) {
      this.constructQueryParam.emit('');
    }
  }

  get filteredOrganisations() {
    let data: any;
    if (this.searchCategory === SearchCategory.Events) {
      data = this.formattedFacets[FacetType.SourceName];
    } else {
      data = this.formattedFacets[FacetType.Organization];
    }
    let filteredList = data?.filter((item: any) =>
      item.name
        .toLowerCase()
        .includes(this.filterQueryOrganisation.toLowerCase())
    );

    return this.showAllOrganisation ? filteredList : filteredList?.slice(0, 4);
  }

  get filteredContents() {
    let filteredList = this.formattedFacets[FacetType.courseCategory].filter(
      (item: any) =>
        item.name.toLowerCase().includes(this.filterQueryContents.toLowerCase())
    );

    return this.showAllContents ? filteredList : filteredList.slice(0, 4);
  }

  get filteredLanguages() {
    let filteredList = this.formattedFacets[FacetType.Language].filter(
      (item: any) =>
        item.name.toLowerCase().includes(this.filterQueryLanguage.toLowerCase())
    );

    return this.showAllLanguage ? filteredList : filteredList.slice(0, 4);
  }

  get filteredSectorNames() {
    let data;
    if(this.formattedFacets[FacetType.sectorNames_v1]) {
      data = this.formattedFacets[FacetType.sectorNames_v1]
    } else if (this.formattedFacets[FacetType.sectorNameResource]) {
      data = this.formattedFacets[FacetType.sectorNameResource]
    }

    let filteredList = data.filter(
      (item: any) =>
        item.name.toLowerCase().includes(this.filterQuerySectorNames.toLowerCase())
    );

    return this.showAllSectors ? filteredList : filteredList.slice(0, 4);
  }

  get filteredSubSectorNames() {
    let data;
    if(this.formattedFacets[FacetType.subSectorNames_v1]) {
      data = this.formattedFacets[FacetType.subSectorNames_v1]
    } else if (this.formattedFacets[FacetType.subSectorNameResource]) {
      data = this.formattedFacets[FacetType.subSectorNameResource]
    }

    let filteredList = data.filter(
      (item: any) =>
        item.name.toLowerCase().includes(this.filterQuerySubSectorNames.toLowerCase())
    );

    return this.showAllSubSectors ? filteredList : filteredList.slice(0, 4);
  }

  get filteredSectorId() {
    let filteredList = this.formattedFacets[FacetType.sectorId].filter(
      (item: any) =>
        item.name.toLowerCase().includes(this.filterQuerySectorNames.toLowerCase())
    );

    return this.showAllSectors ? filteredList : filteredList.slice(0, 4);
  }

  get filteredSubSectorId() {
    let filteredList = this.formattedFacets[FacetType.subSectorId].filter(
      (item: any) =>
        item.name.toLowerCase().includes(this.filterQuerySubSectorNames.toLowerCase())
    );

    return this.showAllSubSectors ? filteredList : filteredList.slice(0, 4);
  }

  get filteredDesignations() {
    let filteredList = this.formattedFacets[
      'profileDetails.professionalDetails.designation'
    ]?.filter((item: any) =>
      item?.name
        .toLowerCase()
        .includes(this.filterQueryDesignation.toLowerCase())
    );

    return this.showAllDesignation ? filteredList : filteredList.slice(0, 4);
  }

  get filteredRootOrgNames() {
    let filteredList = this.formattedFacets['rootOrgName']?.filter(
      (item: any) =>
        item?.name
          .toLowerCase()
          .includes(this.filterQueryRootOrgName.toLowerCase())
    );

    return this.showAllOrganisation ? filteredList : filteredList.slice(0, 4);
  }

  get filteredCompetencyTheme() {
    let filteredList = this.formattedFacets[this.competencyThemeKey]?.filter(
      (item: any) =>
        item?.name
          .toLowerCase()
          .includes(this.filterQueryThemes.toLowerCase())
    );

    return this.showAllCompetencyTheme ? filteredList : filteredList.slice(0, 4);
  }

  get filteredSubCompetencyTheme() {
    let filteredList = this.formattedFacets[this.competencySubThemeKey]?.filter(
      (item: any) =>
        item?.name
          .toLowerCase()
          .includes(this.filterQuerySubThemes.toLowerCase())
    );

    return this.showAllCompetencySubTheme ? filteredList : filteredList.slice(0, 4);
  }

  get filteredResourceCategory() {
    let filteredList = this.formattedFacets[FacetType.resourceCategory].filter(
      (item: any) =>
        item.name.toLowerCase().includes(this.filterQueryResourceCategory.toLowerCase())
    );

    return this.showResourceCategory ? filteredList : filteredList.slice(0, 4);
  }

  get filteredContentPartners() {
    let filteredList = this.formattedFacets[FacetType.contentPartners].filter(
      (item: any) =>
        item.name.toLowerCase().includes(this.filterQueryContentPartners.toLowerCase())
    );

    return this.showAllContentPartners ? filteredList : filteredList.slice(0, 4);
  }

  get filteredTopic() {
    let filterData;
    if(this.formattedFacets[FacetType.topic]) {
      filterData = this.formattedFacets[FacetType.topic]
    } else if (this.formattedFacets[FacetType.topicName]) {
      filterData = this.formattedFacets[FacetType.topicName]
    }
    let filteredList = filterData.filter(
      (item: any) =>
        item.name.toLowerCase().includes(this.filterQueryTopic.toLowerCase())
    );

    return this.showAllTopic ? filteredList : filteredList.slice(0, 4);
  }

  private recursivelySetIsCheckedFalse(filters: any[], name: string): any {
    for (const filter of filters) {
      if ((filter?.name).toLowerCase() === name.toLowerCase()) {
        filter.isChecked = false;
        return filter;
      }
      if (filter.filters?.length) {
        const found = this.recursivelySetIsCheckedFalse(
          filter.filters,
          name.toLowerCase()
        );
        if (found) {
          return found;
        }
      }
    }
    return null;
  }  

  private formatCategoryName(name: string): string {
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  allContentSelection() {
    this.isAllContentSelected = true;
    this.selectedFilters['contentType'] = []
    
    this.filteredContents.map((item: any) => {
      item.isChecked = false;
    })

    this.appliedFilter.emit(this.selectedFilters);
    this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
  }

  getSelectedFilter(item:any) {
    if(Object.keys(this.selectedFilters).length) {
      return this.filterValueExists(this.selectedFilters, item?.name)
    }    
  }

  filterValueExists(obj:any, target:any):any {
    if (Array.isArray(obj)) {
      return obj.some(item => this.filterValueExists(item, target));
    } else if (obj !== null && typeof obj === 'object') {
      return Object.values(obj).some(value => this.filterValueExists(value, target));
    } else {
      return obj === target;
    }
  }

}
