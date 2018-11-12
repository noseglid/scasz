import React, { FunctionComponent, useState, useEffect } from 'react';
import { Artist } from './Artist';
import { ArtistObject, SpotifyBindings, TrackObject } from '../SpotifyBindings';
import { shuffle } from '../util';
import { withSpotifyContext } from '../SpotifyContext';

interface Props {
  trackObject: TrackObject;
  spotifyBindings: SpotifyBindings;
  pickedArtist?: string;
  onPick: (id: string, name: string) => void;
}

const ArtistPick: FunctionComponent<Props> = ({
  trackObject,
  spotifyBindings,
  pickedArtist,
  onPick,
}) => {
  const [alternatives, setAlternatives] = useState<ArtistObject[]>([]);

  useEffect(() => {
    async function initialize() {
      const artist = await spotifyBindings.getArtist(trackObject.artists[0].id);
      const relatedArtists = await spotifyBindings.getRelatedArtists(artist.id);
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
