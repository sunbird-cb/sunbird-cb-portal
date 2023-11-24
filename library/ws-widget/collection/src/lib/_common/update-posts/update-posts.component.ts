import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'ws-widget-update-posts',
  templateUrl: './update-posts.component.html',
  styleUrls: ['./update-posts.component.scss'],
})

export class UpdatePostsComponent implements OnInit {

    @Input() updateConfig: any
    @Input() updatesPosts: any
    @Input() isMobile = false

    constructor() {}

    ngOnInit() { }
}
