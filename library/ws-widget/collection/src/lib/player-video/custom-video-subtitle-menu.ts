import videojs from 'video.js';

const MenuButton = videojs.getComponent('MenuButton');
const MenuItem = videojs.getComponent('MenuItem');

// Custom Menu Item for subtitles
class SubtitleMenuItem extends MenuItem {
    track:any
  constructor(player:any, options:any) {
    super(player, options);
    this.track = options.track;
    this.on('click', this.handleClick);
  }

  handleClick() {
    // Remove existing tracks
    const tracks:any = this.player().remoteTextTracks();
    for (let i = 0; i < tracks.length; i++) {
      this.player().removeRemoteTextTrack(tracks[i]);
    }

    // Add selected track
    if (this.track) {
      this.player().addRemoteTextTrack({
        kind: 'subtitles',
        src: this.track.uri,
        srclang: this.track.language,
        label: this.track.label,
        default: true,
      }, false);
    }
  }
}

// Custom menu button for subtitles
class CustomSubtitleMenuButton extends MenuButton {
    tracks:any
  constructor(player:any, options:any) {
    super(player, options);
    this.tracks = options.tracks;
  }

  createItems() {
    const items = [];

    // Add "Off" option
    items.push(new SubtitleMenuItem(this.player(), {
      label: 'Off',
      track: null
    }));

    // Add each subtitle option
    this.tracks.forEach((track:any) => {
      items.push(new SubtitleMenuItem(this.player(), {
        label: track.label,
        track: track
      }));
    });

    return items;
  }
}

// Register component
videojs.registerComponent('CustomSubtitleMenuButton', CustomSubtitleMenuButton);