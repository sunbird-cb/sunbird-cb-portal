import { LoaderService } from '@ws/author/src/lib/services/loader.service'
import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ValueService } from '@sunbird-cb/utils'
import { map } from 'rxjs/operators'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { TaxonomyService } from '../../services/taxonomy.service'

const APP_TAXONOMY = `/app/taxonomy/`
@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss'],
})
export class TaxonomyExplorerComponent implements OnInit, OnDestroy {
  sideNavBarOpened = true
  panelOpenState = false
  nextLevelTopic: any
  firstLevelTopic: any
  alreadyClicked!: boolean
  currentTab: string
  titles = [{ title: 'DISCUSS', url: '/app/discuss/home', icon: 'forum' }]
  relatedResource: any = []
  unread = 0
  currentObj!: any
  nextLvlObj!: any
  tempArr!: any
  leftMenuChildObj!: any
  currentRoute = 'home'
  isFirstTab = true
  banner!: NsWidgetResolver.IWidgetData<any>
  public screenSizeIsLtMedium = false
  isLtMedium$ = this.valueSvc.isLtMedium$
  topicKey: any = []
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')))
  private defaultSideNavBarOpenedSubscription: any
  isFirst = true
  constructor(private valueSvc: ValueService, private route: ActivatedRoute,
              private router: Router,
              private _service: TaxonomyService,
              private loader: LoaderService) {
    this.unread = this.route.snapshot.data.unread

    this.currentTab = this.route.snapshot.url.toString().split('/').pop() || ''
    if (!localStorage.getItem('isFirstTab')) {
      localStorage.setItem('currentTab', decodeURI(this.currentTab))
      localStorage.setItem('isFirstTab', 'true')
    }

  }
  ngOnInit() {

    this.router.navigate([APP_TAXONOMY + localStorage.getItem('currentTab')])
    if (!localStorage.getItem('currentTab')) {
      this.getAllTopics(this.currentTab)

    } else {
      this.topicKey.push(localStorage.getItem('currentTab'))
      this.getAllTopics(localStorage.getItem('currentTab') || this.currentTab)
    }
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.sideNavBarOpened = !isLtMedium
      this.screenSizeIsLtMedium = isLtMedium
    })
    this.tempArr  =  [{ title: 'All topics', url: '/app/taxonomy/home' }]
    this.alreadyClicked = true
  }
  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
  }
  getAllTopics(topic: string) {
    this._service.fetchAllTopics().subscribe(response => {
      this.currentObj = response.terms
      this.nextLvlObj = response.terms
      this.taxonomyFirstLevel(topic)
      })
    }
    taxonomyFirstLevel(topic: string) {
      const firstLvlArray: any[] = []
      const tempCurrentArray: any[] = []
      if (this.alreadyClicked) {

      const handleLink  = { title: decodeURI(topic), url: 'none' }
      this.tempArr.push(handleLink)

      this.currentObj.forEach((term: any) => {
          if (term.name !== decodeURI(topic)) {
            firstLvlArray.push(this.createTermObject(term))
            } else {
            firstLvlArray.splice(0, 0, this.createTermObject(term))
          }
          this.currentTab = term.name
            this.firstLevelTopic = firstLvlArray

            if (term.name === decodeURI(topic) && term.children) {
              this.getSecondLevelTopic(term)
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
          firstLvlArray.push(this.createTermObject(term))
        this.currentTab = term.name
          this.firstLevelTopic = firstLvlArray
          if (term.name === decodeURI(topic) && term.children) {
            this.getSecondLevelTopic(term)
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
    createTermObject(termObj: any) {
      const termObject = {
        name: decodeURI(termObj.name),
        enabled: true,
        identifier: termObj.identifier,
        routerLink: APP_TAXONOMY + termObj.name.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, ''),
      }
      return termObject
    }
    // processTermChildrenObject(termChildren: any){
    //   term.children.forEach((second: any) => {
    //     nextLevel.push(second.name)
    //     tempCurrentArray.push(second)
    //   })
    //   this.nextLevelTopic = nextLevel
    // }
    taxonomyOnGoingLevels(topic: string) {
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
              this.getSecondLevelTopic(term)
              term.children.forEach((second: any) => {
                nextLevel.push(second.name)
                tempCurrentArray.push(second)
              })
              this.nextLevelTopic = nextLevel
            } else if (term.name === topic) {
              this.getSecondLevelTopic(term)
            }
        })
      }
        // this.nextLvlObj = tempCurrentArray
    }
    onTabLeftMenu(tabItem: string) {
      if (this.isFirst && !this.alreadyClicked) {
        this.taxonomyFirstLevel(tabItem)
        localStorage.setItem('currentTab', decodeURI(tabItem))
      } else {
        this.taxonomyOnGoingLevels(tabItem)
      }

    }
    getClickedTab(clickedTab: string) {
      this.isFirst = false
      const leftMenuData: any[] = []
      this.nextLvlObj.forEach((term: any) => {
        leftMenuData.push(this.createTermObject(term))
        if (term.name === decodeURI(clickedTab)) {
          this.getSecondLevelTopic(term)
          const decode = decodeURI(clickedTab)
          const handleLink  = { title: decode, url: 'none' }
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
          firstLvlArray.push(this.createTermObject(term))
          this.router.navigate([APP_TAXONOMY + decodeURI(topic).replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '')])
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
  getSecondLevelTopic(allLevelObject: any) {
    this.topicKey = []
    if (allLevelObject.identifier) {
    this.topicKey.push(allLevelObject.identifier)
    }
    this. getAllRelatedCourse()
  }
  getAllRelatedCourse() {
    this.relatedResource = []
    this.loader.changeLoad.next(true)
      this._service.fetchAllRelatedCourse(this.topicKey).subscribe(response => {
        const tempRequestParam: { content: any }[] = []
        if (response.result.content) {
        response.result.content.forEach((course: any) => {
          if (course.status === 'Live') {
         const temobj = {
           content: course,
         }
         tempRequestParam.push(temobj)
        }
        })
        this.relatedResource = tempRequestParam
      }

      })
    }
}
