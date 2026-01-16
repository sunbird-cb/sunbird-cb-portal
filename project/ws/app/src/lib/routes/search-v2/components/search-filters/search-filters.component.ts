import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core'
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms'
import { Subscription } from 'rxjs'
import { GbSearchService } from '../../services/gb-search.service'
import { ActivatedRoute, Router } from '@angular/router'
// tslint:disable-next-line
import _ from 'lodash'
import { TranslateService } from '@ngx-translate/core'
import { MultilingualTranslationsService } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'ws-app-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss'],
})
export class SearchFiltersComponent implements OnInit, OnDestroy {
  @Input() newfacets!: any
  @Input() urlparamFilters!: any
  @Output() appliedFilter = new EventEmitter<any>()
  @Input() karmayogiBadge: any
  filterForm: UntypedFormGroup | undefined
  filteroptions: any = []
  userFilters: any = []
  myFilterArray: any = []
  multiplePrimaryCategory: any = []
  onLoad = true
  private subscription: Subscription = new Subscription
  queryParams: any

  constructor(
    private searchSrvc: GbSearchService,
    private activated: ActivatedRoute,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
    private router: Router) {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
     }

  ngOnInit() {
    this.newfacets.forEach((nf: any) => {
      if (nf.name === 'mimeType') {
        const values: any = []
        nf.values.forEach((nfv: any) => {
          const nv = {
            count: '',
            name: '',
          }
          if (nfv.name !== 'video/mp4' && nfv.name !== 'video/x-youtube' && nfv.name !== 'application/json' &&
            nfv.name !== 'application/x-mpegURL' && nfv.name !== 'application/quiz' && nfv.name !== 'image/jpeg' &&
            nfv.name !== 'image/png' && nfv.name !== 'application/vnd.ekstep.html-archive' &&
            nfv.name !== 'application/vnd.ekstep.ecml-archive' && nfv.name !== 'application/vnd.sunbird.questionset') {
            values.push(nfv)
          } else {
            if (nfv.name === 'video/mp4' || nfv.name === 'video/x-youtube' || nfv.name === 'application/x-mpegURL') {
              nv.name = 'Video'
              const indx = values.filter((x: any) => x.name === nv.name)
              if (indx.length === 0) {
                values.push(nv)
              }
            }
            if (nfv.name === 'application/json' || nfv.name === 'application/quiz') {
              nv.name = 'Assessment'
              const indx = values.filter((x: any) => x.name === nv.name)
              if (indx.length === 0) {
                values.push(nv)
              }
            }
            if (nfv.name === 'image/jpeg' || nfv.name === 'image/png') {
              nv.name = 'Image'
              const indx = values.filter((x: any) => x.name === nv.name)
              if (indx.length === 0) {
                values.push(nv)
              }
            }
            if (nfv.name === 'application/vnd.ekstep.html-archive' || nfv.name === 'application/vnd.ekstep.ecml-archive') {
              nv.name = 'Interactive Content'
              const indx = values.filter((x: any) => x.name === nv.name)
              if (indx.length === 0) {
                values.push(nv)
              }
            }
            if (nfv.name === 'application/vnd.sunbird.questionset') {
              nv.name = 'Pratice / Final Assessment'
              const indx = values.filter((x: any) => x.name === nv.name)
              if (indx.length === 0) {
                values.push(nv)
              }
            }
          }
        })
        nf.values = values
      }
      if (nf.name === 'source') {
        nf.values.sort((a: any, b: any) => {
          const textA = a.name.toUpperCase()
          const textB = b.name.toUpperCase()
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
        })
      }
    })
    // this.filteroptions = this.newfacets
    this.filteroptions.push(this.newfacets[0])
    this.activated.queryParamMap.subscribe(queryParams => {
      this.queryParams = queryParams
      if (queryParams.has('f')) {
        const sfilters = JSON.parse(queryParams.get('f') || '{}')
        let fil: any
        this.multiplePrimaryCategory = []
        if (sfilters.primaryCategory.length > 1 && this.onLoad) {
          this.onLoad = false
          sfilters.primaryCategory.forEach((item: any) => {
            if (!this.multiplePrimaryCategory.some((r: any) => item.toLowerCase().includes(r.name))) {
              this.multiplePrimaryCategory.push({
                name: item,
                displayName: item,
                count: '',
                ischecked: true,
              })
            }
          })
        }
        fil = {
          name: sfilters.primaryCategory[0].toLowerCase(),
          count: '',
          ischecked: true,
        }
        this.filteroptions.forEach((fas: any) => {
          fas.values.forEach((fasv: any) => {
            fasv.displayName = fasv.name
            if (fas.name === 'primaryCategory') {
              if (fasv.name === this.toCamelCase(fil.name)) {
                fasv.ischecked = true
              }
            } else {
              fasv.ischecked = false
            }
          })
        })
        if (this.queryParams && this.queryParams.params.q === '') {
          this.modifyUserFilters(fil, 'primaryCategory')
        }
      } else {
        const fil = {
          name: '',
          count: '',
          ischecked: true,
        }
        this.filteroptions.forEach((fas: any) => {
          fas.values.forEach((fasv: any) => {
            fasv.displayName = fasv.name
            if (fas.name === 'primaryCategory') {
              if (fasv.name === this.toCamelCase(fil.name)) {
                fasv.ischecked = true
              }
            } else {
              fasv.ischecked = false
            }
          })
        })

        if (fil.name && fil.count) {
          const reqfilter = {
            mainType: 'primaryCategory',
            name: fil.name,
            count: fil.count,
            ischecked: true,
          }
          this.myFilterArray.push(reqfilter)
        }
        if (this.userFilters.length === 0) {
          this.userFilters.push(fil)
        }
      }
    })
    // if (this.urlparamFilters) {
    //   this.filteroptions.forEach((fas: any) => {
    //     fas.values.forEach((fasv: any) => {
    //       if (this.urlparamFilters && fas.name === this.urlparamFilters.mainType) {
    //           if (fasv.name === this.urlparamFilters.name) {
    //             fasv.ischecked = true
    //           }
    //       } else {
    //         fasv.ischecked = false
    //       }
    //     })
    //   })
    // }

    this.filterForm = new UntypedFormGroup({
      filters: new UntypedFormControl(''),
    })
    this.subscription = this.searchSrvc.notifyObservable$.subscribe((res: any) => {
      const fil = {
        name: res.name,
        displayName: res.displayName,
        count: res.count,
        ischecked: false,
      }
      if (this.userFilters.length === 0) {
        this.userFilters.push(fil)
      }
      this.modifyUserFilters(fil, res.mainType)
    })

    if (this.queryParams.has('t')) {
      const reqfilter = {
        mainType: 'primaryCategory',
        name: 'moderated courses',
        count: 0,
        ischecked: true,
      }
      this.userFilters.push(reqfilter)
      this.myFilterArray.push(reqfilter)
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  getFilterName(fil: any) {
    return this.userFilters.filter((x: any) => {
        const selectedName = x.name  ===  fil.name ? fil.name :
        x.name  === this.toString(fil.name).toLowerCase() ? this.toString(fil.name).toLowerCase() : this.toCamelCase(fil.name)
        return x.name === selectedName
    })
  }
  modifyUserFilters(fil: any, mainparentType: any) {
    const indx = this.getFilterName(fil)
    if (indx.length > 0) {
      this.userFilters.forEach((fs: any, index: number) => {
        if (fs.name === fil.name && this.queryParams.has('t')) {
          setTimeout(() => {
            this.router.navigate(['/app/globalsearch'] , { queryParams: { q: '' } })
          },         500)
        }
        // const selectedName = fs.name ===  fil.name ? fil.name : fs.name  === this.toString(fil.name).toLowerCase()
        // ? this.toString(fil.name).toLowerCase() : this.toCamelCase(fil.name)
        if (fs.name === fil.name) {
          this.userFilters.splice(index, 1)
        }
      })
      this.myFilterArray.forEach((fs: any, index: number) => {
        // const nameVerify = fs.name === this.translateTo(fil.name) ? this.translateTo(fil.name) :
        // this.translateTo(fil.name).toLowerCase()
        if (fs.name === fil.name) {
          this.myFilterArray.splice(index, 1)
        }
      })
      this.filteroptions.forEach((fas: any) => {
        if (fas.name === mainparentType) {
          fas.values.forEach((fasv: any) => {
            const name = fasv.name
            const verifiedName = name === fil.name ? fil.name : this.toCamelCase(fil.name)
            if (name === verifiedName) {
              fasv.ischecked = false
            }

            if (fasv.name === 'moderated courses' && !fasv.ischecked) {
              fasv.qParam = ''
            }

          })
        }
      })
      this.appliedFilter.emit(this.myFilterArray)
    } else {
      if (fil.name === 'moderated course' && this.multiplePrimaryCategory.length > 1) {
        this.userFilters = [...this.multiplePrimaryCategory]
        this.multiplePrimaryCategory.forEach((item: any) => {
          item['mainType'] = mainparentType,
          this.filteroptions.forEach((fas: any) => {
            if (fas.name === mainparentType) {
              fas.values.forEach((fasv: any) => {
                const name = fasv.name
                const verifiedName = name === fil.name ? fil.name : this.toCamelCase(fil.name)
                // const verifiedName = name === item.name ? item.name : name === this.translateTo(item.name) ?
                // this.translateTo(item.name) : this.toCamelCase(item.name)
                if (name === verifiedName) {
                  fasv.ischecked = true
                }
              })
            }
          })
        })

        this.myFilterArray = [...this.multiplePrimaryCategory]
        this.appliedFilter.emit(this.myFilterArray)
      } else {
        this.userFilters.push(fil)

        const reqfilter = {
          mainType: mainparentType,
          name: fil.name,
          displayName: fil.name,
          count: fil.count,
          ischecked: true,
          qParam : '',
        }

        this.filteroptions.forEach((fas: any) => {
          if (fas.name === mainparentType) {
            fas.values.forEach((fasv: any) => {
              const name = fasv.name
              // const verifiedName = name === fil.name ? fil.name : this.translateTo(fil.name)
              const verifiedName = name === fil.name ? fil.name : this.toCamelCase(fil.name)
              if (name === verifiedName) {
                fasv.ischecked = true
              }
            })
          }
        })

        if (reqfilter.name === 'moderated courses' && reqfilter.ischecked) {
          reqfilter.qParam = 't'
        } else {
          reqfilter.qParam = ''
        }

        this.myFilterArray.push(reqfilter)
        this.appliedFilter.emit(this.myFilterArray)

      }
    }
  }
  // getText(val: string) {
  //   return this.translateTo(_.startCase(val || ''))
  // }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }
  translateActualLabels(label: string, type: any) {
    return this.langtranslations.translateActualLabel(label, type, '')
  }

  translateTo(menuName: string): string {
    return this.toCamelCase(menuName)
    // tslint:disable-next-line: prefer-template
    // const translationKey = 'searchfilters.' + name.replace(/\s/g, '')
    // return this.translate.instant(translationKey)
  }
  toCamelCase(str: string) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g,  (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    }).replace(/\s+/g, '')
  }
  toString(str: any) {
    const result = str.replace(/([A-Z])/g, ' $1')
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1)
    return finalResult
  }
}
