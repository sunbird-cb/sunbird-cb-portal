import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core'
import { NSDiscussData } from '../../models/discuss.model'
@Component({
  selector: 'taxonomy-level-card',
  templateUrl: './taxonomy-level-card.component.html',
  styleUrls: ['./taxonomy-level-card.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1' },
  /* tslint:enable */
})

export class TaxonomyLevelCardComponent implements OnInit, OnChanges {
  @Input()
  discuss!: NSDiscussData.IDiscussionData
  @Input()
  tags!: any
  rem!: number
  showNoValue!: boolean
  tagCopy!: any
  @Output() clickedTab = new EventEmitter<string>()

  showRem = true
  public static get MINIMUM_LENGTH(): number { return 8 }
  constructor(
  ) {
   }

  ngOnInit() {
    if (this.tags && this.tags.length > TaxonomyLevelCardComponent.MINIMUM_LENGTH) {

    //
    //
    }
  }

  getClickedTab(tab: string) {
    this.clickedTab.emit(tab)
  }
  getDiscussion() {
    // this.router.navigate([`/app/discuss/home/${this.discuss.tid}`])
    this.tags = []
    this.tags = this.tagCopy
    this.showRem = false
  }

  calculateLength(len: number) {
    return len - TaxonomyLevelCardComponent.MINIMUM_LENGTH
  }
  ngOnChanges(changes: SimpleChanges) {
    this.rem = this.calculateLength(this.tags.length)
    this.tagCopy = [...this.tags]
    if (this.tags.length > TaxonomyLevelCardComponent.MINIMUM_LENGTH) {
    this.tags.length =  TaxonomyLevelCardComponent.MINIMUM_LENGTH
    this.showRem = true
  }
   if (changes.tags.currentValue.length <= 0) {
    this.showNoValue = true
   } else {
    this.showNoValue = false
   }
  }
}
