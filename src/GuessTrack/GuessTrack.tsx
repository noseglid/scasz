import React, { useEffect, useState } from 'react';
import { SpotifyContextType, TrackObject, withSpotifyContext } from '../Spotify';
import { ArtistPick } from './ArtistPick';
import './guess-track.scss';
import { GuessTrackCenter } from './GuessTrackCenter';
import { Player } from './Player';
import { TrackPick } from './TrackPick';

interface Picked {
  id: string;
  name: string;
}

interface Props {
  spotify: SpotifyContextType;
}

const GuessTrack: React.FunctionComponent<Props> = ({ spotify: { bindings } }) => {
  const [tracks, setTracks] = useState<TrackObject[]>([]);
  const [pickedArtist, setPickedArtist] = useState<Picked | undefined>(undefined);
  const [pickedTrack, setPickedTrack] = useState<Picked | undefined>(undefined);

  useEffect(() => {
    async function initialize() {
      if (undefined === bindings) {
        return;
      }
      const [topArtists, topTracks] = await Promise.all([
        bindings.getTopArtists(),
        bindings.getTopTracks(),
      ]);

      const tracks = await bindings.getRecommendations({
        artistIDs: topArtists.map((artist) => artist.id),
        trackIDs: topTracks.map((track) => track.id),
      });

      setTracks(tracks);
    }

    initialize();
  }, []);

  const onPickArtist = (id: string, name: string) => {
    if (pickedArtist && pickedArtist.id === id) {
      setPickedArtist(undefined);
    } else {
      setPickedArtist({ id, name });
    }
  };

  const onPickTrack = (id: string, name: string) => {
    if (pickedTrack && pickedTrack.id === id) {
      setPickedTrack(undefined);
    } else {
      setPickedTrack({ id, name });
    }
  };

  const submit = () => {
    if (!pickedArtist || !pickedTrack) {
      return;
    }

    if (tracks[0].artists[0].id === pickedArtist.id && tracks[0].id === pickedTrack.id) {
      console.log('correct!');
    } else {
      console.error('nopes :(');
    }

    setTracks(tracks.slice(1));
    setPickedArtist(undefined);
    setPickedTrack(undefined);
  };

  if (tracks.length === 0) {
    return null;
  }

  const trackObject = tracks[0];
  return (
    <>
      <Player trackObject={trackObject} seekSeconds={20} />
      <div className="guess-track" key={trackObject.uri}>
        <ArtistPick
          trackObject={trackObject}
          onPick={onPickArtist}
          pickedArtist={pickedArtist ? pickedArtist.id : undefined}
        />
        <TrackPick
          trackObject={trackObject}
          onPick={onPickTrack}
          pickedTrack={pickedTrack ? pickedTrack.id : undefined}
        />
        <GuessTrackCenter
          artistName={pickedArtist ? pickedArtist.name : undefined}
          trackName={pickedTrack ? pickedTrack.name : undefined}
          onSubmit={submit}
        />
      </div>
    </>
  );
};

const GuessTrackWithContext = withSpotifyContext(GuessTrack);
export { GuessTrackWithContext as GuessTrack };
