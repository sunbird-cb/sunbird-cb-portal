import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NsContent } from '@sunbird-cb/utils-v2';
import { ActivatedRoute } from '@angular/router';
import { GbSearchService } from '../../services/gb-search.service';

@Component({
  selector: 'ws-app-show-all',
  templateUrl: './show-all.component.html',
  styleUrls: ['./show-all.component.scss']
})
export class ShowAllComponent implements OnInit {
  courses: any[] = []
  pagedCourses: any[] = []
  initialPaginationSize = 10;
  initialPaginationSizeOptions = [10, 20, 50, 100];
  currentPage = 1
  totalPages = 1
  sortKey = 'name'
  sortOrder: 'asc' | 'desc' = 'asc'
  loading = false
  customOptions: any[] = []
  contentName: string = ''
  constructor(private gbSvc: GbSearchService, private activatedRoute:ActivatedRoute,
    private translate: TranslateService,) { 
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en');
      const lang = localStorage.getItem('websiteLanguage')!;
      this.translate.use(lang);
    }
    this.customOptions = [
      { name: 'A-Z', value: 'a-z' },
      { name: 'Z-A', value: 'z-a' }
    ]

  }

  ngOnInit() {

    this.contentName = this.activatedRoute?.snapshot?.queryParams['name'] || '';
    this.fetchCourses()
  }

  fetchCourses() {
    this.loading = true
    this.gbSvc.exploreContent().subscribe(
      (res: any) => {
        this.courses = res?.result?.content || []
        this.courses = this.courses.filter((data: any) => {
          return data.primaryCategory === NsContent.EPrimaryCategory.COURSE
        }) || []
        this.applySort()
        this.setPage(1)
        this.loading = false
      },
      _err => {
        this.loading = false
      }
    )
  }

  applySort() {
    this.courses.sort((a, b) => {
      let valA = a[this.sortKey]
      let valB = b[this.sortKey]
      
      if (this.sortKey === 'avgRating') {
        valA = Number(valA) || 0
        valB = Number(valB) || 0
      } else if (this.sortKey === 'createdOn') {
        valA = new Date(valA).getTime() || 0
        valB = new Date(valB).getTime() || 0
      } else {
        valA = (valA || '').toString().toLowerCase()
        valB = (valB || '').toString().toLowerCase()
      }
      
      if (valA < valB) return this.sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return this.sortOrder === 'asc' ? 1 : -1
      return 0
    })
    this.setPage(1)
  }

  setSort(key: string) {
    if (this.sortKey === key) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
    } else {
      this.sortKey = key
      this.sortOrder = 'asc'
    }
    this.applySort()
  }

  setPage(page: number) {
    this.currentPage = page
    this.totalPages = Math.ceil(this.courses.length / this.initialPaginationSize)
    const start = (page - 1) * this.initialPaginationSize
    const end = start + this.initialPaginationSize
    this.pagedCourses = this.courses.slice(start, end)
  }

  onPageChange(event: any){
    this.currentPage = event.currentPage;
    this.initialPaginationSize = event.limit;
    this.setPage(this.currentPage);

  }
  onChangeSortSearch(event: any) {
    if(event === 'most_relevant'){
    } else if(event === 'recently_added_newest'){
    this.sortKey = 'createdOn';
    this.sortOrder = 'desc';
    } else if(event === 'highest_rated'){
    this.sortKey = 'avgRating';
    this.sortOrder = 'desc';
    } else if(event === 'a-z'){
    this.sortKey = 'name';
    this.sortOrder = 'asc';
    } else if(event === 'z-a'){
    this.sortKey = 'name';
    this.sortOrder = 'desc';
    }
    this.applySort();
  }

}
