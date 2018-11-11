import './submit.scss';
import * as React from 'react';

interface Props {
  onClick: () => void;
  disabled?: boolean;
}

export const Submit = ({ onClick, disabled }: Props) => (
  <button disabled={disabled} className="submit" onClick={onClick}>
    Lock in!
  </button>
);
