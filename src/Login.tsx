import './login.scss';
import React, { FunctionComponent } from 'react';
import { stringify } from 'querystring';

const onLogin = () => {
  const qs = stringify({
    response_type: 'token',
    client_id: '602140cd526e461e86264f40d1c4435e',
    scope: 'streaming user-read-birthdate user-read-email user-read-private user-top-read',
    redirect_uri: 'http://localhost:1234/authorized',
    state: '',
  });
  window.location.assign(`https://accounts.spotify.com/authorize?${qs}`);
};

export const Login: FunctionComponent = () => (
  <div className="login">
    <button onClick={onLogin}>Login</button>
  </div>
);
