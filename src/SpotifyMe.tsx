import React, { FunctionComponent } from 'react';
import './spotify-me.scss';
import { SpotifyContextType, withSpotifyContext } from './SpotifyContext';

interface Props {
  spotify: SpotifyContextType;
}

const SpotifyMe: FunctionComponent<Props> = ({ spotify: { user } }) => {
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
