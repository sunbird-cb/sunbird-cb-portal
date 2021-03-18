import { Component, OnInit, Input } from '@angular/core'
import { NSDiscussData } from '../../models/discuss.model'
import { DiscussUtilsService } from '../../services/discuss-utils.service'
@Component({
  selector: 'app-dicuss-card',
  templateUrl: './discuss-card.component.html',
  styleUrls: ['./discuss-card.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 margin-top-l' },
  /* tslint:enable */
})

export class DiscussCardComponent implements OnInit {
  @Input()
  discuss!: NSDiscussData.IDiscussionData
  tags:any=[]
  rem!:number
  showRem =true
  public static get MINIMUM_LENGTH(): number { return 8 };
  constructor(
    private discussUtils: DiscussUtilsService,
  ) { }

  ngOnInit() {
    console.log(this.discuss)
  this.tags=["2nd Level Topic",  "2nd Level Topic", "2nd Level Topic","small",
  "2nd Level Topic with large", "2nd Level Topic very large","2nd Level Topic","2nd Level Topic with Extra large",
  "2nd Level", "2nd Level Topic","2nd Level Topic","small",
  "2nd Level Topic with large", "2nd Level Topic very large","2nd Level Topic","2nd Level Topic with Extra large",
  "2nd Level Topic with large", "2nd Level Topic very large","2nd Level Topic","2nd Level Topic with Extra large" ]
  this.rem = this.calculateLength(this.tags.length)
  this.tags.length =  DiscussCardComponent.MINIMUM_LENGTH
   }
  upvote(discuss: NSDiscussData.IDiscussionData) {
    // console.log(discuss)
    if (discuss) {

    }

  }
  downvote(discuss: NSDiscussData.IDiscussionData) {
    // console.log(discuss)
    if (discuss) {

    }
  }
  getDiscussion() {
    // this.router.navigate([`/app/discuss/home/${this.discuss.tid}`])
    this.tags=["2nd Level Topic",  "2nd Level Topic", "2nd Level Topic","small",
    "2nd Level Topic with large", "2nd Level Topic very large","2nd Level Topic","2nd Level Topic with Extra large",
    "2nd Level", "2nd Level Topic","2nd Level Topic","small",
    "2nd Level Topic with large", "2nd Level Topic very large","2nd Level Topic","2nd Level Topic with Extra large",
    "2nd Level Topic with large", "2nd Level Topic very large","2nd Level Topic","2nd Level Topic with Extra large" ]
    this.showRem =false
  }

  public getBgColor(tagTitle: any) {
    const bgColor = this.discussUtils.stringToColor(tagTitle.toLowerCase())
    const color = this.discussUtils.getContrast(bgColor)
    return { color, 'background-color': bgColor }
  }
  calculateLength(len: number){
    return len-DiscussCardComponent.MINIMUM_LENGTH;
  }
}
