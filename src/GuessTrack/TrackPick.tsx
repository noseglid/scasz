import React, { FunctionComponent, useState, useEffect } from 'react';
import { Spotify, TrackObject } from '../SpotifyBindings';
import { Track } from './Track';
import { shuffle } from '../util';

interface Props {
  trackObject: TrackObject;
  spotify: Spotify;
  pickedTrack?: string;
  onPick: (id: string, name: string) => void;
}

export const TrackPick: FunctionComponent<Props> = ({
  trackObject,
  spotify,
  pickedTrack,
  onPick,
}) => {
  const [alternatives, setAlternatives] = useState<TrackObject[]>([]);

  useEffect(() => {
    async function initialize() {
      const tracks = await spotify.getRecommendations({ trackIDs: [trackObject.id] });

      const alternatives = shuffle(
        shuffle(tracks)
          .slice(0, 4)
          .concat(trackObject)
      );
      setAlternatives(alternatives);
    }

    initialize();
  }, []);

  return (
    <>
      {alternatives.map((trackObject) => (
        <Track
          key={trackObject.id}
          trackObject={trackObject}
          selected={trackObject.id === pickedTrack}
          onClick={() => onPick(trackObject.id, trackObject.name)}
        />
      ))}
    </>
  );
};

// export class TrackPick extends React.Component<Props, State> {
//   constructor(props: Props) {
//     super(props);
//     this.state = {
//       alternatives: [],
//     };
//   }

//   async componentDidMount() {
//   }

//   render() {
//     const { alternatives } = this.state;
//     if (alternatives.length === 0) {
//       return null;
//     }

//   }
// }
