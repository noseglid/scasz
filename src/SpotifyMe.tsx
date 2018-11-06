import * as React from 'react';

interface Props {
  access_token: string;
}

interface UserObject {
  id: string;
  birthdate: string;
  country: string;
  display_name: string;
}

interface State {
  user?: UserObject;
}

export class SpotifyMe extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const response = await fetch(`https://api.spotify.com/v1/me`, {
      headers: {
        Authorization: `Bearer ${this.props.access_token}`,
      },
    });

    const user: UserObject = await response.json();
    this.setState({ user });
  }

  render() {
    if (!this.state.user) {
      return null;
    }

    const {
      user: { id },
    } = this.state;

    console.log(this.state.user);
    return <h1>User {id}</h1>;
  }
}
