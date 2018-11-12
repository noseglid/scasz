import * as React from 'react';
import { TrackObject } from '../SpotifyBindings';
import cn from 'classnames';

interface Props {
  trackObject: TrackObject;
  selected: boolean;
  onClick: () => void;
}

export const Track: React.FunctionComponent<Props> = ({ trackObject, selected, onClick }) => {
  let image = trackObject.album.images.find((i) => i.width === 640);
  if (image === undefined) {
    image = trackObject.album.images[0];
  }

  const className = cn('track', {
    'picker-option-selected': selected,
    'picker-option': true,
  });

  return (
    <>
      {selected && <div className="track picker-option dummy" />}
      <div className={className} style={{ backgroundImage: `url(${image.url})` }} onClick={onClick}>
        <p>{trackObject.name}</p>
      </div>
    </>
  );
};
