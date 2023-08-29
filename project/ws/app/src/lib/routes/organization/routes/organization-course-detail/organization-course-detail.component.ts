import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ws-app-organization-course-detail',
  templateUrl: './organization-course-detail.component.html',
  styleUrls: ['./organization-course-detail.component.scss']
})
export class OrganizationCourseDetailComponent implements OnInit {
  coursesDetail: any
  constructor(private route: ActivatedRoute) { 
    this.coursesDetail = this.route.parent && this.route.parent.snapshot.data.pageData.data.courseDetail || []
    console.log(this.coursesDetail, 'course detail ===')
  }

  ngOnInit() {
    console.log(this.route.snapshot.params.id, "route data params=")
  }

}
