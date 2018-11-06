import * as React from 'react';
import { parse } from 'querystring';
import { History } from 'history';

interface Props {
  history: History;
}

export class Authorized extends React.Component<Props> {
  componentDidMount() {
    const { history } = this.props;
    const query = parse(window.location.hash.substr(1));
    window.localStorage.setItem('access_token', query.access_token as string);
    history.push('/i');
  }

  render() {
    console.log('rendering Authorized');
    return 'Logging in...';
  }
}
