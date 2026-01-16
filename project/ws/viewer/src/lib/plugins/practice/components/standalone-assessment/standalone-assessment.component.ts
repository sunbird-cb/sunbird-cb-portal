import {
  Component,
} from '@angular/core'
// import { ViewerDataService } from '../../viewer-data.service'
export type FetchStatus = 'hasMore' | 'fetching' | 'done' | 'error' | 'none'
@Component({
  selector: 'viewer-standalone-assessment',
  templateUrl: './standalone-assessment.component.html',
  styleUrls: ['./standalone-assessment.component.scss'],
})
// ComponentCanDeactivate
export class StandaloneAssessmentComponent {
}
