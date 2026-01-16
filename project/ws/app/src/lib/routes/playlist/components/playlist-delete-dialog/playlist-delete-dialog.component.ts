import { Component } from '@angular/core'
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog'

@Component({
  selector: 'ws-app-playlist-delete-dialog',
  templateUrl: './playlist-delete-dialog.component.html',
  styleUrls: ['./playlist-delete-dialog.component.scss'],
})
export class PlaylistDeleteDialogComponent {

  constructor(public dialogRef: MatDialogRef<PlaylistDeleteDialogComponent>) { }

}
