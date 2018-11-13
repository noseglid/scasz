import React, { FunctionComponent, useState, useEffect } from 'react';
import { SpotifyContext } from './SpotifyContext';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Authorized } from './Authorized';
import { GuessTrack } from './GuessTrack';
import { Header } from './Header';
import { Login } from './Login';
import './styles.scss';
import { SpotifyBindings, UserObject } from './SpotifyBindings';

export const App: FunctionComponent = () => {
  const [bindings, setBindings] = useState<SpotifyBindings | undefined>(() => {
    const token = window.localStorage.getItem('access_token');
    if (null === token) {
      return undefined;
    }

    return new SpotifyBindings(token);
  });

  const [user, setUser] = useState<UserObject | undefined>(undefined);

  const onActionToken = (token: string) => {
    setBindings(new SpotifyBindings(token));
  };

  useEffect(
    () => {
      async function initialize() {
        if (undefined === bindings) {
          return;
        }

        setUser(await bindings.me());
      }
      initialize();
    },
    [bindings]
  );

  return (
    <>
      <SpotifyContext.Provider value={{ bindings, user }}>
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
