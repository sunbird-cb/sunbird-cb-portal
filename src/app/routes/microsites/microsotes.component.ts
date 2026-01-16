import { Component, OnInit } from '@angular/core'
import { MicrositeService } from './microsites.service'
import { CommonMethodsService } from '@sunbird-cb/consumption'

@Component({
  selector: 'ws-microsotes',
  templateUrl: './microsotes.component.html',
  styleUrls: ['./microsotes.component.scss'],
})
export class MicrosotesComponent implements OnInit {

  navList: any
  contentDataList: any = []
  loadContentSearch = false
  sectionList: any = [

    {
      'active': true,
      'enabled': true,
      'title': '',
      'key': 'row1',
      'order': 1,
      'column': [
        {
          'active': true,
          'enabled': true,
          'key': 'banner',
          'background': 'infra-background',
          'title': '',
          'colspan': 12,
          'data':  {
            logo: '/assets/instances/eagle/app_logos/KarmayogiBharat_Logo_Horizontal.svg',
            title: 'Department Of Education',
            // tslint:disable-next-line:max-line-length
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
            sliders: [
              {
                'active': true,
                'banners': {
                  'l': 'assets/instances/eagle/banners/orgs/new-banner/6/l.png',
                  'm': 'assets/instances/eagle/banners/orgs/new-banner/6/m.png',
                  's': 'assets/instances/eagle/banners/orgs/new-banner/6/s.png',
                  'xl': 'assets/instances/eagle/banners/orgs/new-banner/6/l.png',
                  'xs': 'assets/instances/eagle/banners/orgs/new-banner/6/s.png',
                  'xxl': 'assets/instances/eagle/banners/orgs/new-banner/6/l.png',
                },
                'redirectUrl': '/app/curatedCollections/do_1137524714202480641252',
                'queryParams': {
                  'tab': 'Learn',
                  'q': 'Salesforce',
                  'lang': 'en',
                  'f': '{}',
                },
                'title': '',
              },
              {
                'active': true,
                'banners': {
                  'l': 'assets/instances/eagle/banners/orgs/new-banner/4/l.png',
                  'm': 'assets/instances/eagle/banners/orgs/new-banner/4/m.png',
                  's': 'assets/instances/eagle/banners/orgs/new-banner/4/s.png',
                  'xl': 'assets/instances/eagle/banners/orgs/new-banner/4/l.png',
                  'xs': 'assets/instances/eagle/banners/orgs/new-banner/4/s.png',
                  'xxl': 'assets/instances/eagle/banners/orgs/new-banner/4/l.png',
                },
                'redirectUrl': '/app/organisation/dopt',
                'queryParams': {
                  'tab': 'Learn',
                  'q': 'Salesforce',
                  'lang': 'en',
                  'f': '{}',
                },
                'title': '',
              },
              {
                'active': true,
                'banners': {
                  'l': 'assets/instances/eagle/banners/orgs/new-banner/2/l.png',
                  'm': 'assets/instances/eagle/banners/orgs/new-banner/2/m.png',
                  's': 'assets/instances/eagle/banners/orgs/new-banner/2/s.png',
                  'xl': 'assets/instances/eagle/banners/orgs/new-banner/2/l.png',
                  'xs': 'assets/instances/eagle/banners/orgs/new-banner/2/s.png',
                  'xxl': 'assets/instances/eagle/banners/orgs/new-banner/2/l.png',
                },
                'redirectUrl': '/app/globalsearch',
                'queryParams': {
                  'tab': 'Learn',
                  'q': 'Salesforce',
                  'lang': 'en',
                  'f': '{}',
                },
                'title': '',
              },
            ],
          },
        },
      ],
    },
    {
      'active': true,
      'enabled': true,
      'title': 'Top Contents',
      'navigation': true,
      'key': 'contentSearch',
      'order': 4,
      'navOrder': 2,
      'column': [
        {
          'active': true,
          'enabled': true,
          'key': 'contentSearch',
          'title': 'Popular courses',
          'data':  {
            'order': 4,
            'strips': [
              {
                'active': true,
                'key': 'topContents',
                'logo': 'school',
                'disableTranslate': true,
                'title': 'Top Contents',
                'stripTitleLink': {
                  'link': '',
                  'icon': '',
                },
                'sliderConfig': {
                  'showNavs': true,
                  'showDots': true,
                  'maxWidgets': 12,
                },
                'stripBackground': '',
                'titleDescription': 'Recently Added',
                'stripConfig': {
                  'cardSubType': 'card-landscape-lib',
                },
                'viewMoreUrl': {
                  'path': '/app/seeAll',
                  'viewMoreText': 'Show all',
                  'queryParams': {
                    'key': 'recentlyAdded',
                  },
                  'loaderConfig': {
                    'cardSubType': 'card-landscape-lib-skeleton',
                  },
                  'stripConfig': {
                    'cardSubType': 'card-landscape-lib',
                  },
                },
                'loader': true,
                'loaderConfig': {
                  'cardSubType': 'card-landscape-lib-skeleton',
                },
                'tabs': [
                ],
                'filters': [],
                'request': {
                  'searchV6': {
                    'request': {
                      'filters': [
                        {
                          'primaryCategory': [
                            'Course',
                          ],
                          'contentType': [
                            'Course',
                          ],
                        },
                      ],
                      'query': '',
                      'sort_by': {
                        'lastUpdatedOn': 'desc',
                      },
                      'fields': [
                        'name',
                        'appIcon',
                        'instructions',
                        'description',
                        'purpose',
                        'mimeType',
                        'gradeLevel',
                        'identifier',
                        'medium',
                        'pkgVersion',
                        'board',
                        'subject',
                        'resourceType',
                        'primaryCategory',
                        'contentType',
                        'channel',
                        'organisation',
                        'trackable',
                        'license',
                        'posterImage',
                        'idealScreenSize',
                        'learningMode',
                        'creatorLogo',
                        'duration',
                        'avgRating',
                      ],
                    },
                  },
                },
              },

            ],
          },
        },
      ],
    },
    {
      'active': true,
      'enabled': true,
      'title': '',
      'key': 'sectionTopBanner',
      'order': 2,
      'column': [
        {
          'active': true,
          'enabled': true,
          'key': 'topSection',
          'title': '',
          'colspan': 12,
          'background': 'banner-metrics',
          'data':  {
            logo: '/assets/instances/eagle/app_logos/KarmayogiBharat_Logo_Horizontal.svg',
            title: 'Department Of Education',
            // tslint:disable-next-line:max-line-length
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
            sliderData: {
              styleData : {
                'bannerMetaClass': 'inline-meta',
                'bannerMeta': 'visible',
                'bannerMetaAlign': 'right',
                'navigationArrows': 'hidden',
                'borderRadius': '0',
                'customHeight': '424px',

                'responsive': {
                  'bannerMetaClass': 'inline-meta',
                  'customHeight': '232px',
                  'bannerMetaAlign': 'right',
                  'navigationArrows': 'visible',
                  'dots': 'hidden',
                  'arrowsPlacement': 'middle-inline',
                },
              },
              sliders: [
                {
                  'active': true,
                  'banners': {
                    'l': 'assets/instances/eagle/banners/orgs/new-banner/6/l.png',
                    'm': 'assets/instances/eagle/banners/orgs/new-banner/6/m.png',
                    's': 'assets/instances/eagle/banners/orgs/new-banner/6/s.png',
                    'xl': 'assets/instances/eagle/banners/orgs/new-banner/6/l.png',
                    'xs': 'assets/instances/eagle/banners/orgs/new-banner/6/s.png',
                    'xxl': 'assets/instances/eagle/banners/orgs/new-banner/6/l.png',
                  },
                  'redirectUrl': '/app/curatedCollections/do_1137524714202480641252',
                  'queryParams': {
                    'tab': 'Learn',
                    'q': 'Salesforce',
                    'lang': 'en',
                    'f': '{}',
                  },
                  'title': '',
                },
                {
                  'active': true,
                  'banners': {
                    'l': 'assets/instances/eagle/banners/orgs/new-banner/4/l.png',
                    'm': 'assets/instances/eagle/banners/orgs/new-banner/4/m.png',
                    's': 'assets/instances/eagle/banners/orgs/new-banner/4/s.png',
                    'xl': 'assets/instances/eagle/banners/orgs/new-banner/4/l.png',
                    'xs': 'assets/instances/eagle/banners/orgs/new-banner/4/s.png',
                    'xxl': 'assets/instances/eagle/banners/orgs/new-banner/4/l.png',
                  },
                  'redirectUrl': '/app/organisation/dopt',
                  'queryParams': {
                    'tab': 'Learn',
                    'q': 'Salesforce',
                    'lang': 'en',
                    'f': '{}',
                  },
                  'title': '',
                },
                {
                  'active': true,
                  'banners': {
                    'l': 'assets/instances/eagle/banners/orgs/new-banner/2/l.png',
                    'm': 'assets/instances/eagle/banners/orgs/new-banner/2/m.png',
                    's': 'assets/instances/eagle/banners/orgs/new-banner/2/s.png',
                    'xl': 'assets/instances/eagle/banners/orgs/new-banner/2/l.png',
                    'xs': 'assets/instances/eagle/banners/orgs/new-banner/2/s.png',
                    'xxl': 'assets/instances/eagle/banners/orgs/new-banner/2/l.png',
                  },
                  'redirectUrl': '/app/globalsearch',
                  'queryParams': {
                    'tab': 'Learn',
                    'q': 'Salesforce',
                    'lang': 'en',
                    'f': '{}',
                  },
                  'title': '',
                },
              ],
            },
            metrics: {
              'background': 'banner-metrics',
              data: [
                {
                  // tslint:disable-next-line:max-line-length
                  icon: 'https://portal.karmayogi.nic.in/content-store/content/do_114046451196010496124/artifact/do_114046451196010496124_1714654805343_star_new.svg',
                  iconColor: 'white',
                  header: '4.1',
                  headercolor: 'white',
                  description: 'Average Course Rating',
                  descriptionColor: 'black',
                  linebreak: true,
                  background: 'banner-metrics',
                },
                {
                  // tslint:disable-next-line:max-line-length
                  icon: 'https://portal.karmayogi.nic.in/content-store/content/do_114046436426571776121/artifact/do_114046436426571776121_1714652906747_player_new.svg',
                  iconColor: 'white',
                  header: '1234',
                  headercolor: 'white',
                  description: 'Content Available',
                  descriptionColor: 'black',
                  linebreak: true,
                  background: 'banner-metrics',
                },
                {
                  // tslint:disable-next-line:max-line-length
                  icon: 'https://portal.karmayogi.nic.in/content-store/content/do_114046440404254720122/artifact/do_114046440404254720122_1714653412175_user_new.svg',
                  iconColor: 'white',
                  header: '7890',
                  headercolor: 'white',
                  description: 'Enrolments So Far',
                  descriptionColor: 'black',
                  linebreak: true,
                  background: 'banner-metrics',
                },
                {
                  // tslint:disable-next-line:max-line-length
                  icon: 'https://portal.karmayogi.nic.in/content-store/content/do_114046442280345600123/artifact/do_114046442280345600123_1714653617350_badge_new.svg',
                  iconColor: 'white',
                  header: '5678',
                  headercolor: 'white',
                  description: 'Certificates Issued So Far',
                  descriptionColor: 'black',
                  linebreak: false,
                  background: 'banner-metrics',
                },
              ],
            },
          },
        },
      ],
    },
    {
      'active': true,
      'enabled': true,
      'title': 'Infrastructure Details',
      'navigation': true,
      'key': 'sectionInfrastructure',
      'order': 8,
      'navOrder': 1,
      'column': [
        {
          'active': true,
          'enabled': true,
          'key': 'infra',
          'background': 'infra-background',
          'title': '',
          'colspan': 12,
          'data': {
            'detaulTitle': 'Know The',
            'myTitle': 'Infrastructure Details.',
            // tslint:disable-next-line:max-line-length
            'description': 'Infrastructure is integral to creating a conducive and enriching learning environment.',
            'dataColSpan': 2,
            'background': 'infra-background',
            'metrics': [
              {
                // tslint:disable-next-line:max-line-length
                icon: 'https://portal.karmayogi.nic.in/content-store/content/do_114041375850471424132/artifact/do_114041375850471424132_1714035157784_group.svg',
                iconColor: 'white',
                header: '86',
                headercolor: 'white',
                description: 'Available Classrooms',
                descriptionColor: 'white custom-opacity',
                linebreak: false,
                background: 'tranparent',
              },
              {
                // tslint:disable-next-line:max-line-length
                icon: 'https://portal.karmayogi.nic.in/content-store/content/do_114041379912810496135/artifact/do_114041379912810496135_1714035650285_auto_stories.svg',
                iconColor: 'white',
                header: '4',
                headercolor: 'white',
                description: 'Functioning Computer Labs',
                descriptionColor: 'white custom-opacity',
                linebreak: false,
                background: 'tranparent',
              },
              {
                // tslint:disable-next-line:max-line-length
                icon: 'https://portal.karmayogi.nic.in/content-store/content/do_114041377520844800133/artifact/do_114041377520844800133_1714035357308_computer.svg',
                iconColor: 'white',
                header: '2',
                headercolor: 'white',
                description: 'Functioning Libraries',
                descriptionColor: 'white custom-opacity',
                linebreak: false,
                background: 'tranparent',
              },
              {
                // tslint:disable-next-line:max-line-length
                icon: 'https://portal.karmayogi.nic.in/content-store/content/do_114041366180069376130/artifact/do_114041366180069376130_1714033990328_podium.svg',
                iconColor: 'white',
                header: '6',
                headercolor: 'white',
                description: 'Auditoriums',
                descriptionColor: 'white custom-opacity',
                linebreak: false,
                background: 'tranparent',
              },
            ],
            sliderData: {
              styleData : {
                'borderRadius': '12px',
                'customHeight': '344px',
                'bannerMeta': 'visible',
                'responsive': {
                  'customHeight': '232px',
                  'bannerMetaAlign': 'left',
                  'navigationArrows': 'visible',
                  'arrowsPlacement': 'bottom-right',
                },
              },
              sliders: [
                {
                  'active': true,
                  'banners': {
                    'l': 'assets/instances/eagle/banners/orgs/new-banner/6/l.png',
                    'm': 'assets/instances/eagle/banners/orgs/new-banner/6/m.png',
                    's': 'assets/instances/eagle/banners/orgs/new-banner/6/s.png',
                    'xl': 'assets/instances/eagle/banners/orgs/new-banner/6/l.png',
                    'xs': 'assets/instances/eagle/banners/orgs/new-banner/6/s.png',
                    'xxl': 'assets/instances/eagle/banners/orgs/new-banner/6/l.png',
                  },
                  'redirectUrl': '/app/curatedCollections/do_1137524714202480641252',
                  'queryParams': {
                    'tab': 'Learn',
                    'q': 'Salesforce',
                    'lang': 'en',
                    'f': '{}',
                  },
                  'title': '',
                },
                {
                  'active': true,
                  'banners': {
                    'l': 'assets/instances/eagle/banners/orgs/new-banner/4/l.png',
                    'm': 'assets/instances/eagle/banners/orgs/new-banner/4/m.png',
                    's': 'assets/instances/eagle/banners/orgs/new-banner/4/s.png',
                    'xl': 'assets/instances/eagle/banners/orgs/new-banner/4/l.png',
                    'xs': 'assets/instances/eagle/banners/orgs/new-banner/4/s.png',
                    'xxl': 'assets/instances/eagle/banners/orgs/new-banner/4/l.png',
                  },
                  'redirectUrl': '/app/organisation/dopt',
                  'queryParams': {
                    'tab': 'Learn',
                    'q': 'Salesforce',
                    'lang': 'en',
                    'f': '{}',
                  },
                  'title': '',
                },
                {
                  'active': true,
                  'banners': {
                    'l': 'assets/instances/eagle/banners/orgs/new-banner/2/l.png',
                    'm': 'assets/instances/eagle/banners/orgs/new-banner/2/m.png',
                    's': 'assets/instances/eagle/banners/orgs/new-banner/2/s.png',
                    'xl': 'assets/instances/eagle/banners/orgs/new-banner/2/l.png',
                    'xs': 'assets/instances/eagle/banners/orgs/new-banner/2/s.png',
                    'xxl': 'assets/instances/eagle/banners/orgs/new-banner/2/l.png',
                  },
                  'redirectUrl': '/app/globalsearch',
                  'queryParams': {
                    'tab': 'Learn',
                    'q': 'Salesforce',
                    'lang': 'en',
                    'f': '{}',
                  },
                  'title': '',
                },
              ],
            },
          },
        },
      ],
    },
    {
      'active': true,
      'enabled': true,
      'title': 'Featured Contents',
      'navigation': true,
      'key': 'sectionFeatureCourses',
      'order': 4,
      'navOrder': 2,
      'column': [
        {
          'active': true,
          'enabled': true,
          'key': 'contentFeaturedStrip',
          'title': 'Popular courses',
          'data':  {
            'order': 4,
            'strips': [
              {
                'active': true,
                'key': 'featuredContents',
                'logo': 'school',
                'disableTranslate': true,
                'title': 'Featured Contents',
                'stripTitleLink': {
                  'link': '',
                  'icon': '',
                },
                'sliderConfig': {
                  'showNavs': true,
                  'showDots': true,
                  'maxWidgets': 12,
                },
                'stripBackground': '',
                'titleDescription': 'Recently Added',
                'stripConfig': {
                  'cardSubType': 'card-portrait-lib',
                },
                'viewMoreUrl': {
                  'path': '/app/seeAll',
                  'viewMoreText': 'Show all',
                  'queryParams': {
                    'key': 'recentlyAdded',
                  },
                  'loaderConfig': {
                    'cardSubType': 'card-portrait-lib-skeleton',
                  },
                  'stripConfig': {
                    'cardSubType': 'card-portrait-lib',
                  },
                },
                'loader': true,
                'loaderConfig': {
                  'cardSubType': 'card-portrait-lib-skeleton',
                },
                'tabs': [
                ],
                'filters': [],
                'request': {
                  'searchV6': {
                    'request': {
                      'filters': [
                        {
                          'primaryCategory': [
                            'Course',
                          ],
                          'contentType': [
                            'Course',
                          ],
                        },
                      ],
                      'query': '',
                      'sort_by': {
                        'lastUpdatedOn': 'desc',
                      },
                      'fields': [
                        'name',
                        'appIcon',
                        'instructions',
                        'description',
                        'purpose',
                        'mimeType',
                        'gradeLevel',
                        'identifier',
                        'medium',
                        'pkgVersion',
                        'board',
                        'subject',
                        'resourceType',
                        'primaryCategory',
                        'contentType',
                        'channel',
                        'organisation',
                        'trackable',
                        'license',
                        'posterImage',
                        'idealScreenSize',
                        'learningMode',
                        'creatorLogo',
                        'duration',
                        'avgRating',
                      ],
                    },
                  },
                },
              },

            ],
          },
        },
      ],
    },
    {
      'active': true,
      'enabled': true,
      'title': 'Top Contents',
      'navigation': true,
      'key': 'sectionPopularCourses',
      'order': 4,
      'navOrder': 2,
      'column': [
        {
          'active': true,
          'enabled': true,
          'key': 'contentTopStrip',
          'title': 'Popular courses',
          'data':  {
            'order': 4,
            'strips': [
              {
                'active': true,
                'key': 'topContents',
                'logo': 'school',
                'disableTranslate': true,
                'title': 'Top Contents',
                'stripTitleLink': {
                  'link': '',
                  'icon': '',
                },
                'sliderConfig': {
                  'showNavs': true,
                  'showDots': true,
                  'maxWidgets': 12,
                },
                'stripBackground': '',
                'titleDescription': 'Recently Added',
                'stripConfig': {
                  'cardSubType': 'card-portrait-lib',
                },
                'viewMoreUrl': {
                  'path': '/app/seeAll',
                  'viewMoreText': 'Show all',
                  'queryParams': {
                    'key': 'recentlyAdded',
                  },
                  'loaderConfig': {
                    'cardSubType': 'card-portrait-lib-skeleton',
                  },
                  'stripConfig': {
                    'cardSubType': 'card-portrait-lib',
                  },
                },
                'loader': true,
                'loaderConfig': {
                  'cardSubType': 'card-portrait-lib-skeleton',
                },
                'tabs': [
                ],
                'filters': [],
                'request': {
                  'searchV6': {
                    'request': {
                      'filters': [
                        {
                          'primaryCategory': [
                            'Course',
                          ],
                          'contentType': [
                            'Course',
                          ],
                        },
                      ],
                      'query': '',
                      'sort_by': {
                        'lastUpdatedOn': 'desc',
                      },
                      'fields': [
                        'name',
                        'appIcon',
                        'instructions',
                        'description',
                        'purpose',
                        'mimeType',
                        'gradeLevel',
                        'identifier',
                        'medium',
                        'pkgVersion',
                        'board',
                        'subject',
                        'resourceType',
                        'primaryCategory',
                        'contentType',
                        'channel',
                        'organisation',
                        'trackable',
                        'license',
                        'posterImage',
                        'idealScreenSize',
                        'learningMode',
                        'creatorLogo',
                        'duration',
                        'avgRating',
                      ],
                    },
                  },
                },
              },

            ],
          },
        },
      ],
    },
    {
      'active': true,
      'enabled': true,
      'title': '',
      'key': 'sectionCompetency',
      'order': 5,
      'column': [
        {
          'active': true,
          'enabled': true,
          'key': 'competency',
          'title': 'Competency Strength',
          'colspan': 12,
          'background': 'competencies-backgroud',
          'data': [],
        },
      ],
    },
    {
      'active': true,
      'enabled': true,
      'title': '',
      'key': 'sectionTopBanner',
      'order': 2,
      'column': [
        {
          'active': true,
          'enabled': true,
          'key': 'topProviders',
          'title': '',
          'colspan': 12,
          'data':  {
            'detaulTitle': 'Know The',
            'myTitle': 'Infrastructure Details.',
            // tslint:disable-next-line:max-line-length
            'description': 'Infrastructure is integral to creating a conducive and enriching learning environment.',
            'dataColSpan': 2,
            'background': 'infra-background',
            'users' : [
              {
                'userId': 1,
                'firstName': 'Christopher Fernandes',
                // tslint:disable-next-line:max-line-length
                'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
                // tslint:disable-next-line:max-line-length
                'profileImage': 'https://images.pexels.com/photos/573299/pexels-photo-573299.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              },
              {
                'userId': 1,
                'firstName': 'Bharath Kumar',
                // tslint:disable-next-line:max-line-length
                'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
                // tslint:disable-next-line:max-line-length
                'profileImage': 'https://images.pexels.com/photos/573299/pexels-photo-573299.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              },
              {
                'userId': 1,
                'firstName': 'Venkata Subbaiah ',
                // tslint:disable-next-line:max-line-length
                'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
                // tslint:disable-next-line:max-line-length
                'profileImage': 'https://images.pexels.com/photos/573299/pexels-photo-573299.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              },

            ],
            'channels': [
              {
                // tslint:disable-next-line:max-line-length
                'appIcon': 'https://static.karmayogiprod.nic.in/igotqa/collection/do_1140612307621969921232/artifact/do_1140144030484480001206_1710742559879_capture391710742560259.thumb.png',
                // tslint:disable-next-line:max-line-length
                'posterImage': 'https://portal.karmayogiqa.nic.in/content-store/content/do_1140144030484480001206/artifact/do_1140144030484480001206_1710742559879_capture391710742560259.png',
                'identifier' : 'do_1140612307621969921232',
                'name': 'National Institute of Ayurveda',
              },
              {
                // tslint:disable-next-line:max-line-length
                'appIcon': 'https://static.karmayogiprod.nic.in/igotqa/collection/do_1140612307621969921232/artifact/do_1140144030484480001206_1710742559879_capture391710742560259.thumb.png',
                // tslint:disable-next-line:max-line-length
                'posterImage': 'https://portal.karmayogiqa.nic.in/content-store/content/do_1140144030484480001206/artifact/do_1140144030484480001206_1710742559879_capture391710742560259.png',
                'identifier' : 'do_1140612307621969921232',
                'name': 'Ministry of External Affairs',
              },
              {
                // tslint:disable-next-line:max-line-length
                'appIcon': 'https://static.karmayogiprod.nic.in/igotqa/collection/do_1140612307621969921232/artifact/do_1140144030484480001206_1710742559879_capture391710742560259.thumb.png',
                // tslint:disable-next-line:max-line-length
                'posterImage': 'https://portal.karmayogiqa.nic.in/content-store/content/do_1140144030484480001206/artifact/do_1140144030484480001206_1710742559879_capture391710742560259.png',
                'identifier' : 'do_1140612307621969921232',
                'name': 'The National Fisheries Development Board (NFDB',
              },
            ],
          },
        },
      ],
    },
  ]

  constructor(
    public contentSvc: MicrositeService,
    public commonSvc: CommonMethodsService
) { }

  ngOnInit() {
    this.getNavitems()
    this.getDataFromSearch()
  }

  getNavitems() {
    this.navList = this.sectionList.filter(
      (obj: any) => obj.enabled && obj.navigation && obj.navOrder).sort(
        (a: any, b: any) => a.navOrder - b.navOrder)
  }

  scrollToSection(name:  string) {
    let section: HTMLElement | any
    section = document.getElementById(name)
    if (section) {
      // section.scrollIntoView({ behavior: 'smooth', block: 'start',inline: 'nearest', offsetTop: yOffset  })
      window.scrollTo({
        top: section.offsetTop - 121,
        behavior: 'smooth',
      })
    }
  }
  async getDataFromSearch(requestData?: any) {
    const request  = requestData || this.formRequest()
    const sectionData = this.sectionList.filter((ele: any) => ele.key === 'contentSearch')
    if (sectionData && sectionData.length) {
    const strip: any = sectionData[0].column[0].data && sectionData[0].column[0].data.strips[0]
    try {
      this.loadContentSearch = true
      const response = await this.fetchFromSearchV6(request)
      if (response && response.results) {
        if (response.results.result.content) {
         this.contentDataList = this.commonSvc.transformContentsToWidgets(response.results.result.content, strip)
        }
        this.loadContentSearch = false
      }
    } catch (error) {
      // Handle errors
      // console.error('Error:', error);
    }
    }
  }

  async fetchFromSearchV6(request: any) {
      return new Promise<any>((resolve, reject) => {
        if (request) {
          this.contentSvc.searchV6(request).subscribe(results => {
              resolve({ results })
            },                                        (error: any) => {
              reject(error)
            },
          )
        }
      })
  }
  handleSearchQuery(e: any) {
    if (e.target.value) {
      const request = this.formRequest(e.target.value)
      this.getDataFromSearch(request)
    }
  }
  formRequest(queryText?: any, addFilter?: any) {
    this.loadCardSkeletonLoader()
    const request: any = {
      'request': {
          'query': queryText || '',
          'filters': {
              'contentType': 'Course',
              ...addFilter,
              'status': [
                  'Live',
              ],
          },
          'sort_by': {
              'lastUpdatedOn': 'desc',
          },
          'offset': 0,
          'fields': [
          ],
      },
    }
    return request
  }

  loadCardSkeletonLoader() {
    const sectionData = this.sectionList.filter((ele: any) => ele.key === 'contentSearch')
    if (sectionData && sectionData.length) {
        const strip: any = sectionData[0].column[0].data && sectionData[0].column[0].data.strips[0]
      this.contentDataList = this.commonSvc.transformSkeletonToWidgets(strip)
    }
  }
}
