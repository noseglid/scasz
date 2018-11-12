import React, { FunctionComponent, useState, useEffect } from 'react';
import { Artist } from './Artist';
import { ArtistObject, Spotify, TrackObject } from '../SpotifyBindings';
import { shuffle } from '../util';

interface Props {
  trackObject: TrackObject;
  spotify: Spotify;
  pickedArtist?: string;
  onPick: (id: string, name: string) => void;
}

export const ArtistPick: FunctionComponent<Props> = ({
  trackObject,
  spotify,
  pickedArtist,
  onPick,
}) => {
  const [alternatives, setAlternatives] = useState<ArtistObject[]>([]);

  useEffect(() => {
    async function initialize() {
      const artist = await spotify.getArtist(trackObject.artists[0].id);
      const relatedArtists = await spotify.getRelatedArtists(artist.id);
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
