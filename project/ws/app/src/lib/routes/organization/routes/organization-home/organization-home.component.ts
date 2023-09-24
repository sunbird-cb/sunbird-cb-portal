import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router, Event, NavigationEnd, NavigationError } from '@angular/router'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
// import { MatTableDataSource } from '@angular/material/table'

// export interface IPeriodicElement {
//   nameOfInstitute: string
//   sNo: number
//   program: string
//   dates: string
// }

const ELEMENT_DATA = [
  {
    sNo: 1,
    nameOfInstitute: 'Dr. R.S. Tolia Uttarakhand Academy of Administration, Uttarakhand',
    program: 'Sustainable Urbanization Solution in Mountainous Regions: The Way Forward',
    dates: 'October 9, 2023 to October 13, 2023 ',
  },
  {
    sNo: 2,
    nameOfInstitute: 'Bankers Institute of Rural Development, Lucknow ',
    program: 'Farmers Collectives and linking them to market ',
    dates: 'November 6, 2023 to November 10, 2023',
  },
  {
    sNo: 3,
    nameOfInstitute: 'Indian Institute of Human Settlements, Bengaluru',
    program: 'Digital Governance in Urban Infrastructure Projects Delivery Systems (Evidence based) ',
    dates: 'November 6, 2023 to November 10, 2023 ',
  },
  {
    sNo: 4,
    nameOfInstitute: 'O.P. Jindal Global University (JGU), Sonipat, Haryana ',
    program: 'Specialized Course on Law',
    dates: 'November 13, 2023 to November 17, 2023',
  },
  {
    sNo: 5,
    nameOfInstitute: 'Institute of Management in Government, Thiruvananthapuram ',
    program: 'Participatory Management (Community Mobilization) ',
    dates: 'December 4, 2023 to December 8, 2023',
  },
  {
    sNo: 6,
    nameOfInstitute: 'Arun Jaitely National Institute of Financial Management, Faridabad',
    program: 'Infrastructure Finance ',
    dates: 'December 4, 2023 to December 8, 2023',
  },
  {
    sNo: 7,
    nameOfInstitute: 'National Institute of Public Finance and Policy, Delhi ',
    program: 'Fiscal Policy: Management and Emerging issues ',
    dates: 'December 4, 2023 to December 8, 2023',
  },
  {
    sNo: 8,
    nameOfInstitute: 'Nani Palkhivala Arbitration Centre (NPAC), Chennai ',
    program: 'The Theory and Practice of Dispute Resolution ',
    dates: 'December 11, 2023 to December 15, 2023',
  },
  {
    sNo: 9,
    nameOfInstitute: 'National Law School of India University, Bengaluru ',
    program: 'Procurement and Allied Laws ',
    dates: 'December 11, 2023 to December 15, 2023',
  },
  {
    sNo: 10,
    nameOfInstitute: 'Sri Sathya Sai Central Trust, Andhra Pradesh ',
    program: 'Human Values in Governance and Public Policy ',
    dates: 'January 8, 2024 to January 12, 2024 ',
  },
  {
    sNo: 11,
    nameOfInstitute: 'The Art of Living, Bengaluru ',
    program: 'Building Competencies for Personal Excellence ',
    dates: 'January 8, 2024 to January 12, 2024 ',
  },
  {
    sNo: 12,
    nameOfInstitute: 'Isha Yoga Centre, Coimbatore ',
    program: 'Inner Engineering Leadership Program',
    dates: 'January 29, 2024 to February 2, 2024',
  },
  {
    sNo: 13,
    nameOfInstitute: 'Environment Protection Training & Research Institute, Hyderabad',
    program: 'Environment Impact Assessment: Development Projects',
    dates: 'February 5, 2024 to February 9, 2024',
  },
  {
    sNo: 14,
    nameOfInstitute: 'Indian Institute of Management, Visakhapatnam ',
    program: 'Digital Governance and Management ',
    dates: 'February 12, 2024 to February 16, 2024',
  },
  {
    sNo: 15,
    nameOfInstitute: 'IC Centre for Governance, Panchgani',
    program: 'Ethics in Public Services',
    dates: 'February 26, 2024 to March 1, 2024',
  },
  {
    sNo: 16,
    nameOfInstitute: 'Tata Institute of Social Sciences, Mumbai',
    program: 'Social Policy and Governance',
    dates: 'March 18, 2024 to March 22, 2024',
  },
  {
    sNo: 17,
    nameOfInstitute: 'Heartfulness, Telangana',
    program: 'A Journey within for Kaushlam – Excellence in Action',
    dates: 'January 15, 2024 to January 17, 2024 (Online) ',
  },

]

@Component({
  selector: 'ws-app-organization-home',
  templateUrl: './organization-home.component.html',
  styleUrls: ['./organization-home.component.scss'],
})
export class OrganizationHomeComponent implements OnInit, OnDestroy {
  banner!: NsWidgetResolver.IWidgetData<any>
  currentRoute = 'dopt'
  titles = [{ title: 'Register for Inservice Training Program 2023-24', url: '/app/organisation/dopt', icon: '' }]
  private bannerSubscription: any
  courses: any
  displayedColumns: string[] = ['sNo', 'nameOfInstitute', 'program', 'dates']
  dataSource = ELEMENT_DATA

  constructor(
    private route: ActivatedRoute,
    private router: Router
    ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.bindUrl(event.url.replace('app/organisation/dopt', ''))
      }
      if (event instanceof NavigationError) {
      }
    })
    this.bannerSubscription = this.route.data.subscribe((data:any) => {
      if (data && data.pageData) {
        this.banner = data.pageData.data.banner || []
      }
    })

    this.courses = this.route.parent && this.route.parent.snapshot.data.pageData.data.course || []
    // console.log(this.route.parent?.snapshot.data.pageData.data.course, "this.route.parent.snapshot.data.pageData.data")

  }

  bindUrl(path: string) {
    if (path) {
      this.currentRoute = path
      if (this.titles.length > 1) {
        this.titles.pop()
      }
      switch (path) {
        case 'dopt':
          // this.titles.push({ title: 'Network', icon: '', url: 'none' })
          break

        default:
          break
      }
    }
  }

  ngOnInit() {

  }

  ngOnDestroy() {

    if (this.bannerSubscription) {
      this.bannerSubscription.unsubscribe()
    }
  }

}
