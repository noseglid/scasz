import * as React from 'react';
import { ArtistObject } from './SpotifyBindings';
import cn from 'classnames';

interface Props {
  artist: ArtistObject;
  selected: boolean;
  onClick: () => void;
}

export const Artist: React.SFC<Props> = ({ artist, selected, onClick }) => {
  let image = artist.images.find((i) => i.width === 640);
  if (image === undefined) {
    image = artist.images[0];
  }

  const className = cn('artist', {
    'picker-option-selected': selected,
    'picker-option': true,
  });

  return (
    <>
      {selected && <div className="artist picker-option dummy" />}
      <div className={className} style={{ backgroundImage: `url(${image.url})` }} onClick={onClick}>
        <p>{artist.name}</p>
      </div>
    </>
  );
};
