import { Component, Inject, OnInit } from '@angular/core'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table'
import { ITableData } from '@sunbird-cb/collection/src/public-api'
import * as _ from 'lodash'

@Component({
  selector: 'viewer-final-assessment-popup',
  templateUrl: './final-assessment-popup.component.html',
  styleUrls: ['./final-assessment-popup.component.scss'],
})
export class FinalAssessmentPopupComponent implements OnInit {

  assessmentData: any
  dataSource = new MatTableDataSource([])
  displayedColumns: any[] = []

  tableData!: ITableData | undefined

  constructor(
    private dialogRef: MatDialogRef<FinalAssessmentPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.assessmentData = data
    if (data && data.tableDetails && data.tableDetails.tableData) {
      this.setTableDataSource(data.tableDetails.tableData)
    }

  }

  ngOnInit() {
    if (this.assessmentData && this.assessmentData.tableDetails && this.assessmentData.tableDetails.tableColumns) {
      this.setTableColumns(this.assessmentData.tableDetails.tableColumns)
    }
  }

  setTableColumns(columns: any) {
    this.displayedColumns = columns
  }

  setTableDataSource(data: any) {
    // this.dataSource = new MatTableDataSource(data);
    this.dataSource.data = data
  }

  closePopup(response: any) {
    this.dialogRef.close(response)
  }

  get getFinalColumns(): string[] {
    const displayColumns = _.map(this.displayedColumns, c => c.key)
    return displayColumns
  }

}
