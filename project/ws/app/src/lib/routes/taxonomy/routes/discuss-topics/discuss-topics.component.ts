import { LoaderService } from '@ws/author/src/lib/services/loader.service'
import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router, Event, NavigationEnd, NavigationError } from '@angular/router'
import { ValueService } from '@sunbird-cb/utils-v2'
import { map } from 'rxjs/operators'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { TaxonomyService } from '../../services/taxonomy.service'

const APP_TAXONOMY = `/app/taxonomy/`
@Component({
  selector: 'app-discuss',
  templateUrl: './discuss-topics.component.html',
  styleUrls: ['./discuss-topics.component.scss'],
})
export class DiscussTopicsComponent implements OnInit, OnDestroy {
  sideNavBarOpened = true
  panelOpenState = false
  nextLevelTopic: any
  firstLevelTopic: any
  alreadyClicked!: boolean
  currentTab: any
  titles = [{ title: 'DISCUSS', url: '/app/discuss/home', icon: 'forum' }]
  relatedResource: any = []
  unread = 0
  currentObj!: any
  nextLvlObj!: any
  tempArr!: any
  leftMenuChildObj!: any
  currentRoute = 'home'
  banner!: NsWidgetResolver.IWidgetData<any>
  public screenSizeIsLtMedium = false
  isLtMedium$ = this.valueSvc.isLtMedium$
  identifier: any = []
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')))
  private defaultSideNavBarOpenedSubscription: any
  isFirst = true
  constructor(private valueSvc: ValueService, private route: ActivatedRoute,
              private router: Router,
              private _service: TaxonomyService,
              private loader: LoaderService) {
    this.unread = this.route.snapshot.data.unread

    this.currentTab = this.route.snapshot.url.toString().split('/').pop()
    this.getAllTopics(this.currentTab)
    this. getAllRelatedCourse()
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        // Hide loading indicator
        // console.log(event.url)

      }

