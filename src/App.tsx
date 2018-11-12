import React, { FunctionComponent, useState } from 'react';
import { SpotifyContext } from './SpotifyContext';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Authorized } from './Authorized';
import { GuessTrack } from './GuessTrack';
import { Header } from './Header';
import { Login } from './Login';
import './styles.scss';
import { SpotifyBindings } from './SpotifyBindings';

export const App: FunctionComponent = () => {
  const [spotify, setSpotify] = useState<SpotifyBindings | null>(() => {
    const token = window.localStorage.getItem('access_token');
    if (null === token) {
      return null;
    }

    return new SpotifyBindings(token);
  });

  const onActionToken = (token: string) => {
    setSpotify(new SpotifyBindings(token));
  };

  return (
    <>
      <SpotifyContext.Provider value={spotify}>
        <Header />
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path="/authorized"
              render={({ history }) => (
                <Authorized history={history} onActionToken={onActionToken} />
              )}
            />
            <Route exact strict path="/i" component={GuessTrack} />
            <Route exact path="/" component={Login} />
          </Switch>
        </BrowserRouter>
      </SpotifyContext.Provider>
    </>
  );
};
