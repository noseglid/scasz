import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Authorized } from './Authorized';
import { GuessTrack } from './GuessTrack';
import { Header } from './Header';
import { Login } from './Login';
import './styles.scss';

export class App extends React.Component {
  render() {
    return (
      <>
        <Header />
        <BrowserRouter>
          <Switch>
            <Route exact path="/authorized" component={Authorized} />
            <Route exact strict path="/i" component={GuessTrack} />
            <Route exact path="/" component={Login} />
          </Switch>
        </BrowserRouter>
      </>
    );
  }
}
