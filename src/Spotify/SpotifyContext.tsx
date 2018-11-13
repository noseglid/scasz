import React, { createContext, FunctionComponent, useEffect, useState } from 'react';
import { SpotifyBindings, UserObject } from './SpotifyBindings';

export interface SpotifyContextType {
  bindings?: SpotifyBindings;
  user?: UserObject;
}

interface PropsType {
  spotify: SpotifyContextType;
}

export const SpotifyContext = createContext<SpotifyContextType>({});

export const withSpotifyContext = <P extends PropsType>(Component: FunctionComponent<P>) => (
  props: Pick<P, Exclude<keyof P, keyof PropsType>>
) => (
  <SpotifyContext.Consumer>
    {(spotify) => <Component {...props} spotify={spotify} />}
  </SpotifyContext.Consumer>
);

export const SpotifyProvider: FunctionComponent<{ token: string | null }> = ({
  token,
  children,
}) => {
  const [bindings, setBindings] = useState<SpotifyBindings | undefined>(undefined);

  if (token !== null && (bindings === undefined || token !== bindings.getAccessToken())) {
    setBindings(new SpotifyBindings(token));
  }

  const [user, setUser] = useState<UserObject | undefined>(undefined);

  useEffect(
    () => {
      async function initialize() {
        if (undefined === bindings) {
          return;
        }

        try {
          setUser(await bindings.me());
        } catch (e) {
          // token is invalid. Do nothing. This effect is retried when a new token arrives
        }
      }
      initialize();
    },
    [token]
  );

  return <SpotifyContext.Provider value={{ bindings, user }}>{children}</SpotifyContext.Provider>;
};
