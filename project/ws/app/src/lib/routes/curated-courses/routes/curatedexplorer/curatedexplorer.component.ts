import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CuratedCollectionService } from '../../services/curated-collection.service'
/* tslint:disable*/
import _ from 'lodash'
import { ValueService } from '@sunbird-cb/utils-v2';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'ws-app-curatedexplorer',
  templateUrl: './curatedexplorer.component.html',
  styleUrls: ['./curatedexplorer.component.scss']
})
export class CuratedexplorerComponent implements OnInit, OnDestroy {
  sideNavBarOpened = true
  public screenSizeIsLtMedium = false
  userEmail : any
  title: any[] = [
    { title: 'Learn', url: '/page/learn', icon: 'school' },
    { title: ('Curated collections') , url: '/app/curatedCollections/home', icon: '' }
  ]
  currentCollectionId: any
  currentCollection: any
  currentCollectionHierarchy: any
  allCollections: any
  isLtMedium$ = this.valueSvc.isLtMedium$
  menuItems: any[] = []
  searchReq: any
  searchReqDefault = {
    request: {
      filters: {
        primaryCategory: [
          'CuratedCollections',
          'program'
        ],
      },
      query: '',
      sort_by: {
        name: 'asc',
      },
      limit: 50,
      offset: 0,
      fields: [],
      facets: ['primaryCategory', 'mimeType'],
      fuzzy: false,
    },
  }
  stateData: {
    param: any, path: any
  } | undefined
  public displayLoader!: Observable<boolean>
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')))
  private defaultSideNavBarOpenedSubscription: any


  constructor(
    private route: ActivatedRoute,
    private curatedCollectionSvc: CuratedCollectionService,
    private valueSvc: ValueService,
    private router: Router,
  ) {
    this.currentCollectionId = this.route.snapshot.url.toString().split('/').pop() || ''

  }

  ngOnInit() {
    this.searchReq = _.get(this.route, 'snapshot.data.pageData.data.search.searchReq') || this.searchReqDefault
    this.stateData = { param: '', path: 'curatedCollections' }
    this.displayLoader = this.curatedCollectionSvc.isLoading()
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.sideNavBarOpened = !isLtMedium
      this.screenSizeIsLtMedium = isLtMedium
    })

    this.getAllCuratedCollection()
    this.getCurrentCollectionHirarchy()
  }

  getAllCuratedCollection(req?: any) {
    const request = req || this.searchReq

    this.curatedCollectionSvc.fetchSearchData(request).subscribe((res: any) => {
      if (res && res.result &&  res.result && res.result.content) {
        this.allCollections = _.get(res, 'result.content')
        this.currentCollection = _.find(this.allCollections, ac => ac.identifier === this.currentCollectionId)

        this.updateBreadcrumbTitle()
        this.getMenuItems()
      }
    })
  }


  getCurrentCollectionHirarchy() {
    this.curatedCollectionSvc.fetchContent(this.currentCollectionId || '', 'minimal').subscribe( res => {
      if (res && res.result &&  res.result && res.result.content) {
        // const tempRequestParam: { content: any }[] = []
        // if (res.result.content && res.result.content.children) {
        //   res.result.content.children.forEach((course: any) => {
        //     if (course.status === 'Live') {
        //     const temobj = {
        //       content: course,
        //     }
        //     tempRequestParam.push(temobj)
        //     }
        //   })

          this.currentCollectionHierarchy = _.get(res, 'result.content.children')
          console.log(this.currentCollectionHierarchy, 'this.currentCollectionHierarchy==')
        }
      // }
    })
  }

  // redirectUrl() {
  //   this.userEmail =  this.configSvc && this.configSvc.userProfile ? this.configSvc.userProfile.email : ''
  //   console.log(this.cscmsUrl, 'this.cscmsUrl+++')
  //   // this.router.navigateByUrl('', {state: { email: this.userEmail} });
  //   this.router.navigate([this.cscmsUrl], this.userEmail)
  // }


  collectDataRefresh(do_id:any) {
    console.log(do_id, 'do_id====')
    // return `app/curatedCollections/${do_id}`
    this.router.navigate(['app/curatedCollections/', do_id])
  }


  // reloadPage(event:any){
  //   console.log('btn clicked')
  //   this.getCurrentCollectionHirarchy()
  //   // window.location.reload()
  // }

  getMenuItems() {
    this.allCollections.map((col: any) => {
      this.menuItems.push({
        name: col.name,
        enabled: true,
        identifier: col.identifier,
        routerLink: this.getRouterString(col.identifier),
      })
    })
  }

  onTabLeftMenu(event: any) {
    this.currentCollectionHierarchy = []
    this.currentCollectionId = event.identifier
    this.currentCollection = _.find(this.allCollections, ac => ac.identifier === this.currentCollectionId)
    this.updateBreadcrumbTitle()
    this.getCurrentCollectionHirarchy()
  }

  getRouterString(identifier: string) {
    return `/app/curatedCollections/${identifier}`
  }

  updateBreadcrumbTitle() {
    this.title = [
      { title: 'Learn', url: '/page/learn', icon: 'school' },
      { title: ('Curated collections') , url: '/app/curatedCollections/home', icon: '' },
      { title: `${_.get(this.currentCollection, 'name') || ''}` , url: 'none', icon: '' }
    ]
  }

  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
  }

}
