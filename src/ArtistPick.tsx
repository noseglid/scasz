import * as React from 'react';
import { Artist } from './Artist';
import { ArtistObject, Spotify, TrackObject } from './SpotifyBindings';
import { shuffle } from './util';

interface Props {
  trackObject: TrackObject;
  spotify: Spotify;
  pickedArtist?: string;
  onPick: (id: string) => void;
}

interface State {
  alternatives: ArtistObject[];
}

export class ArtistPick extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      alternatives: [],
    };
  }

  async componentDidMount() {
    const { spotify, trackObject } = this.props;
    const artist = await spotify.getArtist(trackObject.artists[0].id);

    const relatedArtists = await spotify.getRelatedArtists(artist.id);

    const alternatives = shuffle(
      shuffle(relatedArtists)
        .slice(0, 4)
        .concat(artist)
    );
    this.setState({ alternatives });
  }

  render() {
    const { alternatives } = this.state;
    if (alternatives.length === 0) {
      return null;
    }

    return (
      <>
        {alternatives.map((artistObject: ArtistObject) => (
          <Artist
            selected={artistObject.id === this.props.pickedArtist}
            key={artistObject.id}
            artist={artistObject}
            onClick={() => this.props.onPick(artistObject.id)}
          />
        ))}
      </>
    );
  }
}
