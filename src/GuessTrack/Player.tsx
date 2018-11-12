import { useState, useEffect, FunctionComponent } from 'react';
import { Spotify as SpotifyBindings, TrackObject } from '../SpotifyBindings';

let spotifyReady = false;
let onSpotifyReady = () => {};

window.onSpotifyWebPlaybackSDKReady = () => {
  spotifyReady = true;
  onSpotifyReady();
};

interface Props {
  spotify: SpotifyBindings;
  trackObject: TrackObject;
  seekSeconds?: number;
}

export const Player: FunctionComponent<Props> = ({ spotify, trackObject, seekSeconds }) => {
  const [deviceID, setDeviceID] = useState<string | undefined>(undefined);
  const [player] = useState<Spotify.SpotifyPlayer>(
    new Spotify.Player({
      name: 'Music quiz web player',
      getOAuthToken: (cb) => cb(spotify.getAccessToken()),
    })
  );

  useEffect(
    () => {
      if (!deviceID) {
        return;
      }

      console.log('playing');
      spotify.play(trackObject.uri, deviceID, seekSeconds);
    },
    [trackObject, deviceID]
  );

  useEffect(() => {
    const initializePlayer = async () => {
      player.addListener('initialization_error', ({ message }) => {
        console.error(message);
      });
      player.addListener('authentication_error', ({ message }) => {
        console.error(message);
      });
      player.addListener('account_error', ({ message }) => {
        console.error(message);
      });
      player.addListener('playback_error', ({ message }) => {
        console.error(message);
      });

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceID(device_id);
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      const connected = await player.connect();
      if (connected !== true) {
        console.error('failed to connect');
      }
    };

    if (!spotifyReady) {
      onSpotifyReady = initializePlayer;
    } else {
      initializePlayer();
    }

    return () => player.disconnect();
  }, []);

  return null;
};
