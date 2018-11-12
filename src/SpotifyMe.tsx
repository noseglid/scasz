import React, { FunctionComponent, useEffect, useState } from 'react';

interface Props {
  access_token: string;
}

interface UserObject {
  id: string;
  birthdate: string;
  country: string;
  display_name: string;
}

export const SpotifyMe: FunctionComponent<Props> = ({ access_token }) => {
  const [user, setUser] = useState<UserObject | undefined>(undefined);
  useEffect(() => {
    const initialize = async () => {
      const response = await fetch(`https://api.spotify.com/v1/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setUser(await response.json());
    };

    initialize();
  }, []);

  if (user === undefined) {
    return null;
  }

  return <h1>User {user.id}</h1>;
};
