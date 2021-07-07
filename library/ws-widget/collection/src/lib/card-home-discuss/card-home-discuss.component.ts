import { Component, OnInit, Input, HostBinding } from '@angular/core'
import { WidgetBaseComponent, NsWidgetResolver } from '@sunbird-cb/resolver'
// import { DiscussService } from '@ws/app/src/lib/routes/discuss/services/discuss.service'

/* tslint:disable */
import _ from 'lodash'
import { NSDiscuss } from './discuss.model'
import { Router } from '@angular/router'
/* tslint:enable */
@Component({
  selector: 'ws-widget-home-discuss-component',
  templateUrl: './card-home-discuss.component.html',
  styleUrls: ['./card-home-discuss.component.scss'],
  // providers: [DiscussService],
})
export class CardHomeDiscussComponent extends WidgetBaseComponent implements OnInit, NsWidgetResolver.IWidgetData<any> {
  @Input() widgetData: any
  discuss!: NSDiscuss.IDiscuss
  @HostBinding('id')
  public id = 'h-d-component'
  constructor(
    // private discussService: DiscussService,
    private router: Router
  ) {
    super()
  }

  discussionList = Array()
  // starColor: StarRatingColor = StarRatingColor.accent
  // starColorP: StarRatingColor = StarRatingColor.primary
  // starColorW: StarRatingColor = StarRatingColor.warn
  ngOnInit(): void {
    if (this.widgetData && this.widgetData.content) {
      this.discuss = ([this.widgetData.content] || []).map((d: any) => {
        return {
          tid: d.tid,
          title: d.title,
          description: d.title,
          category: d.category, // d.category.name
          count: d.viewcount,
          timeinfo: d.timestamp,
          user: d.user,
          upvotes: d.upvotes,
          downvotes: d.downvotes,
          tags: d.tags,
          postcount: d.postcount,
          slug: d.slug,

        }
      })[0]
    }
  }

  getUserFullName(user: any) {
    if (user && user.username) {
      return `${user.username.trim()}`
    }
    return ''
  }

  fillPopular() {
    // this.discussService.fetchRecentD().subscribe((response: any) => {
    //   this.discuss = _.get(response, 'topics')
    //   // console.log(this.discuss)
    // })
  }

  getDiscussion(discuss: any) {
    // tslint:disable-next-line:max-line-length
    this.router.navigate([`/app/discussion-forum/topic/${_.trim(_.get(discuss, 'slug'))}`], { queryParams: { page: 'home' }, queryParamsHandling: 'merge' })
  }

  public getBgColor(tagTitle: any) {
    const bgColor = this.stringToColor(tagTitle.toLowerCase())
    const color = this.getContrast()
    return { color, 'background-color': bgColor }
  }

  stringToColor(title: any) {
    let hash = 0
    // tslint:disable-next-line: no-bitwise
    for (const element of title) {
      // tslint:disable-next-line: no-bitwise
      hash = title.charCodeAt(element) + ((hash << 5) - hash)
    }
    const hue = Math.abs(hash % 360)
    // tslint:disable-next-line: prefer-template
    const colour = 'hsl(' + hue + ',100%,30%)'
    return colour
  }

  getContrast() {
    return 'rgba(255, 255, 255, 80%)'
  }
}
