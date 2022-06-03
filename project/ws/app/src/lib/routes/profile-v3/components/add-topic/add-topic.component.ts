import { Component, OnInit, Inject } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
@Component({
  selector: 'ws-app-add-topic',
  templateUrl: './add-topic.component.html',
  styleUrls: ['./add-topic.component.scss'],
})
export class AddTopicDialogComponent implements OnInit {

  createTopic!: FormGroup
  constructor(
    public dialogRef: MatDialogRef<AddTopicDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  close(): void {
    this.dialogRef.close()
  }

  create(): void {
    if (this.createTopic.get('topicName')) {
      const val = this.createTopic.value
      if (val && val.topicName) {
        this.dialogRef.close(val.topicName)
      }
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
