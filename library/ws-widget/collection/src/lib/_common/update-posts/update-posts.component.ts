import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'ws-update-posts',
  templateUrl: './update-posts.component.html',
  styleUrls: ['./update-posts.component.scss'],
})

export class UpdatePostsComponent implements OnInit {

    @Input("updateConfig") updateConfig: any;
    @Input("isMobile") isMobile: boolean = false;

    updates_posts = {
      data: undefined,
      error: false,
      loadSkeleton: false,
    }

    constructor() {}

    ngOnInit() {
      console.log("isMobile - ", this.isMobile);
      
    }
}