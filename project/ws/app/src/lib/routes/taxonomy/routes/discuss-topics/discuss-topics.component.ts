
import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router, Event, NavigationEnd, NavigationError } from '@angular/router'
import { ValueService } from '@sunbird-cb/utils'
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
  currentTab: any
  titles = [{ title: 'DISCUSS', url: '/app/discuss/home', icon: 'forum' }]
  relatedResource: any = []
  unread = 0
  currentObj!: any
  nextLvlObj!: any
  currentRoute = 'home'
  banner!: NsWidgetResolver.IWidgetData<any>
  public screenSizeIsLtMedium = false
  isLtMedium$ = this.valueSvc.isLtMedium$
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')))
  private defaultSideNavBarOpenedSubscription: any
  isFirst = true
  constructor(private valueSvc: ValueService, private route: ActivatedRoute, private router: Router,  private _service:  TaxonomyService) {
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
      this.currentObj.forEach((term: any) => {
        // if(term.name!==decodeURI(topic)){
          const obj = {
            name: term.name,
            enabled: true,
            routerLink: APP_TAXONOMY + term.name,
          }
          firstLvlArray.push(obj)
          this.currentTab = term.name
            this.firstLevelTopic = firstLvlArray
            if (term.name === topic && term.children !== undefined) {
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
    dataProcessOn2ndLevel(topic: string) {
      const firstLvlArray: any[] = []
      const tempCurrentArray: any[] = []
      this.nextLvlObj.forEach((term: any) => {
        // if(term.name!==decodeURI(topic)){
          const obj = {
            name: term.name,
            enabled: true,
            routerLink: APP_TAXONOMY + term.name,
          }
          firstLvlArray.push(obj)
          this.currentTab = term.name
            this.firstLevelTopic = firstLvlArray
            if (term.name === topic && term.children !== undefined) {
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
    selectedEvent(tabItem: string) {
      if (this.isFirst) {
        this.dataProcess(tabItem)
      } else {
        this.dataProcessOn2ndLevel(tabItem)
      }

    }
    getClickedTab(clickedTab: string) {
      this.isFirst = false
      this.nextLvlObj.forEach((term: any) => {
        if (term.name === decodeURI(clickedTab)) {
          this.dataProcessOneMore(clickedTab, this.nextLvlObj)
        }
        })
    }

    dataProcessOneMore(topic: string, processObj: any) {
      const firstLvlArray: any[] = []
      processObj.forEach((term: any) => {
        if (term) {
        if (term.name === decodeURI(topic)) {
          if (term.children) {
          this.nextLvlObj = term.children
          }
        }
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
          this.router.navigate([APP_TAXONOMY + decodeURI(topic)])
        }
        this.firstLevelTopic = firstLvlArray
            if (term.name === topic && term.children !== undefined) {
              const nextLevel: string[] = []
              term.children.forEach((second: any) => {
                nextLevel.push(second.name)
              })
              this.nextLevelTopic = nextLevel
            }
          }
        })

    }
  getAllRelatedCourse() {
      this._service.fetchAllRelatedCourse().subscribe(response => {
        const tempRequestParam: { content: any }[] = []
        response.result.content.forEach((course: any) => {
         const temobj = {
           content: course,
         }
         tempRequestParam.push(temobj)
        })
        this.relatedResource = tempRequestParam
      })
    }
}
