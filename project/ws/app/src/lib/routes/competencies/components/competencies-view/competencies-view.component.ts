import { Component, OnInit, Inject, Input } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { NSCompetencie } from '../../models/competencies.model'
// import { Router } from '@angular/router'

export interface IDialogData {
  name: string
}
@Component({
  selector: 'app-competence-view',
  templateUrl: './competencies-view.component.html',
  styleUrls: ['./competencies-view.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 margin-right-xs margin-top-xs margin-bottom-s' },
  /* tslint:enable */

})

export class CompetenceViewComponent implements OnInit {
  selectedId: BigInteger | undefined
  @Input() isUpdate!: boolean
  selectedLevel: string | undefined
  selectIndex: any
  constructor(
    public dialogRef: MatDialogRef<CompetenceViewComponent>,
    @Inject(MAT_DIALOG_DATA) public dData: NSCompetencie.ICompetencie
  ) { }
  ngOnInit() {
  }
  add() {
    this.dialogRef.close({
      id: this.dData.id,
      action: 'ADD',
      levelId: this.selectIndex,
      levelName: this.selectedLevel,
    })
  }

  selectLevel(comp: any, indexOfelement: any) {
    this.selectIndex = indexOfelement + 1
    this.selectedId = comp.id
    // tslint:disable-next-line: prefer-template
    this.selectedLevel = comp.name + '(' + comp.level + ')'
  }

  remove() {
    this.dialogRef.close({
      id: this.dData.id,
      action: 'DELETE',
    })
  }
}
