import React, { createContext, FunctionComponent } from 'react';
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
