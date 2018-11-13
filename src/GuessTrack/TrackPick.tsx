import React, { FunctionComponent, useEffect, useState } from 'react';
import { TrackObject } from '../SpotifyBindings';
import { SpotifyContextType, withSpotifyContext } from '../SpotifyContext';
import { shuffle } from '../util';
import { Track } from './Track';

interface Props {
  trackObject: TrackObject;
  spotify: SpotifyContextType;
  pickedTrack?: string;
  onPick: (id: string, name: string) => void;
}

const TrackPick: FunctionComponent<Props> = ({
  trackObject,
  spotify: { bindings },
  pickedTrack,
  onPick,
}) => {
  const [alternatives, setAlternatives] = useState<TrackObject[]>([]);

  useEffect(() => {
    async function initialize() {
      if (undefined === bindings) {
        return;
      }

      const tracks = await bindings.getRecommendations({ trackIDs: [trackObject.id] });

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
