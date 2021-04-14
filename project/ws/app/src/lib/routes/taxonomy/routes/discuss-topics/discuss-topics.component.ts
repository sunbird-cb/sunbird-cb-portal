
import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router, Event, NavigationEnd, NavigationError } from '@angular/router'
import { ValueService } from '@sunbird-cb/utils'
import { map } from 'rxjs/operators'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { TaxonomyService } from '../../services/taxonomy.service'
@Component({
  selector: 'app-discuss',
  templateUrl: './discuss-topics.component.html',
  styleUrls: ['./discuss-topics.component.scss'],
})
export class DiscussTopicsComponent implements OnInit, OnDestroy {
  sideNavBarOpened = true
  panelOpenState = false
  nextLevelTopic:any
  firstLevelTopic:any
  currentTab:any
  titles = [{ title: 'DISCUSS', url: '/app/discuss/home', icon: 'forum' }]
  relatedResource:any =[]
  unread = 0
  currentRoute = 'home'
  banner!: NsWidgetResolver.IWidgetData<any>
  public screenSizeIsLtMedium = false
  isLtMedium$ = this.valueSvc.isLtMedium$
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')))
  private defaultSideNavBarOpenedSubscription: any

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
  gotoLeft(){
    console.log("Working")
  }
  getAllTopics(topic: string){
    this._service.fetchAllTopics().subscribe(response => {
      let firstLvlArray: any[] = [];
      response.terms.forEach((term: any) => {
        if(term.name===topic && term.children!==undefined){

            const obj = {
              name: term.name,
              enabled: true,
              routerLink: "/app/taxonomy/"+term.name
            }
            firstLvlArray.push(obj)
            this.firstLevelTopic = firstLvlArray
            if(term){
              let nextLevel: string[] = []
              term.children.forEach((second: any) => {
                nextLevel.push(second.name)
              });

              this.nextLevelTopic = nextLevel
            }
        }

        })
      })
    }
  getAllRelatedCourse(){
      this._service.fetchAllRelatedCourse().subscribe(response => {
        var tempRequestParam: { content: any }[] = []
        response.result.content.forEach((course: any) => {
         const temobj= {
           content: course
         }
         tempRequestParam.push(temobj)
        });
        this.relatedResource = tempRequestParam
      })
    }
}
