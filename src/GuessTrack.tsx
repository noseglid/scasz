import * as React from 'react';
import { ArtistPick } from './ArtistPick';
import './guess-track.scss';
import { Player } from './Player';
import { Spotify, TrackObject } from './SpotifyBindings';
import { TrackPick } from './TrackPick';

interface State {
  tracks: TrackObject[];
  pickedArtist?: string;
  pickedTrack?: string;
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

  onPickArtist = (id: string) => {
    this.setState(() => ({ pickedArtist: id }));
  };

  onPickTrack = (id: string) => {
    this.setState(() => ({ pickedTrack: id }));
  };

  render() {
    const { tracks, pickedArtist, pickedTrack } = this.state;
    if (tracks.length === 0) {
      return null;
    }

    const trackObject = tracks[0];

    return (
      <div className="guess-track" key={trackObject.uri}>
        <Player spotify={this.spotify} trackObject={trackObject} />
        <ArtistPick
          spotify={this.spotify}
          trackObject={trackObject}
          onPick={this.onPickArtist}
          pickedArtist={pickedArtist}
        />
        <TrackPick
          spotify={this.spotify}
          trackObject={trackObject}
          onPick={this.onPickTrack}
          pickedTrack={pickedTrack}
        />
      </div>
    );
  }
}
