import { History } from 'history';
import { stringify } from 'querystring';
import React, { FunctionComponent, useEffect } from 'react';
import './login.scss';
import { SpotifyContextType, withSpotifyContext } from './SpotifyContext';

const onLogin = () => {
  const qs = stringify({
    response_type: 'token',
    client_id: '602140cd526e461e86264f40d1c4435e',
    scope: 'streaming user-read-birthdate user-read-email user-read-private user-top-read',
    redirect_uri: `http://${window.location.host}/authorized`,
    state: '',
  });
  window.location.assign(`https://accounts.spotify.com/authorize?${qs}`);
};

interface Props {
  spotify: SpotifyContextType;
  history: History;
}

const Login: FunctionComponent<Props> = ({ spotify: { user }, history }) => {
  useEffect(
    () => {
      if (undefined !== user) {
        history.push('/i');
      }
    },
    [user]
  );

  return (
    <div className="login">
      <button onClick={onLogin}>Login</button>
    </div>
  );
};

const LoginWithContext = withSpotifyContext(Login);
export { LoginWithContext as Login };
