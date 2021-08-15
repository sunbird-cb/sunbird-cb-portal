import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
// import { NSDiscussData } from '../../../discuss/models/discuss.model'
import { ActivatedRoute } from '@angular/router'
// import { MatSnackBar } from '@angular/material'
import { MatDialog } from '@angular/material/dialog'
// import { DiscussService } from '../../../discuss/services/discuss.service'
/* tslint:disable */
import _ from 'lodash'
import { EventService } from '../../services/events.service'
/* tslint:enable */

@Component({
  selector: 'ws-app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit {
  @ViewChild('toastSuccess', { static: true }) toastSuccess!: ElementRef<any>
  @ViewChild('toastError', { static: true }) toastError!: ElementRef<any>
  // data!: NSDiscussData.IDiscussionData
  similarPosts!: any
  defaultError = 'Something went wrong, Please try again after sometime!'
  eventId!: any
  fetchSingleCategoryLoader = false
  eventData: any
  // fetchNewData = false

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private eventSvc: EventService,
    // private discussService: DiscussService,
    // private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventId = params.eventId
      // if (this.fetchNewData) {
      //   this.getTIDData()
      // }
      // this.data = this.route.snapshot.data.topic.data
    })
     this.eventSvc.getEventData(this.eventId).subscribe((data: any) => {
        this.eventData = data.result.event
        const creatordata = this.eventData.creatorDetails
        const str = creatordata.replace(/\\/g, '')
        this.eventData.creatorDetails = JSON.parse(str)
      })
  }

  // fetchSingleCategoryDetails(cid: number) {
    // this.fetchSingleCategoryLoader = true
    // this.discussService.fetchSingleCategoryDetails(cid).subscribe(
    //   (data: NSDiscussData.ICategoryData) => {
    //     this.similarPosts = data.topics
    //     this.fetchSingleCategoryLoader = false
    //   },
    //   (err: any) => {
    //     this.openSnackbar(err.error.message.split('|')[1] || this.defaultError)
    //     this.fetchSingleCategoryLoader = false
    //   })
  // }

  // private openSnackbar(primaryMsg: string, duration: number = 5000) {
  //   this.snackBar.open(primaryMsg, 'X', {
  //     duration,
  //   })
  // }

}
