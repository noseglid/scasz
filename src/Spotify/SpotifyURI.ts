export class SpotifyURI {
  private vendor: string;
  private type: string;
  private id: string;

  constructor(uri: string) {
    [this.vendor, this.type, this.id] = uri.split(':');
  }

  getVendor() {
    return this.vendor;
  }

  getType() {
    return this.type;
  }

  getId() {
    return this.id;
  }

  toString() {
    return `${this.vendor}:${this.type}:${this.id}`;
  }
}
