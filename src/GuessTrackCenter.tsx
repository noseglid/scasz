import * as React from 'react';
import { Submit } from './Submit';

interface Props {
  artistName?: string;
  trackName?: string;
  onSubmit: () => void;
}

export const GuessTrackCenter = ({ artistName, trackName, onSubmit }: Props) => (
  <div className="guess-track-center">
    <div className="track-name">
      <span>{trackName}</span>
    </div>
    <div className="divider">
      <span>by</span>
    </div>
    <div className="artist-name">
      <span>{artistName}</span>
    </div>
    <div className="call-to-action">
      <Submit onClick={onSubmit} disabled={artistName === undefined || trackName === undefined} />
    </div>
  </div>
);
