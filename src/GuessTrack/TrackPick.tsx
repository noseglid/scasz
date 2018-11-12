import React, { FunctionComponent, useState, useEffect } from 'react';
import { SpotifyBindings, TrackObject } from '../SpotifyBindings';
import { Track } from './Track';
import { shuffle } from '../util';
import { withSpotifyContext } from '../SpotifyContext';

interface Props {
  trackObject: TrackObject;
  spotifyBindings: SpotifyBindings;
  pickedTrack?: string;
  onPick: (id: string, name: string) => void;
}

const TrackPick: FunctionComponent<Props> = ({
  trackObject,
  spotifyBindings,
  pickedTrack,
  onPick,
}) => {
  const [alternatives, setAlternatives] = useState<TrackObject[]>([]);

  useEffect(() => {
    async function initialize() {
      const tracks = await spotifyBindings.getRecommendations({ trackIDs: [trackObject.id] });

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

const TrackPickWithContext = withSpotifyContext(TrackPick);
export { TrackPickWithContext as TrackPick };
