import { Component, OnInit } from '@angular/core'
import { NSKnowledgeResource } from '../../models/knowledge-resource.models'
import { ActivatedRoute } from '@angular/router'
import { KnowledgeResourceService } from '../../services/knowledge-resource.service'
// tslint:disable
import _ from 'lodash'
import { TranslateService } from '@ngx-translate/core'
// tslint:enable

@Component({
  selector: 'ws-app-knowledge-saved',
  templateUrl: './knowledge-saved.component.html',
  styleUrls: ['./knowledge-saved.component.scss'],
  // tslint:disable-next-line
  host: { class: 'flex flex-1 margin-top-xl competency_main_block' },
})
export class KnowledgeSavedComponent implements OnInit {
  allResources!: NSKnowledgeResource.IResourceData[]
  searchText = ''
  // kwResources: any;
  constructor(private activateRoute: ActivatedRoute,
              private kwResources: KnowledgeResourceService,
              private translate: TranslateService,
    ) {
      this.filterSaved(null)
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
  }

  ngOnInit() {

  }

  filterSaved(data: NSKnowledgeResource.IResourceData[] | null) {
    if (data != null)  {
      this.allResources = _.filter(data, { bookmark: true }) || []
    } else {
      this.allResources = _.filter(_.get(this.activateRoute.snapshot, 'data.allSavedResources.data.responseData'), { bookmark: true }) || []
  }
}

  refresh() {
    this.kwResources.getBookmarkedResource().subscribe((reponse: NSKnowledgeResource.IResourceResponse) => {
      if (reponse.statusInfo && reponse.statusInfo.statusCode === 200) {

        this.filterSaved(reponse.responseData)
      }
    })
}

// getFormathours(time: number) {
//   var totalHours, totalMinutes, totalSeconds, hours, minutes, seconds, result='';
//   totalSeconds = time / 1000;
//   totalMinutes = totalSeconds / 60;
//   totalHours = totalMinutes / 60;

//   // seconds = Math.floor(totalSeconds) % 60;
//   minutes = Math.floor(totalMinutes) % 60;
//   hours = Math.floor(totalHours) % 60;

//   console.log (hours + ' : '  + minutes + ' : ' + seconds);
//   if (hours !== 0) {
//       result += hours+' hr';

//       if (minutes.toString().length == 1) {
//           minutes = '0'+minutes;
//       }
//   }

//   result += minutes+' min';
//   return result;
// }

}
