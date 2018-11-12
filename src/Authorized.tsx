import React, { FunctionComponent, useEffect } from 'react';
import { parse } from 'querystring';
import { History } from 'history';

interface Props {
  history: History;
}

export const Authorized: FunctionComponent<Props> = ({ history }) => {
  useEffect(() => {
    const query = parse(window.location.hash.substr(1));
    window.localStorage.setItem('access_token', query.access_token as string);
    history.push('/i');
  }, []);
  return <div>Logging in...</div>;
};
