import * as React from 'react';
import { ArtistPick } from './ArtistPick';
import './guess-track.scss';
import { GuessTrackCenter } from './GuessTrackCenter';
import { Player } from './Player';
import { Spotify, TrackObject } from './SpotifyBindings';
import { TrackPick } from './TrackPick';

interface State {
  tracks: TrackObject[];
  pickedArtist?: {
    id: string;
    name: string;
  };
  pickedTrack?: {
    id: string;
    name: string;
  };
}

type Props = {};

export class GuessTrack extends React.Component<Props, State> {
  private spotify: Spotify;

  constructor(props: Props) {
    super(props);
    const token = window.localStorage.getItem('access_token');
    if (!token) {
      throw new Error('no access_token');
    }

    this.spotify = new Spotify(token);
    this.state = {
      tracks: [],
    };
  }

  async getTracks() {
    const [topArtists, topTracks] = await Promise.all([
      this.spotify.getTopArtists(),
      this.spotify.getTopTracks(),
    ]);

    const tracks = await this.spotify.getRecommendations({
      artistIDs: topArtists.map((artist) => artist.id),
      trackIDs: topTracks.map((track) => track.id),
    });

    this.setState({ tracks });
  }

  componentDidMount() {
    this.getTracks();
  }

  onPickArtist = (id: string, name: string) => {
    const { pickedArtist } = this.state;
    if (pickedArtist && pickedArtist.id === id) {
      this.setState({ pickedArtist: undefined });
    } else {
      this.setState(() => ({ pickedArtist: { id, name } }));
    }
  };

  onPickTrack = (id: string, name: string) => {
    if (this.state.pickedTrack && this.state.pickedTrack.id === id) {
      this.setState({ pickedTrack: undefined });
    } else {
      this.setState(() => ({ pickedTrack: { id, name } }));
    }
  };

  submit = () => {
    const { tracks, pickedArtist, pickedTrack } = this.state;
    if (!pickedArtist || !pickedTrack) {
      return;
    }

    if (tracks[0].artists[0].id === pickedArtist.id && tracks[0].id === pickedTrack.id) {
      console.log('correct!');
    } else {
      console.error('nopes :(');
    }
    this.setState(() => ({
      tracks: tracks.slice(1),
      pickedArtist: undefined,
      pickedTrack: undefined,
    }));
  };

  render() {
    const { tracks, pickedArtist, pickedTrack } = this.state;
    if (tracks.length === 0) {
      return null;
    }

    const trackObject = tracks[0];

    return (
      <>
        <Player spotify={this.spotify} trackObject={trackObject} seekSeconds={20} />
        <div className="guess-track" key={trackObject.uri}>
          <ArtistPick
            spotify={this.spotify}
            trackObject={trackObject}
            onPick={this.onPickArtist}
            pickedArtist={pickedArtist ? pickedArtist.id : undefined}
          />
          <TrackPick
            spotify={this.spotify}
            trackObject={trackObject}
            onPick={this.onPickTrack}
            pickedTrack={pickedTrack ? pickedTrack.id : undefined}
          />
          <GuessTrackCenter
            artistName={pickedArtist ? pickedArtist.name : undefined}
            trackName={pickedTrack ? pickedTrack.name : undefined}
            onSubmit={this.submit}
          />
        </div>
      </>
    );
  }
}
