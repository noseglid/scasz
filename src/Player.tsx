import * as React from 'react';
import { Spotify as SpotifyBindings, TrackObject } from './SpotifyBindings';

let spotifyReady = false;
let onSpotifyReady = () => {};

window.onSpotifyWebPlaybackSDKReady = () => {
  spotifyReady = true;
  onSpotifyReady();
};

interface Props {
  spotify: SpotifyBindings;
  trackObject: TrackObject;
}

export class Player extends React.Component<Props> {
  private ref: Spotify.SpotifyPlayer;

  constructor(props: Props) {
    super(props);
    this.ref = new Spotify.Player({
      name: 'Music quiz web player',
      getOAuthToken: (cb) => cb(this.props.spotify.getAccessToken()),
    });
  }

  componentDidMount() {
    const initializePlayer = () => {
      // Error handling
      this.ref.addListener('initialization_error', ({ message }) => {
        console.error(message);
      });
      this.ref.addListener('authentication_error', ({ message }) => {
        console.error(message);
      });
      this.ref.addListener('account_error', ({ message }) => {
        console.error(message);
      });
      this.ref.addListener('playback_error', ({ message }) => {
        console.error(message);
      });

      // Playback status updates
      // this.ref.addListener('player_state_changed', (state) => {
      //   console.log(state);
      // });

      // Ready
      this.ref.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
          method: 'PUT',
          body: JSON.stringify({ uris: [this.props.trackObject.uri] }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.props.spotify.getAccessToken()}`,
          },
        });
        this.ref.setVolume(0.3);
      });

      // Not Ready
      this.ref.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      this.ref.connect();
    };

    if (!spotifyReady) {
      onSpotifyReady = initializePlayer;
    } else {
      initializePlayer();
    }
  }

  componentWillUnmount() {
    this.ref.disconnect();
  }

  render() {
    return null;
  }
}
