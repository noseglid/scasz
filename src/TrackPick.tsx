import * as React from 'react';
import { Spotify, TrackObject } from './SpotifyBindings';
import { Track } from './Track';
import { shuffle } from './util';

interface Props {
  trackObject: TrackObject;
  spotify: Spotify;
  pickedTrack?: string;
  onPick: (id: string, name: string) => void;
}

interface State {
  alternatives: TrackObject[];
}

export class TrackPick extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      alternatives: [],
    };
  }

  async componentDidMount() {
    const { spotify, trackObject } = this.props;

    const tracks = await spotify.getRecommendations({ trackIDs: [trackObject.id] });

    const alternatives = shuffle(
      shuffle(tracks)
        .slice(0, 4)
        .concat(trackObject)
    );
    this.setState(() => ({ alternatives }));
  }

  render() {
    const { alternatives } = this.state;
    if (alternatives.length === 0) {
      return null;
    }

    const { pickedTrack } = this.props;

    return (
      <>
        {alternatives.map((trackObject) => (
          <Track
            key={trackObject.id}
            trackObject={trackObject}
            selected={trackObject.id === pickedTrack}
            onClick={() => this.props.onPick(trackObject.id, trackObject.name)}
          />
        ))}
      </>
    );
  }
}
