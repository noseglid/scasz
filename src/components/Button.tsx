import './Button.scss';
import * as React from 'react';

interface Props {
  onClick: () => void;
}

export const Button: React.SFC<Props> = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);
