import { useState, useEffect, FunctionComponent } from 'react';
import { SpotifyBindings, TrackObject } from '../SpotifyBindings';
import { withSpotifyContext } from '../SpotifyContext';

let spotifyReady = false;
let onSpotifyReady = () => {};

window.onSpotifyWebPlaybackSDKReady = () => {
  spotifyReady = true;
  onSpotifyReady();
};

interface Props {
  spotifyBindings: SpotifyBindings;
  trackObject: TrackObject;
  seekSeconds?: number;
}

const Player: FunctionComponent<Props> = ({ spotifyBindings, trackObject, seekSeconds }) => {
  const [deviceID, setDeviceID] = useState<string | undefined>(undefined);
  const [player] = useState<Spotify.SpotifyPlayer>(() => {
    return new Spotify.Player({
      name: 'Music quiz web player',
      getOAuthToken: (cb) => cb(spotifyBindings.getAccessToken()),
    });
  });

  useEffect(
    () => {
      if (!deviceID) {
        return;
      }

      spotifyBindings.play(trackObject.uri, deviceID, seekSeconds);
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

const PlayerWithContext = withSpotifyContext(Player);
export { PlayerWithContext as Player };
