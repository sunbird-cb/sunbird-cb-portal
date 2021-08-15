import { Component, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'ws-app-today-event-card',
  templateUrl: './today-event-card.component.html',
  styleUrls: ['./today-event-card.component.scss'],
})
export class TodayEventCardComponent implements OnInit {
  @Input() eventData: any
  isLive = true

  constructor(private router: Router) { }

  ngOnInit() {
  }
  getEventDetails(eventID: any) {
    // this.router.navigate([`/app/event-hub/home/${this.discuss.tid}`])
    this.router.navigate([`/app/event-hub/home/${eventID}`])
  }
}
