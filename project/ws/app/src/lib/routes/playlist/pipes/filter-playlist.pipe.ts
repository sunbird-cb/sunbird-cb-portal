import { Pipe, PipeTransform } from '@angular/core'
import { NsPlaylist } from '@sunbird-cb/collection'

@Pipe({
  name: 'filterPlaylist',
})
export class FilterPlaylistPipe implements PipeTransform {
  transform(playlists: any, searchPlaylistQuery: string): NsPlaylist.IPlaylist[] | undefined {
    const playlistArr =  playlists.result.content
    const filteredPlaylists = playlistArr.filter(
      (playlist: NsPlaylist.IPlaylist) =>
        playlist.name.toLowerCase().includes((searchPlaylistQuery || '').toLowerCase()),
    )

    return filteredPlaylists.length ? filteredPlaylists : undefined
  }
}
