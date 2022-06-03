import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { AddTopicDialogComponent } from '../../components/add-topic/add-topic.component';
import { NSProfileDataV3 } from '../../models/profile-v3.models';

@Component({
  selector: 'ws-app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {

  topics!: NSProfileDataV3.ITopic[]
  constructor(
    private aRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.loadTopics()
  }

  ngOnInit() {
  }
  loadTopics() {
    if (
      this.aRoute.snapshot.data
      && this.aRoute.snapshot.data.topics
      && this.aRoute.snapshot.data.topics.data
    ) {
      this.topics = this.aRoute.snapshot.data.topics.data
    }
  }
  showPoup() {
    const dialogRef = this.dialog.open(AddTopicDialogComponent, {
      autoFocus: false,
      data: {},
    })
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        if (response) {
          this.snackBar.open('Updated')
        }
      }
    })

  }
}
