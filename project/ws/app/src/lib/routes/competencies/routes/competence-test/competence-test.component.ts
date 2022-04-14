import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material';
// import { Router } from '@angular/router';
// import { CompetenciesAssessmentComponent } from '../../components/competencies-assessment/competencies-assessment.component';

@Component({
    selector: 'ws-app-competency-test',
    templateUrl: './competence-test.component.html',
    styleUrls: ['./competence-test.component.scss'],

    host: { class: 'competency_main_test_wrapper' },
})
export class CompetencyTestComponent implements OnInit {
    constructor(
        public dialog: MatDialog,
        // private router: Router
    ) { }

    ngOnInit() {
        // const dialogRef = this.dialog.open(CompetenciesAssessmentComponent, {
        //     minHeight: '100vh',
        //     width: '100%',
        //     panelClass: 'remove-pad',
        //     data: {},
        // });
        // // const instance = dialogRef.componentInstance;
        // //   instance.isUpdate = true;
        // dialogRef.afterClosed().subscribe((response: any) => {
        //     console.log(response)
        //     this.router.navigate(['app', 'competencies', 'all', 'list'])
        // })
    }

}
