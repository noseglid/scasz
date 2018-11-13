import './login.scss';
import React, { FunctionComponent, useEffect } from 'react';
import { stringify } from 'querystring';
import { withSpotifyContext } from './SpotifyContext';
import { SpotifyBindings } from './SpotifyBindings';
import { History } from 'history';

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
  spotifyBindings: SpotifyBindings;
  history: History;
}

const Login: FunctionComponent<Props> = ({ spotifyBindings, history }) => {
  useEffect(() => {
    async function initialize() {
      try {
        await spotifyBindings.me();
        console.log('pushing', history);
        history.push('/i');
      } catch (e) {
        // Not logged in, do nothing
      }
    }
    initialize();
  }, []);

  return (
    <div className="login">
      <button onClick={onLogin}>Login</button>
    </div>
  );
};

const LoginWithContext = withSpotifyContext(Login);
export { LoginWithContext as Login };
