import { Component, OnInit, Inject } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

interface IDialogData {

}

@Component({
  selector: 'ws-app-add-topic',
  templateUrl: './add-topic.component.html',
  styleUrls: ['./add-topic.component.scss'],
})
export class AddTopicDialogComponent implements OnInit {

  createTopic!: FormGroup
  constructor(
    public dialogRef: MatDialogRef<AddTopicDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
  ) { }

  close(): void {
    this.dialogRef.close()
  }

  create(): void {
    if (this.createTopic.get('topicName')) {
      const val = this.createTopic.value
      this.dialogRef.close({ newTopic: val })
    }

  }

  ngOnInit() {
    this.createTopic = new FormGroup(
      {
        topicName: new FormControl(null, [Validators.required]),
      })
  }
  cancel() {
    this.close()
  }
}
