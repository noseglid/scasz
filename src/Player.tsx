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
  seekSeconds?: number;
}

interface State {
  deviceID?: string;
}

export class Player extends React.Component<Props, State> {
  private ref: Spotify.SpotifyPlayer;

  constructor(props: Props) {
    super(props);
    this.state = {};
    this.ref = new Spotify.Player({
      name: 'Music quiz web player',
      getOAuthToken: (cb) => cb(this.props.spotify.getAccessToken()),
    });
  }

  private async playTrack(trackObject: TrackObject) {
    const { deviceID } = this.state;
    const { spotify, seekSeconds } = this.props;
    if (!deviceID) {
      console.error('No deviceid when playing track');
      return;
    }

    console.log('playing track:', trackObject.name);
    await spotify.play(trackObject.uri, deviceID, seekSeconds);
    console.log('played');
  }

  componentDidMount() {
    const initializePlayer = async () => {
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

      this.ref.addListener('player_state_changed', async (state) => {
        console.log('player state change:', state);
      });

      this.ref.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        this.setState(
          () => ({ deviceID: device_id }),
          () => this.playTrack(this.props.trackObject)
        );
      });

      this.ref.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      const connected = await this.ref.connect();
      if (connected !== true) {
        console.error('failed to connect');
      }
      console.log('connected');
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

  async componentWillReceiveProps(nextProps: Props) {
    if (this.props.trackObject !== nextProps.trackObject) {
      this.ref.pause();
      const { trackObject } = nextProps;
      await this.playTrack(trackObject);
    }
  }

  render() {
    return null;
  }
}
