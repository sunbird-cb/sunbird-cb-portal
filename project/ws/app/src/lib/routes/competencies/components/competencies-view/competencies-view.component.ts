import { Component, OnInit, Inject, Input } from '@angular/core'
import { NSCompetencie } from '../../models/competencies.model'
// tslint:disable-next-line: import-name
import _ from 'lodash'
import { Router } from '@angular/router'
import { CompetenceAssessmentService } from '../../services/comp-assessment.service'
import { TranslateService } from '@ngx-translate/core'
import { MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
// import { Router } from '@angular/router'

export interface IDialogData {
  name: string
}
@Component({
  selector: 'app-competence-view',
  templateUrl: './competencies-view.component.html',
  styleUrls: ['./competencies-view.component.scss'],
  /* tslint:disable */
  /* host: { class: 'flex flex-1 margin-right-xs margin-top-xs margin-bottom-s' },*/
  host: { class: 'flex flex-1' },

  /* tslint:enable */

})

export class CompetenceViewComponent implements OnInit {
  selectedId: BigInteger | undefined
  @Input() isUpdate!: boolean
  selectedLevel: string | undefined
  selectIndex: any
  selectLevelName: any
  assessmentIdForTest = ''
  onlyCBP = false
  constructor(
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CompetenceViewComponent>,
    @Inject(MAT_DIALOG_DATA) public dData: NSCompetencie.ICompetencie,
    private router: Router,
    private aAService: CompetenceAssessmentService,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService
  ) {
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
   }
  ngOnInit() {
    if (this.dData && this.dData.competencySelfAttestedLevel && this.dData.competencySelfAttestedLevel !== '') {
      this.isUpdate = true
    } else {
      this.isUpdate = false
      if (this.dData && this.dData.competencyCBPCompletionLevel && this.dData.competencyCBPCompletionLevel !== '') {
        this.onlyCBP = true
      } else {
        this.onlyCBP = false
      }
    }
  }

  closeModal() {
    this.dialogRef.close({})
    return false
  }
  get assessmentId() {
    return this.assessmentIdForTest
  }
  set assessmentId(value: string) {
    this.assessmentIdForTest = value
  }
  add() {
    if (_.isEmpty(this.selectedId) || _.isUndefined(this.selectedId)) {
      this.snackBar.open('Please select a level before adding competency', 'X')
    } else {
      this.dialogRef.close({
        id: this.dData.id,
        action: 'ADD',
        levelId: this.selectedId,
        levelName: this.selectLevelName,
        levelValue: this.selectedLevel,
      })
    }
  }

  selectLevel(comp: any, indexOfelement: any) {
    this.selectIndex = indexOfelement + 1
    this.selectedId = comp.id
    // tslint:disable-next-line: prefer-template
    this.selectedLevel = comp.level
    this.selectLevelName = comp.name
    const requestData = {
      request: {
        filters: {
          primaryCategory: [
            'Competency Assessment',
          ],
          status: [
            'Live',
          ],
          'competencies_v3.selectedLevelId': [
            comp.id,
          ],
          'competencies_v3.name': [
            this.dData.name,
          ],
        },
        query: '',
        sort_by: {
          lastUpdatedOn: '',
        },
        fields: [],
        facets: [
          'primaryCategory',
          'mimeType',
          'source',
        ],
      },
    }
    this.aAService.fetchSearchData(requestData).subscribe(res => {
      if (res.result.count) {
        if (res.result.content && res.result.content[0]) {
          this.assessmentId = res.result.content[0].identifier
        }
      }
    })
  }

  remove() {
    this.dialogRef.close({
      id: this.dData.id,
      action: 'DELETE',
    })
  }
  test() {
    if (_.isEmpty(this.selectedId) || _.isUndefined(this.selectedId)) {
      this.snackBar.open('Please select a level before adding competency', 'X')
    } else {
      this.closeModal()
      this.router.navigate(['app', 'competencies', 'all', 'assessment', this.assessmentId])
    }
  }

  navigateTo() {
    this.closeModal()
    this.router.navigate(['/app/competencies/all/', this.dData.id, this.dData.name, 'ALL'])
  }
}
