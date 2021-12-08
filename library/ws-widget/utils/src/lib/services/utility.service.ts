import { Platform } from '@angular/cdk/platform'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Router, NavigationEnd, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router'
import { WsEvents } from './event.model'
interface IWindowMobileAppModified extends Window {
  appRef?: any
  webkit?: any
}
declare var window: IWindowMobileAppModified

const RANDOM_ID_PER_USER = 0
interface IRecursiveData {
  identifier: string
  children: null | IRecursiveData[]
}

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  currentRouteData: any[] = []
  constructor(
    private http: HttpClient,
    private platform: Platform,
    private router: Router,
    private route: ActivatedRoute,
    // private events: EventService,
  ) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        // let snapshot = this.router.routerState.firstChild(this.activatedRoute).snapshot
        // console.log('this.route.snapshot :: ', this.route.snapshot)
        const snapshot = this.route.snapshot
        // console.log('root.snapshot.root.firstChild ', snapshot.root.firstChild)
        // console.log('firstChild ', snapshot.firstChild)
        const firstChild = snapshot.root.firstChild
        this.getChildRouteData(snapshot, firstChild)
      }
    })
  }

  private getChildRouteData(snapshot: ActivatedRouteSnapshot, firstChild: ActivatedRouteSnapshot | null) {
    if (firstChild) {
      if (firstChild.data) {
        // console.log('firstChild.data', firstChild.data)
        this.currentRouteData.push(firstChild.data)
      }
      if (firstChild.firstChild) {
        this.getChildRouteData(snapshot, firstChild.firstChild)
      }
    }
  }

  get randomId() {
    return RANDOM_ID_PER_USER + 1
  }

  getJson<T>(url: string): Observable<T> {
    return this.http.get<T>(url)
  }

  getLeafNodes<T extends IRecursiveData>(node: T, nodes: T[]): T[] {
    if ((node.children || []).length === 0) {
      nodes.push(node)
    } else {
      if (node.children) {
        node.children.forEach(child => {
          this.getLeafNodes(child, nodes)
        })
      }
    }
    return nodes
  }
  getPath<T extends IRecursiveData>(node: T, id: string): T[] {
    const path: T[] = []
    this.hasPath(node, path, id)
    return path
  }

  private hasPath<T extends IRecursiveData>(node: T, pathArr: T[], id: string): boolean {
    if (node == null) {
      return false
    }
    pathArr.push(node)
    if (node.identifier === id) {
      return true
    }
    const children = node.children || []
    if (children.some(u => this.hasPath(u, pathArr, id))) {
      return true
    }
    pathArr.pop()
    return false
  }

  get isMobile(): boolean {
    if (this.isIos || this.isAndroid) {
      return true
    }
    return false
  }

  get isIos(): boolean {
    return this.platform.IOS
  }

  get isAndroid(): boolean {
    return this.platform.ANDROID
  }
  get isAndroidApp(): boolean {
    return Boolean(window.appRef)
  }

  get iOsAppRef() {
    if (
      window.webkit &&
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers.appRef
    ) {
      return window.webkit.messageHandlers.appRef
    }
    return null
  }

  public setRouteData(data: any) {
    this.currentRouteData = data
  }

  get routeData(): WsEvents.ITelemetryContext {
    const data: WsEvents.ITelemetryContext = {
      module: '',
      pageId: '',
    }
    // tslint:disable-next-line: no-console
    // console.log('Final currentDataRoute get routeData()', this.currentRouteData)
    this.currentRouteData.map((rd: any) => {
      if (rd.pageId) {
        data.pageId = `${data.pageId}/${rd.pageId}`
      }
      if (rd.module) {
        data.module = rd.module
      }
    })
    return data
  }
}
