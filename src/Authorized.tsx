import { parse } from 'querystring';
import { FunctionComponent, useEffect } from 'react';

interface Props {
  onActionToken: (token: string) => void;
}

const TOKEN_KEY = 'access_token';

export const Authorized: FunctionComponent<Props> = ({ onActionToken }) => {
  useEffect(() => {
    const currentToken = window.localStorage.getItem(TOKEN_KEY);
    const query = parse(window.location.hash.substr(1));
    var newToken = query.access_token as string;
    if (undefined === query.access_token || newToken === currentToken) {
      return;
    }
    window.localStorage.setItem('access_token', newToken);
    onActionToken(newToken);
  }, []);
  return null;
};
