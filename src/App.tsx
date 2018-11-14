import React, { FunctionComponent, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Authorized } from './Authorized';
import { GuessTrack } from './GuessTrack';
import { Header } from './Header';
import { Login } from './Login';
import { SpotifyProvider } from './Spotify';
import './styles.scss';

export const App: FunctionComponent = () => {
  const [token, setToken] = useState<string | null>(window.localStorage.getItem('access_token'));

  return (
    <>
      <SpotifyProvider token={token}>
        <Header />
        <Authorized onActionToken={setToken} />
        <BrowserRouter>
          <Switch>
            <Route exact strict path="/play" component={GuessTrack} />
            <Route exact path="/" component={Login} />
          </Switch>
        </BrowserRouter>
      </SpotifyProvider>
    </>
  );
};
