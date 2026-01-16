import { Component, Inject } from '@angular/core'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'
import { TFetchStatus } from '@sunbird-cb/utils-v2'
import { NsPlaylist } from '../btn-playlist.model'

@Component({
  selector: 'ws-widget-btn-playlist-dialog',
  templateUrl: './btn-playlist-dialog.component.html',
  styleUrls: ['./btn-playlist-dialog.component.scss'],
})
export class BtnPlaylistDialogComponent {

  fetchPlaylists: TFetchStatus = 'none'
  playlists: NsPlaylist.IPlaylist[] | null = null

  constructor(
    public dialogRef: MatDialogRef<BtnPlaylistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  onPlaylistCreate() {
    this.dialogRef.close()
  }
}
