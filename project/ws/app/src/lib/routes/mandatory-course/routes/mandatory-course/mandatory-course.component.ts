import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core'
import { NsContent } from '@sunbird-cb/collection/src/public-api'
import { ActivatedRoute } from '@angular/router'
import { NSMandatoryCourseData } from '../../models/mandatory-course.model'

@Component({
  selector: 'ws-app-mandatory-course',
  templateUrl: './mandatory-course.component.html',
  styleUrls: ['./mandatory-course.component.scss'],
})
export class MandatoryCourseComponent implements OnInit, OnDestroy, OnChanges {
  public displayLoader = false
  defaultThumbnail = ''
  stateData: {
    param: any, path: any
  } | undefined
  enrolledCourses: any
  mandatoryCourses: any
  stats: NSMandatoryCourseData.IMandatoryCourseStats = {
    totalCourses: 0,
    inprogress: 0,
    notStarted: 0,
    completed: 0,
  }
  // searchCompArea = new FormControl('')
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school' },
    { title: 'Manadatory course', url: 'none', icon: '' },
  ]

  constructor(
    private route: ActivatedRoute,
  ) {
    this.stateData = { param: '', path: 'mandatory-course' }
  }

  ngOnInit() {
    this.enrolledCourses = this.route.snapshot.data.enrollmentList.data
    this.getMandatoryCourses()
  }

  getMandatoryCourses() {
    let content: NsContent.IContent[] = []
    let contentNew: NsContent.IContent[] = []
    const goals = this.enrolledCourses.reduce((acc: any[], cur: any) => {
      if (cur && cur.content && cur.content.primaryCategory === NsContent.EPrimaryCategory.MANDATORY_COURSE_GOAL) {
        acc.push(cur)
        return acc
      }
      return acc
    // tslint:disable-next-line: align
    }, [])

    if (goals && goals.length) {
      content = goals.map((c: any) => {
        const contentTemp: NsContent.IContent = c.content
        contentTemp.batch = c.batch
        contentTemp.completionPercentage = c.completionPercentage || 0
        contentTemp.completionStatus = c.completionStatus || 0
        return contentTemp
      })
    }
    // To filter content with completionPercentage > 0,
    // so that only those content will show in home page
    // continue learing strip
    // if (content && content.length) {
    //   contentNew = content.filter((c: any) => {
    //     if (c.completionPercentage && c.completionPercentage > 0) {
    //       return c
    //     }
    //   })
    // }

    // To sort in descending order of the enrolled date
    contentNew = content.sort((a: any, b: any) => {
      const dateA: any = new Date(a.enrolledDate || 0)
      const dateB: any = new Date(b.enrolledDate || 0)
      return dateB - dateA
    })
    this.mandatoryCourses = contentNew
    this.calculateStats()
  }

  calculateStats() {
    if (this.mandatoryCourses && this.mandatoryCourses.length) {
      this.stats.totalCourses = this.mandatoryCourses.length
      this.mandatoryCourses.map((c: any) => {
        if ((c.completionPercentage > 0 && c.completionPercentage < 100) || c.completionStatus === 1) {
          this.stats.inprogress = this.stats.inprogress + 1
        }
        if (c.completionStatus === 0) {
          this.stats.notStarted = this.stats.notStarted + 1
        }
        if (c.completionStatus === 2 || c.completionPercentage >= 100) {
          this.stats.completed = this.stats.notStarted + 1
        }
      })
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.param.currentValue) {
      // this.getSearchedData()
    }
  }

  ngOnDestroy() {
    // if (this.paramSubscription) {
    //   this.paramSubscription.unsubscribe()
    // }
  }

}
