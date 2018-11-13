import './spotify-me.scss';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { SpotifyBindings } from './SpotifyBindings';
import { withSpotifyContext } from './SpotifyContext';

interface Props {
  spotifyBindings: SpotifyBindings | null;
}

interface UserObject {
  id: string;
  birthdate: string;
  country: string;
  display_name: string;
}

const SpotifyMe: FunctionComponent<Props> = ({ spotifyBindings }) => {
  const [user, setUser] = useState<UserObject | undefined>(undefined);
  useEffect(
    () => {
      if (null == spotifyBindings) {
        return;
      }

      const initialize = async () => {
        const user = await spotifyBindings.me();
        setUser(user);
      };

      initialize();
    },
    [spotifyBindings]
  );

  if (user === undefined) {
    return null;
  }

  return (
    <div className="spotify-me">
      <span>User {user.id}</span>
    </div>
  );
};

const SpotifyMeWithContext = withSpotifyContext(SpotifyMe);
export { SpotifyMeWithContext as SpotifyMe };
