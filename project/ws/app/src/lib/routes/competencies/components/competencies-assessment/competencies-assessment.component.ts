import { Component, OnInit, Input, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { NsContent } from '@sunbird-cb/utils/src/public-api'
import { NSPractice } from '@ws/viewer/src/lib/plugins/practice/practice.model'
import { NSCompetencie } from '../../models/competencies.model'

// import { Router } from '@angular/router'
@Component({
    selector: 'app-competencies-assessment',
    templateUrl: './competencies-assessment.component.html',
    styleUrls: ['./competencies-assessment.component.scss'],
    /* tslint:disable */
    host: { class: 'flex flex-row margin-right-xs margin-top-xs margin-bottom-s competency_main' },
    /* tslint:enable */

})
export class CompetenciesAssessmentComponent implements OnInit {
    @Input()
    data!: NSCompetencie.ICompetencie
    ePrimartCategory = NsContent.EPrimaryCategory
    _ID = 'do_1135047568283648001115' // temp
    quizJson!: { timeLimit: Number, questions: NSPractice.IQuestion[], isAssessment: boolean }
    constructor(public dialogRef: MatDialogRef<CompetenciesAssessmentComponent>,
                @Inject(MAT_DIALOG_DATA) public dData: NSCompetencie.ICompetencie) {
        this.quizJson = { timeLimit: 2, questions: [], isAssessment: true }
    }
    ngOnInit() {

    }
}
