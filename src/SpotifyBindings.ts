import { ParsedUrlQuery, stringify } from 'querystring';

export interface Image {
  height: number;
  width: number;
  url: string;
}

export interface SimplifiedArtistObject {
  id: string;
}

export interface ArtistObject {
  genres: string[];
  id: string;
  images: Image[];
  name: string;
  uri: string;
}

export interface AlbumObject {
  images: Image[];
}

export interface TrackObject {
  id: string;
  name: string;
  artists: SimplifiedArtistObject[];
  album: AlbumObject;
  uri: string;
}

export interface GetRecommendationsPayload {
  trackIDs?: string[];
  artistIDs?: string[];
}

interface PagedResponse<T> {
  items: T[];
}

export class Spotify {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  getAccessToken() {
    return this.accessToken;
  }

  private async request<T>(endpoint: string, query?: ParsedUrlQuery): Promise<T> {
    let qs = '';
    if (undefined !== query) {
      qs = `?${stringify(query)}`;
    }

    const response = await fetch(`https://api.spotify.com/v1/${endpoint}${qs}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      return Promise.reject(response.statusText);
    }

    return await response.json();
  }

  async getTrack(trackID: string): Promise<TrackObject> {
    return await this.request<TrackObject>(`tracks/${trackID}`);
  }

  async getArtist(artistID: string): Promise<ArtistObject> {
    return await this.request<ArtistObject>(`artists/${artistID}`);
  }

  async getRelatedArtists(artistID: string): Promise<ArtistObject[]> {
    interface Payload {
      artists: ArtistObject[];
    }
    return (await this.request<Payload>(`artists/${artistID}/related-artists`)).artists;
  }

  async getTopTracks(): Promise<TrackObject[]> {
    return (await this.request<PagedResponse<TrackObject>>(`me/top/tracks`)).items;
  }

  async getTopArtists(): Promise<ArtistObject[]> {
    return (await this.request<PagedResponse<ArtistObject>>(`me/top/artists`)).items;
  }

  async getRecommendations({
    artistIDs = [],
    trackIDs = [],
  }: GetRecommendationsPayload): Promise<TrackObject[]> {
    interface Payload {
      tracks: TrackObject[];
    }
    const query: ParsedUrlQuery = {};

    if (artistIDs.length > 0) {
      query.seed_artists = artistIDs.slice(0, 5).join(',');
    }
    if (trackIDs.length > 0) {
      query.seed_tracks = trackIDs.slice(0, Math.max(0, 5 - artistIDs.length)).join(',');
    }

    return (await this.request<Payload>(`recommendations`, query)).tracks;
  }
}
