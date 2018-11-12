import React, { FunctionComponent, useEffect } from 'react';
import { parse } from 'querystring';
import { History } from 'history';

interface Props {
  history: History;
  onActionToken: (token: string) => void;
}

export const Authorized: FunctionComponent<Props> = ({ history, onActionToken }) => {
  useEffect(() => {
    const query = parse(window.location.hash.substr(1));
    var token = query.access_token as string;
    onActionToken(token);
    window.localStorage.setItem('access_token', token);
    history.push('/i');
  }, []);
  return <div>Logging in...</div>;
};
