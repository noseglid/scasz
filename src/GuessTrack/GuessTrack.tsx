import React, { useState, useEffect } from 'react';
import { ArtistPick } from './ArtistPick';
import './guess-track.scss';
import { GuessTrackCenter } from './GuessTrackCenter';
import { Player } from './Player';
import { Spotify, TrackObject } from '../SpotifyBindings';
import { TrackPick } from './TrackPick';

interface Picked {
  id: string;
  name: string;
}

export const GuessTrack: React.FunctionComponent = () => {
  const [tracks, setTracks] = useState<TrackObject[]>([]);
  const [pickedArtist, setPickedArtist] = useState<Picked | undefined>(undefined);
  const [pickedTrack, setPickedTrack] = useState<Picked | undefined>(undefined);
  const [spotify] = useState<Spotify>(() => {
    const token = window.localStorage.getItem('access_token');
    if (!token) {
      throw new Error('no access_token');
    }

    return new Spotify(token);
  });

  useEffect(() => {
    async function getTracks() {
      const [topArtists, topTracks] = await Promise.all([
        spotify.getTopArtists(),
        spotify.getTopTracks(),
      ]);

      const tracks = await spotify.getRecommendations({
        artistIDs: topArtists.map((artist) => artist.id),
        trackIDs: topTracks.map((track) => track.id),
      });

      setTracks(tracks);
    }

    getTracks();
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
      <Player spotify={spotify} trackObject={trackObject} seekSeconds={20} />
      <div className="guess-track" key={trackObject.uri}>
        <ArtistPick
          spotify={spotify}
          trackObject={trackObject}
          onPick={onPickArtist}
          pickedArtist={pickedArtist ? pickedArtist.id : undefined}
        />
        <TrackPick
          spotify={spotify}
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

// export class GuessTrack extends React.Component<Props, State> {
//   private spotify: Spotify;

//   constructor(props: Props) {
//   }

//   async getTracks() {
//   }

//   componentDidMount() {
//     this.getTracks();
//   }

//   submit = () => {
//   };

//   render() {

// }