      if (event instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
        // console.log(event.error)
      }
    })
    // this.bannerSubscription = this.route.data.subscribe(data => {
    //   if (data && data.pageData) {
    //     this.banner = data.pageData.data.banner || []
    //   }
    // })
  }
  ngOnInit() {
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.sideNavBarOpened = !isLtMedium
      this.screenSizeIsLtMedium = isLtMedium
    })
    this.tempArr  =  [{ title: 'All topics', url: '/app/taxonomy/home' }]
    this.alreadyClicked = true
    // this.firstLevelTopic =  [{name: "Economics", enabled: true, routerLink:"/app/taxonomy/test"},
    // {name: "1st level  topic", enabled: true, routerLink:"/app/taxonomy/116"},
    // {name: "1st level  topic", enabled: true, routerLink:"/app/taxonomy/ll1"},
    // {name: "1st level  topic", enabled: true,  routerLink:"/app/taxonomy/ll2"},
    // {name: "1st level  topic", enabled: true, routerLink:"/app/taxonomy/ll3"},
    // {name: "1st level  topic", enabled: true, routerLink:"/app/taxonomy/ll4"},
    // {name: "1st level  topic", enabled: true,routerLink:"/app/taxonomy/ll5"},]

    // this.nextLevelTopic = ["2nd Level Topic",  "2nd Level Topic", "2nd Level Topic","small",
    // "2nd Level Topic with large", "2nd Level Topic very large","2nd Level Topic","2nd Level Topic with Extra large",
    // "2nd Level", "2nd Level Topic","2nd Level Topic","small",
    // "2nd Level Topic with large", "2nd Level Topic very large","2nd Level Topic","2nd Level Topic with Extra large",
    // "2nd Level Topic with large", "2nd Level Topic very large","2nd Level Topic","2nd Level Topic with Extra large" ]

  }
  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
    // if (this.bannerSubscription) {
    //   this.bannerSubscription.unsubscribe()
    // }
  }
  getAllTopics(topic: string) {
    this._service.fetchAllTopics().subscribe(response => {
      this.currentObj = response.terms
      this.nextLvlObj = response.terms
      this.dataProcess(topic)
      })
    }
    dataProcess(topic: string) {
      const firstLvlArray: any[] = []
      const tempCurrentArray: any[] = []
      if (this.alreadyClicked) {

      const handleLink  = { title: decodeURI(topic), url: 'none' }
      this.tempArr.push(handleLink)

      this.currentObj.forEach((term: any) => {
          if (term.name !== decodeURI(topic)) {
            const obj = {
              name: term.name,
              enabled: true,
              routerLink: APP_TAXONOMY + term.name,
            }
            firstLvlArray.push(obj)
            } else {
            const firstObj = {
              name: decodeURI(topic),
              enabled: true,
              routerLink: APP_TAXONOMY + decodeURI(topic),
            }
            firstLvlArray.splice(0, 0, firstObj)
          }
          this.currentTab = term.name
            this.firstLevelTopic = firstLvlArray
            if (term.name === decodeURI(topic) && term.children) {
              this.identifier = []
              this.getIdentifierOnTopics(term)
              const nextLevel: string[] = []
              term.children.forEach((second: any) => {
                nextLevel.push(second.name)
                tempCurrentArray.push(second)
              })

              this.nextLevelTopic = nextLevel
            }

        })
        this.nextLvlObj = tempCurrentArray
        this.alreadyClicked = false
    } else {
      const handleLink  = { title: decodeURI(topic), url: 'none' }
      this.tempArr[1] = handleLink
      this.currentObj.forEach((term: any) => {
          const obj = {
            name: term.name,
            enabled: true,
            routerLink: APP_TAXONOMY + term.name,
          }
          firstLvlArray.push(obj)
        this.currentTab = term.name
          this.firstLevelTopic = firstLvlArray
          if (term.name === decodeURI(topic) && term.children) {
            this.identifier = []
            this.getIdentifierOnTopics(term)
            const nextLevel: string[] = []
            term.children.forEach((second: any) => {
              nextLevel.push(second.name)
              tempCurrentArray.push(second)
            })

            this.nextLevelTopic = nextLevel
          }

      })
      this.nextLvlObj = tempCurrentArray
    }
    }
    dataProcessOn2ndLevel(topic: string) {
      const handleLink  = { title: decodeURI(topic), url: 'none' }
      this.tempArr[this.tempArr.length - 1] = handleLink
      const tempCurrentArray: any[] = []
      this.nextLevelTopic = []
      if (this.leftMenuChildObj) {
      this.leftMenuChildObj.forEach((term: any) => {
          this.currentTab = term.name
            if (term.name === topic && term.children) {
              this.nextLvlObj = term.children
              const nextLevel: string[] = []
              this.identifier = []
              this.getIdentifierOnTopics(term)
              term.children.forEach((second: any) => {
                nextLevel.push(second.name)
                tempCurrentArray.push(second)
              })
              this.nextLevelTopic = nextLevel
            }

        })
      }
        // this.nextLvlObj = tempCurrentArray
    }
    selectedEvent(tabItem: string) {
      if (this.isFirst && !this.alreadyClicked) {
        this.dataProcess(tabItem)
      } else {
        this.dataProcessOn2ndLevel(tabItem)
      }

    }
    getClickedTab(clickedTab: string) {
      this.isFirst = false
      const leftMenuData: any[] = []
      this.nextLvlObj.forEach((term: any) => {
        leftMenuData.push(term)
        if (term.name === decodeURI(clickedTab)) {
          this.identifier = []
          this.getIdentifierOnTopics(term)
          const handleLink  = { title: decodeURI(clickedTab), url: 'none' }
          this.tempArr.push(handleLink)
          this.dataProcessOneMore(clickedTab, this.nextLvlObj)
        }
        })
        this.leftMenuChildObj = leftMenuData
    }

    dataProcessOneMore(topic: string, processObj: any) {
      const firstLvlArray: any[] = []
      this.firstLevelTopic = []
      this.nextLevelTopic = []
      processObj.forEach((term: any) => {
        if (term) {
        if (term.name === decodeURI(topic)) {
          if (term.children) {
          this.nextLvlObj = term.children
          }
        }
        //  if(term.name!==decodeURI(topic)){
          const obj = {
            name: term.name,
            enabled: true,
            routerLink: APP_TAXONOMY + term.name,
          }
          firstLvlArray.push(obj)
        // } else {
          // const firstObj = {
          //   name: decodeURI(topic),
          //   enabled: true,
          //   routerLink: APP_TAXONOMY + decodeURI(topic),
          // }

          // firstLvlArray.splice(0, 0, firstObj)
          this.router.navigate([APP_TAXONOMY + decodeURI(topic)])
        // }

            if (term.name === topic && term.children) {
              const nextLevel: string[] = []
              term.children.forEach((second: any) => {
                nextLevel.push(second.name)
              })
              if (nextLevel.length > 0) {
                this.nextLevelTopic = nextLevel
              }

            }
          }
        })
        this.firstLevelTopic = firstLvlArray

    }
  getIdentifierOnTopics(allLevelObject: any) {
    this.identifier.push(allLevelObject.identifier)
    this. getAllRelatedCourse()
  }
  getAllRelatedCourse() {
    this.loader.changeLoad.next(true)
      this._service.fetchAllRelatedCourse(this.identifier).subscribe(response => {
        const tempRequestParam: { content: any }[] = []
        response.result.content.forEach((course: any) => {
          if (course.status === 'Live') {
         const temobj = {
           content: course,
         }
         tempRequestParam.push(temobj)
        }
        })
        this.relatedResource = tempRequestParam
        this.loader.changeLoad.next(false)
      })
    }
}
