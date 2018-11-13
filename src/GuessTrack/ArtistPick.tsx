import React, { FunctionComponent, useEffect, useState } from 'react';
import { ArtistObject, SpotifyContextType, TrackObject, withSpotifyContext } from '../Spotify';
import { shuffle } from '../util';
import { Artist } from './Artist';

interface Props {
  trackObject: TrackObject;
  spotify: SpotifyContextType;
  pickedArtist?: string;
  onPick: (id: string, name: string) => void;
}

const ArtistPick: FunctionComponent<Props> = ({
  trackObject,
  spotify: { bindings },
  pickedArtist,
  onPick,
}) => {
  const [alternatives, setAlternatives] = useState<ArtistObject[]>([]);

  useEffect(() => {
    async function initialize() {
      if (undefined === bindings) {
        return;
      }

      const artist = await bindings.getArtist(trackObject.artists[0].id);
      const relatedArtists = await bindings.getRelatedArtists(artist.id);
      const alternatives = shuffle(
        shuffle(relatedArtists)
          .slice(0, 4)
          .concat(artist)
      );
      setAlternatives(alternatives);
    }
    initialize();
  }, []);

  return (
    <>
      {alternatives.map((artistObject: ArtistObject) => (
        <Artist
          selected={artistObject.id === pickedArtist}
          key={artistObject.id}
          artist={artistObject}
          onClick={() => onPick(artistObject.id, artistObject.name)}
        />
      ))}
    </>
  );
};

const ArtistPickWithContext = withSpotifyContext(ArtistPick);
export { ArtistPickWithContext as ArtistPick };
