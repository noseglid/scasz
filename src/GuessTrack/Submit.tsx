import './submit.scss';
import React, { FunctionComponent } from 'react';

interface Props {
  onClick: () => void;
  disabled?: boolean;
}

export const Submit: FunctionComponent<Props> = ({ onClick, disabled }) => (
  <button disabled={disabled} className="submit" onClick={onClick}>
    Lock in!
  </button>
);
