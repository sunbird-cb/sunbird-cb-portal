import { Component, OnInit, Input } from '@angular/core'
import { NSDiscussData } from '../../models/discuss.model'
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
  @Input()
  tags! :any
  rem!:number
  showRem =true
  public static get MINIMUM_LENGTH(): number { return 8 };
  constructor(
  ) { }

  ngOnInit() {
    console.log(this.tags)
    if(this.tags && this.tags.length>DiscussCardComponent.MINIMUM_LENGTH){
    this.rem = this.calculateLength(this.tags.length)
    this.tags.length =  DiscussCardComponent.MINIMUM_LENGTH
    }
   }
  upvote(discuss: NSDiscussData.IDiscussionData) {
    if (discuss) {

    }

  }
  downvote(discuss: NSDiscussData.IDiscussionData) {
    console.log(discuss)
    if (discuss) {

    }
  }
  getDiscussion() {
    // this.router.navigate([`/app/discuss/home/${this.discuss.tid}`])
    // this.tags=["2nd Level Topic",  "2nd Level Topic", "2nd Level Topic","small",
    // "2nd Level Topic with large", "2nd Level Topic very large","2nd Level Topic","2nd Level Topic with Extra large",
    // "2nd Level", "2nd Level Topic","2nd Level Topic","small",
    // "2nd Level Topic with large", "2nd Level Topic very large","2nd Level Topic","2nd Level Topic with Extra large",
    // "2nd Level Topic with large", "2nd Level Topic very large","2nd Level Topic","2nd Level Topic with Extra large" ]
    this.showRem =false
  }

  calculateLength(len: number){
    return len-DiscussCardComponent.MINIMUM_LENGTH;
  }
}
