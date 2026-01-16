import { LoaderService } from '@ws/author/src/lib/services/loader.service'
import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ValueService } from '@sunbird-cb/utils-v2'
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
  currentTab!: any
  currentTab1: any
  arrayTemplate!: any
  relatedResource: any = []
  unread = 0
  currentObj!: any
  nextLvlObj!: any
  tempArr!: any
  leftMenuChildObj!: any
  currentRoute = 'home'
  isFirstTab = true
  resourceLoading = true
  banner!: NsWidgetResolver.IWidgetData<any>
  public screenSizeIsLtMedium = false
  isLtMedium$ = this.valueSvc.isLtMedium$
  topicKey: any = []
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')))
  private defaultSideNavBarOpenedSubscription: any
  isFirst = true
  title: any[] = []
  constructor(private valueSvc: ValueService, private route: ActivatedRoute,
              private router: Router,
              private _service: TaxonomyService,
              private loader: LoaderService) {
    this.unread = this.route.snapshot.data.unread

    this.currentTab = this.route.snapshot.url.toString().split('/').pop() || ''
    this.currentTab1 = this.route.snapshot.url.toString().split('/').pop() || ''
    this.title = [{ title: 'Learn', url: '/page/learn', icon: 'school' },
    { title: ('All topics') , url: 'none', icon: '' }]
    if (!localStorage.getItem('isFirstTab')) {
      localStorage.setItem('currentTab', decodeURI(this.currentTab))
      localStorage.setItem('isFirstTab', 'true')
    }

  }

  ngOnInit() {
    // this.loader.changeLoad.next(true)
    this.arrayTemplate = []
    this.router.navigate([APP_TAXONOMY + localStorage.getItem('currentTab')])

    if (!localStorage.getItem('currentTab')) {
      this.getAllTopics(this.currentTab, true)

    } else {
      this.topicKey.push(localStorage.getItem('currentTab'))
      this.getAllTopics(localStorage.getItem('currentTab') || this.currentTab, true)
    }
    this.arrayTemplate.push(decodeURI(this.currentTab))

    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.sideNavBarOpened = !isLtMedium
      this.screenSizeIsLtMedium = isLtMedium
    })
    this.tempArr  =  [{ title: 'All topics', url: `${APP_TAXONOMY}home` }]
    this.alreadyClicked = true
  }
  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
  }
  getAllTopics(topic: string, needBreadCurmp: boolean) {
    this._service.fetchAllTopics().subscribe(response => {
      this.currentObj = response.terms
      this.nextLvlObj = response.terms
      this.createLeftMenuAndData(this.currentObj, topic, needBreadCurmp)
      })
    }

    createTermObject(termObj: any) {
      const termObject = {
        name: decodeURI(termObj.name),
        enabled: true,
        identifier: termObj.identifier,
        routerLink: this.getRouterString(termObj.name),
      }
      return termObject
    }
    onTabLeftMenu(tabItem: any) {
      const tabName = tabItem.name
      this.arrayTemplate[this.arrayTemplate.length - 1] = tabName
      if (this.arrayTemplate.length > 1) {
        this.getChildrenByArray('none')
      } else {
        this.getFirstChildrenByArray(tabName)
      }

      this.getRouterLink(tabName)
      this.createBreadCrumbs(tabName, 'leftMenu')
      this. getAllRelatedCourse(tabItem.identifier)

    }
    getClickedTab(clickedTab: any) {
      this.arrayTemplate.push(clickedTab.name)
      this.getChildrenByArray(clickedTab.name)
      this.getRouterLink(clickedTab.name)
      this.createBreadCrumbs(clickedTab.name, 'rightMenu')
      this. getAllRelatedCourse(clickedTab.identifier)
    }
  getSecondLevelTopic(allLevelObject: any) {
    this.topicKey = []
    if (allLevelObject.identifier) {
    this.topicKey.push(allLevelObject.identifier)
    }
    this. getAllRelatedCourse(allLevelObject.identifier)
  }
  getAllRelatedCourse(identifier: any) {
    this.relatedResource = []
    this.loader.changeLoad.next(true)
      this._service.fetchAllRelatedCourse(identifier).subscribe(response => {
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
    createLeftMenuAndData(currentObj: any, topic: any, needBradCurmp: boolean) {
      const firstLvlArray: any[] = []
      const tempCurrentArray: any[] = []
      const nextLevel: any[] = []
      currentObj.forEach((term: any) => {
        if (term.name !== decodeURI(topic)) {
          firstLvlArray.push(this.createTermObject(term))
          } else {
          firstLvlArray.splice(0, 0, this.createTermObject(term))
        }
        this.currentTab = term.name
          if (term.name === decodeURI(topic) && term.children) {
            this.getSecondLevelTopic(term)

            term.children.forEach((second: any) => {
              nextLevel.push(second)
              tempCurrentArray.push(second)
            })
          }
      })
      if (needBradCurmp) {
      this.createBreadCrumbs(topic, 'Opening')
      }
      this.firstLevelTopic = firstLvlArray
      this.nextLevelTopic = nextLevel
      this.getRouterLink(this.firstLevelTopic[0].name)
      this.resourceLoading = false

    }
    getLodashData(data: any, topic: any) {
      let arr = []
      for (let i = 0; i < data.length; i = i + 1) {
        if (this.strdecode(data[i].name) === this.strdecode(topic)) {
          arr = data[i].children
          break
        }
      }
      return arr

    }
    strdecode(str: any) {
      return decodeURI(str).replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '')
    }
    getChildrenByArray(tab: string) {
      let gridDataData = []
      let leftMenuData =  this.currentObj
      for (let i = 0; i < this.arrayTemplate.length - 1; i = i + 1) {
        leftMenuData = this.getLodashData(leftMenuData, this.arrayTemplate[i])
          if (leftMenuData) {
            gridDataData = this.getLodashData(leftMenuData, this.arrayTemplate[i + 1])
            this.firstLevelTopic = this.createLeftMenuObjects(leftMenuData, tab)

            this.nextLevelTopic = this.createTagStringsArray(gridDataData)

          }
     }
     this.resourceLoading = false
    }
    getFirstChildrenByArray(tab: string) {
      const leftMenuData =  this.currentObj
      for (let i = 0; i < leftMenuData.length - 1; i = i + 1) {
        if (leftMenuData[i].name === tab) {
          this.nextLevelTopic = this.createTagStringsArray(leftMenuData[i].children)
        }
     }
    }
    createLeftMenuObjects(lftMnu: any, tab: string) {
      const lftmnuArray: any[] = []
      if (tab !== 'none') {
        lftMnu.forEach((lm: any) => {
          if (lm.name !== decodeURI(tab)) {
            lftmnuArray.push(this.createTermObject(lm))
          } else {
            lftmnuArray.splice(0, 0, this.createTermObject(lm))
        }
      })
      } else {
        lftMnu.forEach((lm: any) => {
        lftmnuArray.push(this.createTermObject(lm))
      })
      }
      return lftmnuArray
  }
  createTagStringsArray(tagObjArr: any) {
    const tagArr: any[] = []
    if (tagObjArr) {
      tagObjArr.forEach((tgo: { name: any }) => {
        tagArr.push(tgo)
      })
    }
    return tagArr
  }
  getRouterLink(str: string) {
      return this.router.navigate([this.getRouterString(str)])
  }
  getRouterString(str: string) {
    return APP_TAXONOMY + this.organizeString(str)
  }
  organizeString(str: string) {
    return decodeURI(str).replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '')
  }
  getTab(tab: any) {
    this.resourceLoading = true
    for (let i = 0; i < this.tempArr.length; i = i + 1) {
      const breadCrump = this.tempArr[i]
      if (breadCrump.title === tab) {
        this.router.navigate([decodeURI(breadCrump.url)])
        this.tempArr.length = i + 1

      }
    }
    for (let i = 0; i < this.arrayTemplate.length; i = i + 1) {
      if (this.arrayTemplate[i] === tab) {
        this.arrayTemplate.length = i + 1
        if (this.arrayTemplate.length > 1) {
          this.getChildrenByArray(tab)
        } else {
          this.tempArr.lenght = 1
          this.getAllTopics(tab, false)
        }
        this.getRouterLink(tab)

      }
    }

  }
  createBreadCrumbs(tab: any, place: any) {
    const decodedValue = decodeURI(tab)
    const redirectURl  = { title: decodedValue, url: `${APP_TAXONOMY}${decodedValue}` }
    if (place === 'leftMenu') {
      this.tempArr[this.tempArr.length - 1] = redirectURl
    } else {
      this.tempArr.push(redirectURl)
    }

  }

}
