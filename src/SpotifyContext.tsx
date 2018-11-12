import React, { createContext, FunctionComponent } from 'react';
import { SpotifyBindings } from './SpotifyBindings';

type ContextType = SpotifyBindings | null;

interface PropsType {
  spotifyBindings: ContextType;
}

export const SpotifyContext = createContext<ContextType>(null);

export const withSpotifyContext = <P extends PropsType>(Component: FunctionComponent<P>) => (
  props: Pick<P, Exclude<keyof P, keyof PropsType>>
) => (
  <SpotifyContext.Consumer>
    {(spotifyBindings) => <Component {...props} spotifyBindings={spotifyBindings} />}
  </SpotifyContext.Consumer>
);
